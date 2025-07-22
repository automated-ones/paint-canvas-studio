import { Circle, Square, Triangle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ShapeCounterProps {
  counts: {
    circle: number;
    rectangle: number;
    triangle: number;
  };
}

export const ShapeCounter = ({ counts }: ShapeCounterProps) => {
  const shapes = [
    { type: "circle", icon: Circle, count: counts.circle, label: "Circles" },
    { type: "rectangle", icon: Square, count: counts.rectangle, label: "Rectangles" },
    { type: "triangle", icon: Triangle, count: counts.triangle, label: "Triangles" },
  ];

  return (
    <Card className="w-full bg-gradient-to-r from-card to-card/80 border-primary/20 
                     shadow-elegant backdrop-blur-sm">
      <div className="p-6">
        <div className="flex justify-center gap-12">
          {shapes.map((shape) => {
            const Icon = shape.icon;
            return (
              <div key={shape.type} className="flex flex-col items-center gap-2 
                                               p-4 rounded-xl bg-primary/5 border border-primary/20">
                <Icon className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-primary">
                  {shape.count}
                </span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {shape.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};