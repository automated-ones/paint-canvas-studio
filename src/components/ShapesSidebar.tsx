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

  return (
    <Card className="w-52 h-fit bg-gradient-to-b from-card to-card/80 border-primary/20 
                     shadow-elegant backdrop-blur-sm">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-primary to-accent 
                       bg-clip-text text-transparent">Tools</h2>
        <div className="space-y-3">
          {shapes.map((shape) => {
            const Icon = shape.icon;
            return (
              <button
                key={shape.type}
                onClick={() => onShapeSelect(shape.type)}
                className="w-full p-4 rounded-xl border-2 border-dashed border-primary/30 
                           hover:border-primary hover:bg-primary/10 transition-all duration-200 
                           group cursor-pointer hover:scale-105 hover:shadow-glow backdrop-blur-sm"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("shape-type", shape.type);
                }}
              >
                <div className="flex flex-col items-center gap-3">
                  <Icon className="h-10 w-10 text-primary/70 group-hover:text-primary 
                                   transition-colors duration-200" />
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-primary 
                                   transition-colors duration-200">
                    {shape.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};