
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GenerationParams {
  prompt: string;
  style_preset?: string;
  lighting_preset?: string;
  composition_guide?: string;
  artistic_style?: number;
  creativity?: number;
  mood?: number;
}

interface GenerationResult {
  image_id: string;
  prediction_id: string;
  status: string;
}

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  const generateImage = async (params: GenerationParams): Promise<GenerationResult | null> => {
    try {
      setIsGenerating(true);
      setGenerationProgress(10);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please log in to generate images');
      }

      setGenerationProgress(20);

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          ...params,
          user_id: user.id
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setGenerationProgress(30);

      toast({
        title: "Generation Started",
        description: "Your image is being created. This may take a few moments.",
      });

      return data;

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const checkGenerationStatus = async (imageId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('check-generation-status', {
        body: { image_id: imageId }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Status check error:', error);
      return null;
    }
  };

  const pollGenerationStatus = async (imageId: string, onUpdate: (status: any) => void) => {
    const pollInterval = setInterval(async () => {
      const status = await checkGenerationStatus(imageId);
      
      if (status) {
        onUpdate(status);
        
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(pollInterval);
          
          if (status.status === 'completed') {
            toast({
              title: "Image Generated!",
              description: "Your artistic creation is ready.",
            });
          } else {
            toast({
              title: "Generation Failed",
              description: status.error_message || "Failed to generate image",
              variant: "destructive",
            });
          }
        }
      }
    }, 2000);

    return pollInterval;
  };

  return {
    isGenerating,
    generationProgress,
    generateImage,
    checkGenerationStatus,
    pollGenerationStatus
  };
};
