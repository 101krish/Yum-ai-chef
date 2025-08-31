import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChefHat, Sparkles } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="space-y-8">
      {/* Loading Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <ChefHat className="w-8 h-8 text-primary animate-bounce" />
          <Sparkles className="w-6 h-6 text-accent animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Cooking up something amazing...
        </h2>
        <p className="text-muted-foreground">
          Our AI chef is analyzing your ingredients and creating personalized recipes
        </p>
      </div>

      {/* Loading Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <Skeleton className="h-48 w-full" />
            
            <div className="p-6 space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>

              {/* Stats */}
              <div className="flex gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-14" />
              </div>

              {/* Tags */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-18" />
              </div>

              {/* Nutrition */}
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="text-center space-y-1">
                    <Skeleton className="h-3 w-8 mx-auto" />
                    <Skeleton className="h-4 w-10 mx-auto" />
                  </div>
                ))}
              </div>

              {/* Button */}
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};