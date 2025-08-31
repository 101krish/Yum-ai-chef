import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Sparkles, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "../assets/hero-cooking.jpg";

interface HeroSectionProps {
  onIngredientsSubmit: (ingredients: string[], dietaryPrefs: string[]) => void;
  isLoading: boolean;
}

const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", 
  "Keto", "Low-Carb", "High-Protein", "Mediterranean"
];

export const HeroSection = ({ onIngredientsSubmit, isLoading }: HeroSectionProps) => {
  const [textInput, setTextInput] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      toast({
        title: "Image uploaded!",
        description: "We'll analyze your ingredients when you generate recipes.",
      });
    }
  };

  const toggleDietary = (option: string) => {
    setSelectedDietary(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    if (!textInput.trim() && !imageFile) {
      toast({
        title: "Add some ingredients!",
        description: "Please enter ingredients or upload an image to get started.",
        variant: "destructive",
      });
      return;
    }

    const ingredients = textInput.split(",").map(item => item.trim()).filter(Boolean);
    onIngredientsSubmit(ingredients, selectedDietary);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Text */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ChefHat className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Smart Recipe Generator
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold gradient-hero bg-clip-text text-transparent">
              Turn Your Ingredients Into Amazing Recipes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload photos of your ingredients or type them in. Our AI will suggest personalized recipes based on what you have!
            </p>
          </div>

          {/* Input Card */}
          <Card className="p-8 shadow-card backdrop-blur-sm bg-card/95 animate-slide-up">
            <div className="space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  What ingredients do you have?
                </label>
                <Textarea
                  placeholder="e.g., chicken breast, tomatoes, basil, garlic, pasta..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[100px] resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Or upload a photo of your ingredients
                </label>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors group"
                  >
                    {imageFile ? (
                      <div className="flex items-center gap-2 text-success">
                        <Upload className="w-5 h-5" />
                        <span className="font-medium">{imageFile.name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                        <Camera className="w-5 h-5" />
                        <span>Click to upload ingredient photo</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Dietary Preferences (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((option) => (
                    <Badge
                      key={option}
                      variant={selectedDietary.includes(option) ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => toggleDietary(option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                size="lg"
                className="w-full gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Generating Recipes...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Recipes</span>
                  </div>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};