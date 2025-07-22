import { Circle, Square, Triangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export type ShapeType = "circle" | "rectangle" | "triangle";

interface ShapesSidebarProps {
  onShapeSelect: (shape: ShapeType) => void;
}

export const ShapesSidebar = ({ onShapeSelect }: ShapesSidebarProps) => {
  const shapes = [
    { type: "circle" as const, icon: Circle, label: "دایره" },
    { type: "rectangle" as const, icon: Square, label: "مربع" },
    { type: "triangle" as const, icon: Triangle, label: "مثلث" },
  ];

  return (
    <Card className="w-48 h-fit bg-card border-border">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-foreground">ابزارها</h2>
        <div className="space-y-2">
          {shapes.map((shape) => {
            const Icon = shape.icon;
            return (
              <button
                key={shape.type}
                onClick={() => onShapeSelect(shape.type)}
                className="w-full p-3 rounded-lg border-2 border-dashed border-muted hover:border-primary hover:bg-muted/50 transition-colors group cursor-pointer"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("shape-type", shape.type);
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                  <span className="text-sm text-muted-foreground group-hover:text-primary">
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