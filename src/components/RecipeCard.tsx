import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Users, 
  Heart, 
  ChefHat,
  Flame,
  Star,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisineType: string;
  dietaryInfo: string[];
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

interface RecipeCardProps {
  recipe: Recipe;
  onSave?: (recipeId: string) => void;
  isSaved?: boolean;
}

export const RecipeCard = ({ recipe, onSave, isSaved = false }: RecipeCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const { toast } = useToast();

  const handleSave = () => {
    setSaved(!saved);
    onSave?.(recipe.id);
    toast({
      title: saved ? "Recipe removed" : "Recipe saved!",
      description: saved ? "Removed from your favorites" : "Added to your favorites",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-success";
      case "Medium": return "text-warning"; 
      case "Hard": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-card hover:shadow-glow transition-all duration-300 group overflow-hidden">
      <CardHeader className="space-y-4">
        {/* Recipe Title & Save Button */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-bold text-foreground line-clamp-2">
              {recipe.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              A delicious recipe made with {recipe.ingredients.slice(0, 3).join(', ')}
              {recipe.ingredients.length > 3 && ` and ${recipe.ingredients.length - 3} more ingredients`}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="shrink-0"
          >
            <Heart className={`w-5 h-5 ${saved ? 'fill-destructive text-destructive' : 'text-muted-foreground hover:text-destructive'} transition-colors`} />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className={`flex items-center gap-1 ${getDifficultyColor(recipe.difficulty)}`}>
            <ChefHat className="w-4 h-4" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>

        {/* Dietary Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {recipe.cuisineType}
          </Badge>
          {recipe.dietaryInfo.map((info) => (
            <Badge key={info} variant="outline" className="text-xs">
              {info}
            </Badge>
          ))}
        </div>

        {/* Nutrition Info */}
        <div className="grid grid-cols-4 gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Flame className="w-3 h-3" />
              <span>Cal</span>
            </div>
            <div className="font-semibold text-sm">{recipe.nutritionalInfo.calories}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Protein</div>
            <div className="font-semibold text-sm">{recipe.nutritionalInfo.protein}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Carbs</div>
            <div className="font-semibold text-sm">{recipe.nutritionalInfo.carbs}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Fat</div>
            <div className="font-semibold text-sm">{recipe.nutritionalInfo.fat}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Expand/Collapse Button */}
        <Button 
          variant="outline" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          {isExpanded ? "Hide Recipe" : "View Full Recipe"}
        </Button>

        {/* Expanded Recipe Details */}
        {isExpanded && (
          <div className="space-y-6 animate-fade-in">
            <Separator />
            
            {/* Ingredients */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Ingredients
              </h4>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm text-muted-foreground pl-4 relative">
                    <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-primary rounded-full"></span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Instructions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-primary" />
                Instructions
              </h4>
              <ol className="space-y-3">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="flex-1 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};