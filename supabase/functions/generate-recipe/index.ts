import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients, preferences, cookingTime, difficulty } = await req.json();

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `Generate a detailed recipe based on the following:
- Available ingredients: ${ingredients.join(', ')}
- Dietary preferences: ${preferences?.join(', ') || 'None'}
- Preferred cooking time: ${cookingTime || 'Any'}
- Difficulty level: ${difficulty || 'Any'}

Please provide:
1. Recipe title
2. Complete ingredient list with quantities
3. Step-by-step cooking instructions
4. Cooking time and difficulty level
5. Nutritional information (estimated calories, protein, carbs, fat)
6. Cuisine type
7. Any dietary tags (vegetarian, gluten-free, etc.)

Format the response as JSON with the following structure:
{
  "title": "Recipe Name",
  "ingredients": ["ingredient with quantity", ...],
  "instructions": ["step 1", "step 2", ...],
  "cookingTime": 30,
  "difficulty": "Easy|Medium|Hard",
  "nutritionalInfo": {
    "calories": 400,
    "protein": "25g",
    "carbs": "30g",
    "fat": "15g"
  },
  "cuisineType": "Italian",
  "dietaryInfo": ["vegetarian", "gluten-free"]
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a professional chef and nutritionist. Generate creative, practical recipes based on available ingredients. Always respond with valid JSON only.\n\n${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    const recipeContent = data.candidates[0].content.parts[0].text;
    
    try {
      // Clean the response - remove any markdown formatting
      const cleanContent = recipeContent.replace(/```json\s*|\s*```/g, '').trim();
      const recipe = JSON.parse(cleanContent);
      return new Response(JSON.stringify({ recipe }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', recipeContent);
      throw new Error('Invalid recipe format received from AI');
    }

  } catch (error) {
    console.error('Error in generate-recipe function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate recipe'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});