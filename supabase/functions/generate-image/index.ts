
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerationRequest {
  prompt: string
  style_preset?: string
  lighting_preset?: string
  composition_guide?: string
  artistic_style?: number
  creativity?: number
  mood?: number
  user_id: string
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

    const body: GenerationRequest = await req.json()
    
    // Create image record in database
    const { data: imageRecord, error: insertError } = await supabaseClient
      .from('generated_images')
      .insert({
        user_id: user.id,
        prompt: body.prompt,
        style_preset: body.style_preset || 'photorealistic',
        lighting_preset: body.lighting_preset || 'studio',
        composition_guide: body.composition_guide || 'rule-of-thirds',
        artistic_style: body.artistic_style || 75,
        creativity: body.creativity || 80,
        mood: body.mood || 60,
        status: 'processing',
        model: 'stable-diffusion-xl',
        parameters: {
          prompt: body.prompt,
          style: body.style_preset,
          lighting: body.lighting_preset,
          composition: body.composition_guide
        }
      })
      .select()
      .single()

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`)
    }

    // Enhanced prompt based on settings
    let enhancedPrompt = body.prompt
    
    if (body.style_preset === 'fashion') {
      enhancedPrompt += ', professional fashion photography, high fashion, editorial style'
    } else if (body.style_preset === 'portrait') {
      enhancedPrompt += ', professional portrait photography, studio lighting'
    } else if (body.style_preset === 'concept') {
      enhancedPrompt += ', conceptual art, artistic vision, creative composition'
    }

    if (body.lighting_preset === 'studio') {
      enhancedPrompt += ', professional studio lighting, controlled lighting'
    } else if (body.lighting_preset === 'natural') {
      enhancedPrompt += ', natural lighting, soft daylight'
    } else if (body.lighting_preset === 'dramatic') {
      enhancedPrompt += ', dramatic lighting, high contrast'
    }

    enhancedPrompt += ', high quality, professional, detailed, 8k resolution'

    // Call Replicate API
    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
          prompt: enhancedPrompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 20,
          guidance_scale: 7.5,
          prompt_strength: 0.8,
        }
      })
    })

    if (!replicateResponse.ok) {
      throw new Error(`Replicate API error: ${replicateResponse.statusText}`)
    }

    const prediction = await replicateResponse.json()

    // Update record with prediction ID
    await supabaseClient
      .from('generated_images')
      .update({
        replicate_prediction_id: prediction.id,
        status: 'processing'
      })
      .eq('id', imageRecord.id)

    // Deduct credits
    const { error: creditError } = await supabaseClient.rpc('deduct_credits_v2', {
      user_id: user.id,
      credits_to_deduct: 5,
      description: 'Image generation',
      reference_id: imageRecord.id,
      reference_type: 'image_generation'
    })

    if (creditError) {
      console.error('Credit deduction error:', creditError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        image_id: imageRecord.id,
        prediction_id: prediction.id,
        status: 'processing'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
