
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { image_id } = await req.json()

    // Get image record
    const { data: imageRecord, error: fetchError } = await supabaseClient
      .from('generated_images')
      .select('*')
      .eq('id', image_id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !imageRecord) {
      throw new Error('Image not found')
    }

    if (imageRecord.status === 'completed' || imageRecord.status === 'failed') {
      return new Response(
        JSON.stringify({
          status: imageRecord.status,
          image_url: imageRecord.image_url,
          error_message: imageRecord.error_message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check Replicate status
    const replicateResponse = await fetch(
      `https://api.replicate.com/v1/predictions/${imageRecord.replicate_prediction_id}`,
      {
        headers: {
          'Authorization': `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
        },
      }
    )

    if (!replicateResponse.ok) {
      throw new Error(`Replicate API error: ${replicateResponse.statusText}`)
    }

    const prediction = await replicateResponse.json()

    let updateData: any = {
      status: prediction.status === 'succeeded' ? 'completed' : 
              prediction.status === 'failed' ? 'failed' : 'processing'
    }

    if (prediction.status === 'succeeded' && prediction.output && prediction.output[0]) {
      updateData.image_url = prediction.output[0]
      updateData.processing_time_ms = prediction.metrics?.predict_time ? 
        Math.round(prediction.metrics.predict_time * 1000) : null
    } else if (prediction.status === 'failed') {
      updateData.error_message = prediction.error || 'Generation failed'
    }

    // Update database
    await supabaseClient
      .from('generated_images')
      .update(updateData)
      .eq('id', image_id)

    return new Response(
      JSON.stringify({
        status: updateData.status,
        image_url: updateData.image_url,
        error_message: updateData.error_message,
        processing_time_ms: updateData.processing_time_ms
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Status check error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
