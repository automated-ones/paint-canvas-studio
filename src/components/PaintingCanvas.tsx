import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { ShapeType } from "./ShapesSidebar";
import { toast } from "sonner";

interface PaintingCanvasProps {
  onShapeCountChange: (counts: { circle: number; rectangle: number; triangle: number }) => void;
  importData?: any;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onAddShape: (type: ShapeType, x?: number, y?: number) => void;
}

export const PaintingCanvas = ({ onShapeCountChange, importData, onCanvasReady, onAddShape }: PaintingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 700,
      height: 450,
      backgroundColor: "#1e293b",
    });

    onCanvasReady(canvas);

    // Handle double click to remove shapes
    canvas.on("mouse:dblclick", (e) => {
      if (e.target) {
        canvas.remove(e.target);
        canvas.renderAll();
        updateShapeCounts(canvas);
        toast.success("Shape removed!");
      }
    });

    // Set up drag and drop
    const canvasElement = canvasRef.current;
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = "copy";
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      
      const shapeType = e.dataTransfer?.getData("shape-type") as ShapeType;
      
      if (shapeType) {
        const rect = canvasElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        onAddShape(shapeType, x, y);
      }
    };

    canvasElement.addEventListener("dragover", handleDragOver);
    canvasElement.addEventListener("drop", handleDrop);

    const updateShapeCounts = (canvas: FabricCanvas) => {
      const objects = canvas.getObjects();
      const counts = { circle: 0, rectangle: 0, triangle: 0 };
      
      objects.forEach((obj) => {
        if (obj.type === 'circle') counts.circle++;
        else if (obj.type === 'rect') counts.rectangle++;
        else if (obj.type === 'polygon') counts.triangle++;
      });
      
      onShapeCountChange(counts);
    };

    return () => {
      canvasElement.removeEventListener("dragover", handleDragOver);
      canvasElement.removeEventListener("drop", handleDrop);
      canvas.dispose();
    };
  }, []);

  // Handle import data
  useEffect(() => {
    if (importData && canvasRef.current) {
      const canvas = new FabricCanvas(canvasRef.current);
      canvas.loadFromJSON(importData, () => {
        canvas.renderAll();
        onCanvasReady(canvas);
        toast.success("Painting imported successfully!");
      });
    }
  }, [importData]);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="border-2 border-dashed border-primary/40 rounded-2xl p-6 
                      bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm 
                      shadow-elegant hover:shadow-glow transition-all duration-300">
        <canvas 
          ref={canvasRef} 
          className="border-2 border-primary/20 rounded-xl shadow-lg"
          style={{ backgroundColor: "#1e293b" }}
        />
        <p className="text-center text-sm text-muted-foreground mt-4 font-medium">
          Click shapes on the left or drag them here • Double-click shapes to remove
        </p>
      </div>
    </div>
  );
};