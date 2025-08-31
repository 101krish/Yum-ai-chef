import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getSavedRecipes, Recipe } from "@/services/recipeService";
import { RecipeCard } from "@/components/RecipeCard";
import { LoadingState } from "@/components/LoadingState";
import { Heart, ChefHat, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadSavedRecipes();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadSavedRecipes = async () => {
    try {
      const recipes = await getSavedRecipes();
      setSavedRecipes(recipes);
    } catch (error) {
      console.error('Failed to load saved recipes:', error);
      toast({
        title: "Failed to load saved recipes",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRecipe = async (recipeId: string) => {
    // This will be handled by the parent component's save/unsave logic
    await loadSavedRecipes();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-bold text-foreground">
              Sign In to View Saved Recipes
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Create an account or sign in to save your favorite recipes and access them anytime.
            </p>
            <Button onClick={() => navigate("/auth")} className="gap-2">
              <ChefHat className="w-4 h-4" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Recipes
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Saved Recipes
              </h1>
              <p className="text-muted-foreground">
                Your collection of favorite recipes ({savedRecipes.length})
              </p>
            </div>
          </div>

          {savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSave={handleRemoveRecipe}
                  isSaved={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No Saved Recipes Yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start exploring recipes and save your favorites to see them here.
              </p>
              <Button onClick={() => navigate("/")} className="gap-2">
                <ChefHat className="w-4 h-4" />
                Discover Recipes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedRecipes;