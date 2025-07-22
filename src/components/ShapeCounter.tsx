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
    { type: "circle", icon: Circle, count: counts.circle, label: "دایره" },
    { type: "rectangle", icon: Square, count: counts.rectangle, label: "مربع" },
    { type: "triangle", icon: Triangle, count: counts.triangle, label: "مثلث" },
  ];

  return (
    <Card className="w-full bg-card border-border">
      <div className="p-4">
        <div className="flex justify-center gap-8">
          {shapes.map((shape) => {
            const Icon = shape.icon;
            return (
              <div key={shape.type} className="flex items-center gap-2">
                <Icon className="h-6 w-6 text-muted-foreground" />
                <span className="text-lg font-semibold text-foreground">
                  {shape.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};