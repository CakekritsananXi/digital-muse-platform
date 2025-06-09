import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Image, Star, Settings, Palette, Grid3X3, Sun, Moon, Lightbulb, Save, History, Share2, Download, Play, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { GenerationMonitor } from "@/components/GenerationMonitor";

export const CreativeStudio = () => {
  const [selectedStyle, setSelectedStyle] = useState("photorealistic");
  const [prompt, setPrompt] = useState("Professional fashion portrait with dramatic studio lighting");
  const [artisticStyle, setArtisticStyle] = useState([75]);
  const [creativity, setCreativity] = useState([80]);
  const [mood, setMood] = useState([60]);
  const [lighting, setLighting] = useState("studio");
  const [composition, setComposition] = useState("rule-of-thirds");
  const [currentImage, setCurrentImage] = useState("https://i.postimg.cc/MGvX0j5n/LINE-ALBUM-2025-5-30-250607-1.jpg");
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [currentGeneration, setCurrentGeneration] = useState<any>(null);

  const { isGenerating, generationProgress, generateImage, pollGenerationStatus } = useImageGeneration();
  const { toast } = useToast();
  const { user } = useAuth();

  const styleCategories = {
    artistic: [
      { id: "photorealistic", name: "Photorealistic", description: "Ultra-realistic photography style" },
      { id: "painterly", name: "Painterly", description: "Artistic painting techniques" },
      { id: "conceptual", name: "Conceptual", description: "Abstract and conceptual art" }
    ],
    photography: [
      { id: "fashion", name: "Fashion Photography", icon: Camera, preview: "https://i.postimg.cc/MGvX0j5n/LINE-ALBUM-2025-5-30-250607-1.jpg" },
      { id: "portrait", name: "Portrait Art", icon: Image, preview: "https://i.postimg.cc/Y0fS2Nrs/LINE-ALBUM-2025-5-30-250607-2.jpg" },
      { id: "concept", name: "Concept Art", icon: Star, preview: "https://i.postimg.cc/SNksTPVF/LINE-ALBUM-2025-5-30-250607-3.jpg" }
    ]
  };

  const lightingPresets = [
    { id: "studio", name: "Studio", icon: Lightbulb, description: "Professional studio lighting" },
    { id: "natural", name: "Natural", icon: Sun, description: "Soft natural daylight" },
    { id: "dramatic", name: "Dramatic", icon: Moon, description: "High contrast dramatic lighting" }
  ];

  const compositionGuides = [
    { id: "rule-of-thirds", name: "Rule of Thirds", icon: Grid3X3 },
    { id: "golden-ratio", name: "Golden Ratio", icon: Grid3X3 },
    { id: "centered", name: "Centered", icon: Grid3X3 }
  ];

  const colorPalettes = [
    { id: "warm", name: "Warm", colors: ["#FF6B35", "#F7931E", "#FFD23F"] },
    { id: "cool", name: "Cool", colors: ["#4ECDC4", "#45B7D1", "#96CEB4"] },
    { id: "monochrome", name: "Monochrome", colors: ["#2C3E50", "#7F8C8D", "#BDC3C7"] },
    { id: "vibrant", name: "Vibrant", colors: ["#E74C3C", "#9B59B6", "#3498DB"] }
  ];

  const promptLibrary = [
    "Elegant fashion portrait with dramatic rim lighting and minimalist background",
    "Conceptual art piece featuring surreal geometric forms in ethereal atmosphere",
    "Professional headshot with soft studio lighting and natural expression",
    "Abstract artistic composition with flowing organic shapes and vibrant colors"
  ];

  // Load user's generated images
  useEffect(() => {
    if (user) {
      loadGeneratedImages();
    }
  }, [user]);

  const loadGeneratedImages = async () => {
    try {
      if (!user) return;

      const { data: images, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading images:', error);
        return;
      }

      setGeneratedImages(images || []);
      
      // Set the most recent completed image as current
      const latestCompleted = images?.find(img => img.status === 'completed' && img.image_url);
      if (latestCompleted) {
        setCurrentImage(latestCompleted.image_url);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const handleGenerate = async () => {
    console.log('Starting test generation with monitoring...');
    
    const result = await generateImage({
      prompt,
      style_preset: selectedStyle,
      lighting_preset: lighting,
      composition_guide: composition,
      artistic_style: artisticStyle[0],
      creativity: creativity[0],
      mood: mood[0]
    });

    if (result) {
      setCurrentGeneration(result);
      
      console.log(`Test case started: ${result.image_id}`);
      console.log('Monitoring parameters:', {
        style: selectedStyle,
        lighting,
        composition,
        artistic_style: artisticStyle[0],
        creativity: creativity[0],
        mood: mood[0]
      });
      
      // Start polling for status with enhanced logging
      const pollInterval = await pollGenerationStatus(result.image_id, (status) => {
        console.log(`Status update for ${result.image_id}:`, status);
        
        if (status.status === 'completed' && status.image_url) {
          console.log(`Generation completed successfully: ${status.image_url}`);
          setCurrentImage(status.image_url);
          loadGeneratedImages();
          setCurrentGeneration(null);
          
          toast({
            title: "Test Generation Complete",
            description: "Image generated successfully with full monitoring data captured.",
          });
        } else if (status.status === 'failed') {
          console.error(`Generation failed:`, status.error_message);
          setCurrentGeneration(null);
        }
      });

      // Cleanup interval after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        setCurrentGeneration(null);
      }, 300000);
    }
  };

  if (!user) {
    return (
      <section id="studio" className="py-20 relative">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xl text-foreground/70">Please sign in to access the Creative Studio</p>
        </div>
      </section>
    );
  }

  return (
    <section id="studio" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold mb-6">
            Professional Creative{" "}
            <span className="gradient-text">Studio</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Advanced creative workspace with professional-grade AI image generation and comprehensive monitoring
          </p>
        </div>

        {/* Add monitoring component */}
        <div className="mb-8">
          <GenerationMonitor />
        </div>

        {/* Split-screen Layout */}
        <div className="grid lg:grid-cols-5 gap-6 min-h-[800px]">
          
          {/* Left Panel - Controls */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Project Management */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-playfair font-semibold gradient-text">Test Environment</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-gold-500/30">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="border-gold-500/30">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </div>
              </div>
              <div className="text-sm text-foreground/60">
                <p>Current Session: "Test Generation with Monitoring"</p>
                <p>Generated Images: {generatedImages.length}</p>
                <p>User: {user?.email}</p>
              </div>
            </Card>

            {/* Creative Controls Tabs */}
            <Card className="glass-card p-6">
              <Tabs defaultValue="style" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-black/20">
                  <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
                  <TabsTrigger value="lighting" className="text-xs">Light</TabsTrigger>
                  <TabsTrigger value="composition" className="text-xs">Comp</TabsTrigger>
                  <TabsTrigger value="mood" className="text-xs">Mood</TabsTrigger>
                </TabsList>

                <TabsContent value="style" className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gold-400">Artistic Style</label>
                    <div className="grid gap-2">
                      {styleCategories.artistic.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`text-left p-3 rounded-lg border transition-all ${
                            selectedStyle === style.id
                              ? 'border-gold-500 bg-gold-500/10'
                              : 'border-gold-500/20 bg-black/20 hover:border-gold-500/40'
                          }`}
                        >
                          <div className="font-semibold text-sm">{style.name}</div>
                          <div className="text-xs text-foreground/60">{style.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="lighting" className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gold-400">Lighting Preset</label>
                    <div className="grid gap-2">
                      {lightingPresets.map((preset) => {
                        const IconComponent = preset.icon;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => setLighting(preset.id)}
                            className={`text-left p-3 rounded-lg border transition-all flex items-center ${
                              lighting === preset.id
                                ? 'border-gold-500 bg-gold-500/10'
                                : 'border-gold-500/20 bg-black/20 hover:border-gold-500/40'
                            }`}
                          >
                            <IconComponent className="w-4 h-4 mr-3 text-gold-400" />
                            <div>
                              <div className="font-semibold text-sm">{preset.name}</div>
                              <div className="text-xs text-foreground/60">{preset.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="composition" className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gold-400">Composition Guide</label>
                    <div className="grid gap-2">
                      {compositionGuides.map((guide) => {
                        const IconComponent = guide.icon;
                        return (
                          <button
                            key={guide.id}
                            onClick={() => setComposition(guide.id)}
                            className={`text-left p-3 rounded-lg border transition-all flex items-center ${
                              composition === guide.id
                                ? 'border-gold-500 bg-gold-500/10'
                                : 'border-gold-500/20 bg-black/20 hover:border-gold-500/40'
                            }`}
                          >
                            <IconComponent className="w-4 h-4 mr-3 text-gold-400" />
                            <span className="font-semibold text-sm">{guide.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mood" className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gold-400">Color Palette</label>
                    <div className="grid grid-cols-2 gap-2">
                      {colorPalettes.map((palette) => (
                        <button
                          key={palette.id}
                          className="p-3 rounded-lg border border-gold-500/20 bg-black/20 hover:border-gold-500/40 transition-all"
                        >
                          <div className="flex space-x-1 mb-2">
                            {palette.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="text-xs font-semibold">{palette.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Parameter Controls */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-playfair font-semibold mb-4 gradient-text">Fine-tune Parameters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gold-400">
                    Artistic Style: {artisticStyle[0]}%
                  </label>
                  <Slider
                    value={artisticStyle}
                    onValueChange={setArtisticStyle}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gold-400">
                    Creativity: {creativity[0]}%
                  </label>
                  <Slider
                    value={creativity}
                    onValueChange={setCreativity}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gold-400">
                    Mood Intensity: {mood[0]}%
                  </label>
                  <Slider
                    value={mood}
                    onValueChange={setMood}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>

            {/* Prompt Library */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-playfair font-semibold mb-4 gradient-text">Test Prompts</h3>
              <div className="space-y-2">
                {promptLibrary.map((promptText, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(promptText)}
                    className="w-full text-left p-3 rounded-lg border border-gold-500/20 bg-black/20 hover:border-gold-500/40 transition-all text-sm"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex space-x-2">
                <Badge variant="outline" className="border-gold-500/30 text-gold-400">Test Case</Badge>
                <Badge variant="outline" className="border-gold-500/30 text-gold-400">Monitored</Badge>
              </div>
            </Card>
          </div>

          {/* Right Panel - Canvas & Preview */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Main Canvas */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-playfair font-semibold gradient-text">Test Canvas</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-gold-500/30">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="border-gold-500/30">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              {/* Prompt Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gold-400">Test Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-black/30 border border-gold-500/20 rounded-lg p-4 text-foreground focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                  rows={3}
                  placeholder="Enter your test prompt for monitoring..."
                />
              </div>

              {/* Canvas Area with Composition Guide */}
              <div className="relative aspect-square bg-black/30 rounded-lg border border-gold-500/20 overflow-hidden">
                <img
                  src={currentImage}
                  alt="Canvas preview"
                  className="w-full h-full object-cover"
                />
                
                {/* Composition Grid Overlay */}
                {composition === "rule-of-thirds" && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="border border-gold-500/20" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Generation Progress Overlay */}
                {(isGenerating || currentGeneration) && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                      <p className="text-lg font-semibold mb-2">Test Generation Running</p>
                      <p className="text-sm text-foreground/80 mb-4">Monitoring all systems during generation...</p>
                      <Progress value={generationProgress} className="w-full max-w-xs mx-auto" />
                    </div>
                  </div>
                )}
                
                {/* Generation Status */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 flex items-center justify-between">
                    <div className="text-sm text-foreground/80">
                      Resolution: 1024×1024 • Style: {selectedStyle} • {lighting} lighting • Monitored
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-400 hover:to-gold-500"
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Test
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Version History */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-playfair font-semibold mb-4 gradient-text">Test Results</h3>
              <div className="grid grid-cols-4 gap-3">
                {generatedImages.slice(0, 8).map((image, index) => (
                  <div key={image.id} className="relative artistic-frame premium-hover aspect-square group">
                    {image.status === 'completed' && image.image_url ? (
                      <img
                        src={image.image_url}
                        alt={`Test ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setCurrentImage(image.image_url)}
                      />
                    ) : image.status === 'processing' ? (
                      <div className="w-full h-full bg-black/30 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gold-400" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-black/30 flex items-center justify-center">
                        <span className="text-xs text-red-400">Failed</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Badge className={`${
                        image.status === 'completed' ? 'bg-green-500' :
                        image.status === 'processing' ? 'bg-yellow-500' :
                        'bg-red-500'
                      } text-white`}>
                        {image.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
