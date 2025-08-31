import { supabase } from '@/integrations/supabase/client';

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisineType: string;
  dietaryInfo: string[];
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

// Mock recipe database for fallback
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    ingredients: ['400g spaghetti', '4 large eggs', '200g bacon or pancetta', '100g parmesan cheese', 'black pepper', 'salt'],
    instructions: [
      'Cook spaghetti according to package directions',
      'Fry bacon until crispy',
      'Beat eggs with parmesan cheese',
      'Mix hot pasta with egg mixture',
      'Add bacon and serve immediately'
    ],
    cookingTime: 20,
    difficulty: 'Medium' as const,
    cuisineType: 'Italian',
    dietaryInfo: [],
    nutritionalInfo: {
      calories: 550,
      protein: '25g',
      carbs: '45g',
      fat: '30g'
    }
  },
  {
    id: '2',
    title: 'Vegetable Stir Fry',
    ingredients: ['2 cups mixed vegetables', '3 tbsp soy sauce', '3 cloves garlic', '1 inch ginger', '2 cups rice', '2 tbsp oil'],
    instructions: [
      'Heat oil in wok',
      'Add garlic and ginger',
      'Stir fry vegetables for 5 minutes',
      'Add soy sauce',
      'Serve over rice'
    ],
    cookingTime: 15,
    difficulty: 'Easy' as const,
    cuisineType: 'Asian',
    dietaryInfo: ['Vegetarian', 'Vegan'],
    nutritionalInfo: {
      calories: 280,
      protein: '8g',
      carbs: '55g',
      fat: '5g'
    }
  },
  {
    id: '3',
    title: 'Chicken Tikka Masala',
    ingredients: ['500g chicken breast', '1 cup yogurt', '2 tbsp tikka masala paste', '1 can tomatoes', '1 cup cream', 'basmati rice'],
    instructions: [
      'Marinate chicken in yogurt and spices for 30 minutes',
      'Cook chicken in a hot pan until browned',
      'Add tomatoes and tikka masala paste',
      'Simmer for 15 minutes',
      'Stir in cream and serve with rice'
    ],
    cookingTime: 45,
    difficulty: 'Medium' as const,
    cuisineType: 'Indian',
    dietaryInfo: [],
    nutritionalInfo: {
      calories: 420,
      protein: '35g',
      carbs: '20g',
      fat: '25g'
    }
  },
  {
    id: '4',
    title: 'Caesar Salad',
    ingredients: ['2 romaine lettuce heads', '1/2 cup parmesan', '1/4 cup croutons', 'caesar dressing', '2 chicken breasts', 'black pepper'],
    instructions: [
      'Grill chicken breasts and slice',
      'Chop romaine lettuce',
      'Toss lettuce with caesar dressing',
      'Top with chicken, parmesan, and croutons',
      'Season with black pepper'
    ],
    cookingTime: 25,
    difficulty: 'Easy' as const,
    cuisineType: 'American',
    dietaryInfo: [],
    nutritionalInfo: {
      calories: 350,
      protein: '30g',
      carbs: '15g',
      fat: '20g'
    }
  },
  {
    id: '5',
    title: 'Beef Tacos',
    ingredients: ['500g ground beef', '8 taco shells', '1 cup cheese', '2 tomatoes', '1 lettuce head', 'taco seasoning', 'sour cream'],
    instructions: [
      'Brown ground beef in a pan',
      'Add taco seasoning and cook for 5 minutes',
      'Warm taco shells',
      'Fill shells with beef',
      'Top with cheese, lettuce, tomatoes, and sour cream'
    ],
    cookingTime: 20,
    difficulty: 'Easy' as const,
    cuisineType: 'Mexican',
    dietaryInfo: [],
    nutritionalInfo: {
      calories: 380,
      protein: '28g',
      carbs: '25g',
      fat: '22g'
    }
  },
  {
    id: '6',
    title: 'Mushroom Risotto',
    ingredients: ['1.5 cups arborio rice', '4 cups vegetable broth', '300g mushrooms', '1 onion', '1/2 cup white wine', 'parmesan cheese'],
    instructions: [
      'Sauté onions and mushrooms',
      'Add rice and stir for 2 minutes',
      'Add wine and let it absorb',
      'Gradually add warm broth, stirring constantly',
      'Cook until creamy, about 20 minutes',
      'Stir in parmesan cheese'
    ],
    cookingTime: 35,
    difficulty: 'Hard' as const,
    cuisineType: 'Italian',
    dietaryInfo: ['Vegetarian'],
    nutritionalInfo: {
      calories: 320,
      protein: '12g',
      carbs: '55g',
      fat: '8g'
    }
  },
  {
    id: '7',
    title: 'Greek Salad',
    ingredients: ['3 tomatoes', '1 cucumber', '1 red onion', '200g feta cheese', '1/2 cup olives', 'olive oil', 'oregano', 'lemon juice'],
    instructions: [
      'Chop tomatoes, cucumber, and red onion',
      'Combine vegetables in a large bowl',
      'Add olives and crumbled feta',
      'Drizzle with olive oil and lemon juice',
      'Season with oregano and serve'
    ],
    cookingTime: 10,
    difficulty: 'Easy' as const,
    cuisineType: 'Mediterranean',
    dietaryInfo: ['Vegetarian', 'Gluten-Free'],
    nutritionalInfo: {
      calories: 220,
      protein: '8g',
      carbs: '12g',
      fat: '18g'
    }
  },
  {
    id: '8',
    title: 'Salmon Teriyaki',
    ingredients: ['4 salmon fillets', '1/4 cup teriyaki sauce', '2 tbsp honey', '1 tbsp sesame oil', '2 cups broccoli', 'jasmine rice'],
    instructions: [
      'Mix teriyaki sauce with honey',
      'Marinate salmon for 15 minutes',
      'Heat sesame oil in a pan',
      'Cook salmon for 4 minutes each side',
      'Steam broccoli and serve with rice'
    ],
    cookingTime: 30,
    difficulty: 'Medium' as const,
    cuisineType: 'Asian',
    dietaryInfo: [],
    nutritionalInfo: {
      calories: 450,
      protein: '35g',
      carbs: '30g',
      fat: '22g'
    }
  },
  {
    id: '9',
    title: 'Margherita Pizza',
    ingredients: ['pizza dough', '1/2 cup tomato sauce', '200g mozzarella', 'fresh basil', 'olive oil', 'salt'],
    instructions: [
      'Preheat oven to 475°F',
      'Roll out pizza dough',
      'Spread tomato sauce evenly',
      'Add mozzarella cheese',
      'Bake for 12-15 minutes',
      'Top with fresh basil and olive oil'
    ],
    cookingTime: 25,
    difficulty: 'Medium' as const,
    cuisineType: 'Italian',
    dietaryInfo: ['Vegetarian'],
    nutritionalInfo: {
      calories: 380,
      protein: '18g',
      carbs: '45g',
      fat: '15g'
    }
  },
  {
    id: '10',
    title: 'Quinoa Buddha Bowl',
    ingredients: ['1 cup quinoa', '2 cups kale', '1 avocado', '1/2 cup chickpeas', '1/4 cup tahini', '2 tbsp lemon juice', 'cherry tomatoes'],
    instructions: [
      'Cook quinoa according to package directions',
      'Massage kale with a little olive oil',
      'Roast chickpeas until crispy',
      'Slice avocado and halve cherry tomatoes',
      'Whisk tahini with lemon juice for dressing',
      'Arrange all ingredients in a bowl and drizzle with dressing'
    ],
    cookingTime: 25,
    difficulty: 'Easy' as const,
    cuisineType: 'Mediterranean',
    dietaryInfo: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    nutritionalInfo: {
      calories: 420,
      protein: '15g',
      carbs: '45g',
      fat: '22g'
    }
  },
  {
    id: '11',
    title: 'Chicken Pad Thai',
    ingredients: ['200g rice noodles', '300g chicken', '2 eggs', '3 tbsp tamarind paste', '2 tbsp fish sauce', 'bean sprouts', 'peanuts', 'lime'],
    instructions: [
      'Soak rice noodles in warm water',
      'Stir-fry chicken until cooked',
      'Push chicken aside, scramble eggs',
      'Add drained noodles and sauces',
      'Toss with bean sprouts',
      'Serve with peanuts and lime wedges'
    ],
    cookingTime: 20,
    difficulty: 'Medium' as const,
    cuisineType: 'Thai',
    dietaryInfo: [],
    nutritionalInfo: {
      calories: 480,
      protein: '25g',
      carbs: '55g',
      fat: '18g'
    }
  },
  {
    id: '12',
    title: 'Lemon Herb Roasted Chicken',
    ingredients: ['1 whole chicken', '2 lemons', 'rosemary', 'thyme', 'garlic', 'olive oil', 'potatoes', 'carrots'],
    instructions: [
      'Preheat oven to 425°F',
      'Rub chicken with herbs, lemon, and olive oil',
      'Stuff cavity with lemon and herbs',
      'Surround with chopped potatoes and carrots',
      'Roast for 60-75 minutes until golden',
      'Let rest 10 minutes before carving'
    ],
    cookingTime: 90,
    difficulty: 'Medium' as const,
    cuisineType: 'American',
    dietaryInfo: [],
    nutritionalInfo: {
      calories: 520,
      protein: '45g',
      carbs: '25g',
      fat: '28g'
    }
  }
];

export const generateRecipes = async (
  ingredients: string[],
  preferences: {
    dietary?: string[];
    cookingTime?: string;
    difficulty?: string;
  } = {}
): Promise<Recipe[]> => {
  try {
    // Call the Supabase edge function
    const { data, error } = await supabase.functions.invoke('generate-recipe', {
      body: {
        ingredients,
        preferences: preferences.dietary,
        cookingTime: preferences.cookingTime,
        difficulty: preferences.difficulty
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }

    if (data?.recipe) {
      // Transform the AI response to match our Recipe interface
      const aiRecipe = data.recipe;
      const transformedRecipe: Recipe = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: aiRecipe.title,
        ingredients: aiRecipe.ingredients,
        instructions: aiRecipe.instructions,
        cookingTime: aiRecipe.cookingTime || 30,
        difficulty: aiRecipe.difficulty || 'Medium',
        cuisineType: aiRecipe.cuisineType || 'International',
        dietaryInfo: aiRecipe.dietaryInfo || [],
        nutritionalInfo: aiRecipe.nutritionalInfo || {
          calories: 400,
          protein: '20g',
          carbs: '40g',
          fat: '15g'
        }
      };

      return [transformedRecipe, ...getAdditionalMockRecipes(ingredients, preferences, 7)];
    }

    throw new Error('No recipe generated');

  } catch (error) {
    console.error('Failed to generate AI recipe:', error);
    
    // Enhanced fallback logic with better variety
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const availableIngredients = ingredients.map(ing => ing.toLowerCase());
    let matchingRecipes = [...mockRecipes];
    
    // Randomize the order to ensure variety
    matchingRecipes = matchingRecipes.sort(() => Math.random() - 0.5);
    
    // Filter by ingredient matches
    const ingredientMatches = matchingRecipes.filter(recipe => 
      recipe.ingredients.some(ingredient => 
        availableIngredients.some(available => 
          ingredient.toLowerCase().includes(available) ||
          available.includes(ingredient.toLowerCase())
        )
      )
    );

    // If no ingredient matches, use all recipes with randomization
    let filteredRecipes = ingredientMatches.length > 0 ? ingredientMatches : matchingRecipes;
    
    // Apply preference filters
    if (preferences.difficulty) {
      const difficultyMatch = filteredRecipes.filter(recipe => 
        recipe.difficulty === preferences.difficulty
      );
      if (difficultyMatch.length > 0) {
        filteredRecipes = difficultyMatch;
      }
    }
    
    if (preferences.cookingTime) {
      const maxTime = parseInt(preferences.cookingTime);
      if (!isNaN(maxTime)) {
        const timeMatch = filteredRecipes.filter(recipe => 
          recipe.cookingTime <= maxTime
        );
        if (timeMatch.length > 0) {
          filteredRecipes = timeMatch;
        }
      }
    }

    if (preferences.dietary && preferences.dietary.length > 0) {
      const dietaryMatch = filteredRecipes.filter(recipe =>
        preferences.dietary!.some(diet => recipe.dietaryInfo.includes(diet))
      );
      if (dietaryMatch.length > 0) {
        filteredRecipes = dietaryMatch;
      }
    }

    // Generate unique IDs to prevent caching issues
    const recipesWithUniqueIds = filteredRecipes.slice(0, 8).map(recipe => ({
      ...recipe,
      id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));

    return recipesWithUniqueIds.length > 0 ? recipesWithUniqueIds : 
      mockRecipes.slice(0, 6).map(recipe => ({
        ...recipe,
        id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
  }
};

// Helper function to get additional mock recipes
const getAdditionalMockRecipes = (
  ingredients: string[], 
  preferences: { dietary?: string[]; cookingTime?: string; difficulty?: string; }, 
  count: number
): Recipe[] => {
  const availableIngredients = ingredients.map(ing => ing.toLowerCase());
  let additionalRecipes = [...mockRecipes];
  
  // Randomize the order
  additionalRecipes = additionalRecipes.sort(() => Math.random() - 0.5);
  
  // Filter by ingredient matches first
  const ingredientMatches = additionalRecipes.filter(recipe => 
    recipe.ingredients.some(ingredient => 
      availableIngredients.some(available => 
        ingredient.toLowerCase().includes(available) ||
        available.includes(ingredient.toLowerCase())
      )
    )
  );

  let filteredRecipes = ingredientMatches.length > 0 ? ingredientMatches : additionalRecipes;
  
  // Apply preference filters
  if (preferences.difficulty) {
    const difficultyMatch = filteredRecipes.filter(recipe => 
      recipe.difficulty === preferences.difficulty
    );
    if (difficultyMatch.length > 0) {
      filteredRecipes = difficultyMatch;
    }
  }
  
  if (preferences.cookingTime) {
    const maxTime = parseInt(preferences.cookingTime);
    if (!isNaN(maxTime)) {
      const timeMatch = filteredRecipes.filter(recipe => 
        recipe.cookingTime <= maxTime
      );
      if (timeMatch.length > 0) {
        filteredRecipes = timeMatch;
      }
    }
  }

  if (preferences.dietary && preferences.dietary.length > 0) {
    const dietaryMatch = filteredRecipes.filter(recipe =>
      preferences.dietary!.some(diet => recipe.dietaryInfo.includes(diet))
    );
    if (dietaryMatch.length > 0) {
      filteredRecipes = dietaryMatch;
    }
  }

  // Return the requested count with unique IDs
  return filteredRecipes.slice(0, count).map(recipe => ({
    ...recipe,
    id: `additional_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }));
};

export const saveRecipe = async (recipe: Recipe): Promise<void> => {
  const { error } = await supabase
    .from('saved_recipes')
    .insert({
      recipe_data: recipe as any,
      user_id: (await supabase.auth.getUser()).data.user?.id
    });

  if (error) {
    throw error;
  }
};

export const getSavedRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from('saved_recipes')
    .select('recipe_data')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data?.map(item => item.recipe_data as unknown as Recipe) || [];
};