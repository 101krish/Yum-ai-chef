import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filters: RecipeFilters) => void;
  activeFilters: RecipeFilters;
}

export interface RecipeFilters {
  difficulty?: "Easy" | "Medium" | "Hard";
  maxCookingTime?: number;
  cuisine?: string;
  dietary?: string[];
  servingSize?: string;
}

const cuisineOptions = [
  "Mediterranean", "Italian", "Asian", "Thai", "Mexican", "Indian", "American", "French"
];

const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", 
  "Keto", "Low-Carb", "High-Protein", "Mediterranean"
];

const cookingTimeOptions = [
  { label: "Under 15 min", value: 15 },
  { label: "Under 30 min", value: 30 },
  { label: "Under 1 hour", value: 60 },
  { label: "Any time", value: undefined }
];

const servingSizeOptions = [
  "1-2 people",
  "3-4 people", 
  "5-6 people",
  "7+ people"
];

export const FilterBar = ({ onFilterChange, activeFilters }: FilterBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof RecipeFilters, value: any) => {
    const newFilters = { ...activeFilters, [key]: value };
    onFilterChange(newFilters);
  };

  const toggleDietary = (option: string) => {
    const current = activeFilters.dietary || [];
    const newDietary = current.includes(option) 
      ? current.filter(item => item !== option)
      : [...current, option];
    updateFilter('dietary', newDietary);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(activeFilters).some(key => {
    const value = activeFilters[key as keyof RecipeFilters];
    return value !== undefined && (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <Card className="p-4 space-y-4">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filter Recipes</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Less" : "More"}
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Difficulty */}
        <Select
          value={activeFilters.difficulty || "any"}
          onValueChange={(value) => updateFilter('difficulty', value === "any" ? undefined : value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        {/* Cooking Time */}
        <Select
          value={activeFilters.maxCookingTime?.toString() || "any"}
          onValueChange={(value) => updateFilter('maxCookingTime', value === "any" ? undefined : parseInt(value))}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            {cookingTimeOptions.map((option) => (
              <SelectItem key={option.label} value={option.value?.toString() || "any"}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Cuisine */}
        <Select
          value={activeFilters.cuisine || "any"}
          onValueChange={(value) => updateFilter('cuisine', value === "any" ? undefined : value)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Cuisine</SelectItem>
            {cuisineOptions.map((cuisine) => (
              <SelectItem key={cuisine} value={cuisine}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Serving Size */}
        <Select
          value={activeFilters.servingSize || "any"}
          onValueChange={(value) => updateFilter('servingSize', value === "any" ? undefined : value)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Servings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Size</SelectItem>
            {servingSizeOptions.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-border animate-fade-in">
          {/* Dietary Preferences */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Dietary Preferences
            </label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((option) => {
                const isSelected = activeFilters.dietary?.includes(option) || false;
                return (
                  <Badge
                    key={option}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => toggleDietary(option)}
                  >
                    {option}
                    {isSelected && <X className="w-3 h-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};