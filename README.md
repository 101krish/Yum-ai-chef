# 🍳 Chef Smart Recipe Generator

A modern, AI-powered recipe generator that transforms your available ingredients into delicious recipes. Built with React, TypeScript, and integrated with Supabase for user authentication and data persistence.

## ✨ Features

- **🥘 Ingredient-Based Recipe Generation**: Input ingredients you have and get personalized recipe suggestions
- **📸 Image Upload**: Upload photos of your ingredients for AI-powered ingredient recognition
- **🥗 Dietary Preferences**: Filter recipes by dietary requirements (Vegetarian, Vegan, Keto, etc.)
- **💾 Save Recipes**: Bookmark your favorite recipes with user authentication
- **🔍 Advanced Filtering**: Filter recipes by difficulty, cooking time, cuisine type, and dietary restrictions
- **📱 Responsive Design**: Beautiful, mobile-first interface built with Tailwind CSS
- **👤 User Authentication**: Secure login/signup system with Supabase Auth
- **☁️ Cloud Storage**: Save recipes to the cloud with Supabase database integration

## 🚀 Live Demo

[View Live Demo](yum-ai-chef-pbnq.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Backend**: Supabase (Auth + Database)
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**:
   ```bash
   [git clone https://github.com/101krish/Yum-ai-chef.git]
   cd Yum-ai-chef.
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```

4. **Set up Supabase**:
   - Create a new project at [Supabase](https://supabase.com)
   - Copy your project URL and anon key to the `.env` file
   - Set up the database schema (see [Database Setup](#database-setup))

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:5173`

## 🗄️ Database Setup

Create the following tables in your Supabase database:

```sql
-- Create recipes table
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  cooking_time INTEGER,
  difficulty TEXT,
  cuisine_type TEXT,
  dietary_info JSONB,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own recipes" ON recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" ON recipes
  FOR DELETE USING (auth.uid() = user_id);
```

## 🎯 Usage

1. **Add Ingredients**: Type in ingredients you have or upload a photo
2. **Set Preferences**: Select dietary preferences (optional)
3. **Generate Recipes**: Click "Generate Recipes" to get suggestions
4. **Filter Results**: Use the filter bar to narrow down recipes
5. **Save Favorites**: Click the heart icon to save recipes (requires login)
6. **View Saved**: Access your saved recipes from the navigation menu

## 🧩 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── FilterBar.tsx   # Recipe filtering component
│   ├── HeroSection.tsx # Landing page hero
│   ├── Navbar.tsx      # Navigation component
│   └── RecipeCard.tsx  # Recipe display card
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
├── pages/              # Route components
│   ├── Index.tsx       # Home page
│   ├── Auth.tsx        # Login/Signup page
│   ├── SavedRecipes.tsx# Saved recipes page
│   └── ...
├── services/           # API and service functions
│   └── recipeService.ts# Recipe-related API calls
└── types/              # TypeScript type definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔮 Future Enhancements

- [ ] Integration with real AI recipe generation API
- [ ] Ingredient recognition from uploaded images
- [ ] Recipe sharing functionality
- [ ] Meal planning features
- [ ] Shopping list generation
- [ ] Recipe rating and reviews
- [ ] Social features (following users, recipe collections)
- [ ] Mobile app version

## 📄 License

This project is licensed under the MIT License 

## 👨‍💻 Author

**Krish Maheshwari**
- LinkedIn: [Krish  Maheshwari](https://linkedin.com/in/your-profile)

⭐ **Star this repository if you found it helpful!**
