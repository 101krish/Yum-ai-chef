import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Sparkles, Heart, Users, Target, Zap } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Suggestions",
      description: "Advanced algorithms analyze your ingredients to suggest personalized recipes."
    },
    {
      icon: Heart,
      title: "Dietary Preferences",
      description: "Filter recipes based on your dietary needs and restrictions."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Rate and save recipes to help others discover amazing dishes."
    },
    {
      icon: Target,
      title: "Smart Matching",
      description: "Get recipes that perfectly match what you have in your kitchen."
    }
  ];

  const stats = [
    { label: "Recipes Available", value: "500+" },
    { label: "Users Served", value: "10K+" },
    { label: "Cuisines Covered", value: "25+" },
    { label: "Success Rate", value: "95%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ChefHat className="w-8 h-8 text-primary animate-bounce" />
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold gradient-hero bg-clip-text text-transparent">
              About SmartRecipe
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're revolutionizing how people cook by transforming available ingredients 
              into delicious, personalized recipes using cutting-edge AI technology.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                To eliminate food waste and inspire creativity in the kitchen by helping 
                people discover amazing recipes using ingredients they already have.
              </p>
              <p className="text-muted-foreground">
                Whether you're a beginner cook or a seasoned chef, SmartRecipe adapts 
                to your skill level and dietary preferences, making cooking accessible 
                and enjoyable for everyone.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Zero Food Waste</Badge>
                <Badge variant="outline">AI-Powered</Badge>
                <Badge variant="outline">Personalized</Badge>
                <Badge variant="outline">Community-Driven</Badge>
              </div>
            </div>
            <Card className="shadow-card">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why Choose SmartRecipe?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the features that make SmartRecipe the ultimate cooking companion
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-all duration-300">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-foreground">Powered by Advanced Technology</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Computer Vision</h3>
              <p className="text-muted-foreground text-sm">
                Upload photos of your ingredients and our AI will identify them automatically
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Smart Matching</h3>
              <p className="text-muted-foreground text-sm">
                Advanced algorithms find the perfect recipes based on your available ingredients
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold">Personalization</h3>
              <p className="text-muted-foreground text-sm">
                Learn from your preferences to suggest recipes you'll love
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;