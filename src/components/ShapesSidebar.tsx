import { Circle, Square, Triangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export type ShapeType = "circle" | "rectangle" | "triangle";

interface ShapesSidebarProps {
  onShapeSelect: (shape: ShapeType) => void;
}

export const ShapesSidebar = ({ onShapeSelect }: ShapesSidebarProps) => {
  const shapes = [
    { type: "circle" as const, icon: Circle, label: "Circle" },
    { type: "rectangle" as const, icon: Square, label: "Rectangle" },
    { type: "triangle" as const, icon: Triangle, label: "Triangle" },
  ];

  const handleDragStart = (e: React.DragEvent, shapeType: ShapeType) => {
    e.dataTransfer.setData("shape-type", shapeType);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <Card className="w-64 bg-gradient-to-b from-card to-card/80 border-primary/20 
                     shadow-elegant backdrop-blur-sm">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary mb-6 text-center">
          Shapes
        </h2>
        <div className="space-y-3">
          {shapes.map((shape) => {
            const Icon = shape.icon;
            return (
              <div
                key={shape.type}
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary/20 
                          bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20
                          cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105
                          hover:border-primary/40"
                onClick={() => onShapeSelect(shape.type)}
                draggable
                onDragStart={(e) => handleDragStart(e, shape.type)}
              >
                <Icon className="h-8 w-8 text-primary" />
                <span className="font-semibold text-foreground">{shape.label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-6 font-medium">
          Click to add or drag to canvas
        </p>
      </div>
    </Card>
  );
};