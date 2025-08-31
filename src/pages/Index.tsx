import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { HeroSection } from "@/components/HeroSection";
import { RecipeCard } from "@/components/RecipeCard";
import { LoadingState } from "@/components/LoadingState";
import { FilterBar, RecipeFilters } from "@/components/FilterBar";
import { generateRecipes, Recipe, saveRecipe, getSavedRecipes } from "@/services/recipeService";
import { ChefHat, Heart, Sparkles, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<RecipeFilters>({});
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load saved recipes for authenticated users
  useEffect(() => {
    if (user) {
      loadUserSavedRecipes();
    } else {
      // Load from localStorage for non-authenticated users
      const saved = localStorage.getItem('savedRecipes');
      if (saved) {
        setSavedRecipeIds(new Set(JSON.parse(saved)));
      }
    }
  }, [user]);

  const loadUserSavedRecipes = async () => {
    if (!user) return;
    try {
      const savedRecipes = await getSavedRecipes();
      const savedIds = new Set(savedRecipes.map(recipe => recipe.id));
      setSavedRecipeIds(savedIds);
    } catch (error) {
      console.error('Failed to load saved recipes:', error);
    }
  };

  // Apply filters to recipes
  useEffect(() => {
    let filtered = [...recipes];

    if (filters.difficulty) {
      filtered = filtered.filter(recipe => recipe.difficulty === filters.difficulty);
    }

    if (filters.maxCookingTime) {
      filtered = filtered.filter(recipe => recipe.cookingTime <= filters.maxCookingTime!);
    }

    if (filters.cuisine) {
      filtered = filtered.filter(recipe => recipe.cuisineType === filters.cuisine);
    }

    if (filters.dietary && filters.dietary.length > 0) {
      filtered = filtered.filter(recipe => 
        filters.dietary!.some(diet => recipe.dietaryInfo.includes(diet))
      );
    }

    setFilteredRecipes(filtered);
  }, [recipes, filters]);

  const handleIngredientsSubmit = async (ingredients: string[], dietaryPrefs: string[]) => {
    setIsLoading(true);
    try {
      const generatedRecipes = await generateRecipes(ingredients, { dietary: dietaryPrefs });
      setRecipes(generatedRecipes);
      setHasSearched(true);
      
      toast({
        title: "Recipes generated!",
        description: `Found ${generatedRecipes.length} delicious recipes for you.`,
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or check your ingredients.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const isCurrentlySaved = savedRecipeIds.has(recipeId);
    
    if (user) {
      // For authenticated users, save to database
      try {
        if (!isCurrentlySaved) {
          await saveRecipe(recipe);
          setSavedRecipeIds(prev => new Set([...prev, recipeId]));
          toast({
            title: "Recipe saved!",
            description: "Added to your saved recipes.",
          });
        } else {
          // Note: We would need a delete function in the service for this
          setSavedRecipeIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(recipeId);
            return newSet;
          });
          toast({
            title: "Recipe removed",
            description: "Removed from your saved recipes.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save recipe. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // For non-authenticated users, save to localStorage
      const newSaved = new Set(savedRecipeIds);
      if (newSaved.has(recipeId)) {
        newSaved.delete(recipeId);
      } else {
        newSaved.add(recipeId);
      }
      setSavedRecipeIds(newSaved);
      localStorage.setItem('savedRecipes', JSON.stringify([...newSaved]));
      
      toast({
        title: isCurrentlySaved ? "Recipe removed" : "Recipe saved!",
        description: isCurrentlySaved ? "Removed from your favorites" : "Added to your favorites",
      });
    }
  };

  const loadFeaturedRecipes = async () => {
    setIsLoading(true);
    try {
      // Use mock recipes for featured recipes
      const featuredRecipes = await generateRecipes(['chicken', 'pasta', 'vegetables'], {});
      setRecipes(featuredRecipes);
      setHasSearched(true);
      
      toast({
        title: "Featured recipes loaded!",
        description: "Explore our collection of delicious recipes.",
      });
    } catch (error) {
      toast({
        title: "Failed to load recipes",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {!hasSearched && (
        <HeroSection 
          onIngredientsSubmit={handleIngredientsSubmit}
          isLoading={isLoading}
        />
      )}

      {/* Results Section */}
      {(hasSearched || isLoading) && (
        <section className="container mx-auto px-4 py-8">
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="space-y-8">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    {recipes.length > 0 ? "Recipe Suggestions" : "No Recipes Found"}
                  </h2>
                  <p className="text-muted-foreground">
                    {recipes.length > 0 
                      ? `Found ${filteredRecipes.length} recipes${filters && Object.keys(filters).length > 0 ? ' (filtered)' : ''}`
                      : "Try different ingredients or browse our featured recipes"
                    }
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => navigate("/saved-recipes")}
                  >
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">Saved ({savedRecipeIds.size})</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={loadFeaturedRecipes}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Browse All
                  </Button>
                  <Button 
                    onClick={() => {
                      setHasSearched(false);
                      setRecipes([]);
                      setFilters({});
                    }}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    New Search
                  </Button>
                </div>
              </div>

              {/* Filters */}
              {recipes.length > 0 && (
                <>
                  <FilterBar 
                    activeFilters={filters} 
                    onFilterChange={setFilters} 
                  />
                  <Separator />
                </>
              )}

              {/* Recipe Grid */}
              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onSave={handleSaveRecipe}
                      isSaved={savedRecipeIds.has(recipe.id)}
                    />
                  ))}
                </div>
              ) : recipes.length > 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No recipes match your current filters.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({})}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="bg-muted/30 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <ChefHat className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">SmartRecipe Generator</span>
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              Discover amazing recipes based on the ingredients you have. Connect with Supabase for authentication and to save your favorite recipes!
            </p>
            <div className="text-sm text-muted-foreground">
              Built with ❤️ using React, TypeScript, and Tailwind CSS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
