import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, Polygon } from "fabric";
import { ShapeType } from "./ShapesSidebar";
import { toast } from "sonner";

interface PaintingCanvasProps {
  onShapeCountChange: (counts: { circle: number; rectangle: number; triangle: number }) => void;
  importData?: any;
  onCanvasReady: (canvas: FabricCanvas) => void;
}

export const PaintingCanvas = ({ onShapeCountChange, importData, onCanvasReady }: PaintingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [shapeCounts, setShapeCounts] = useState({
    circle: 0,
    rectangle: 0,
    triangle: 0,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);
    onCanvasReady(canvas);

    // Handle double click to remove shapes
    canvas.on("mouse:dblclick", (e) => {
      if (e.target) {
        canvas.remove(e.target);
        updateShapeCounts(canvas);
        toast.success("شکل حذف شد");
      }
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // Handle drag and drop
  useEffect(() => {
    if (!canvasRef.current) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const shapeType = e.dataTransfer?.getData("shape-type") as ShapeType;
      if (shapeType && fabricCanvas) {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addShape(shapeType, x, y);
      }
    };

    canvasRef.current.addEventListener("dragover", handleDragOver);
    canvasRef.current.addEventListener("drop", handleDrop);

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("dragover", handleDragOver);
        canvasRef.current.removeEventListener("drop", handleDrop);
      }
    };
  }, [fabricCanvas]);

  // Handle import data
  useEffect(() => {
    if (importData && fabricCanvas) {
      fabricCanvas.loadFromJSON(importData, () => {
        fabricCanvas.renderAll();
        updateShapeCounts(fabricCanvas);
        toast.success("نقاشی بارگذاری شد");
      });
    }
  }, [importData, fabricCanvas]);

  const addShape = (type: ShapeType, x?: number, y?: number) => {
    if (!fabricCanvas) return;

    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    let shape;
    const posX = x || Math.random() * 400 + 50;
    const posY = y || Math.random() * 250 + 50;

    switch (type) {
      case "circle":
        shape = new Circle({
          left: posX,
          top: posY,
          fill: color,
          radius: 30,
          stroke: "#000",
          strokeWidth: 2,
        });
        break;
      case "rectangle":
        shape = new Rect({
          left: posX,
          top: posY,
          fill: color,
          width: 60,
          height: 60,
          stroke: "#000",
          strokeWidth: 2,
        });
        break;
      case "triangle":
        shape = new Polygon(
          [
            { x: 0, y: -30 },
            { x: 30, y: 30 },
            { x: -30, y: 30 },
          ],
          {
            left: posX,
            top: posY,
            fill: color,
            stroke: "#000",
            strokeWidth: 2,
          }
        );
        break;
    }

    if (shape) {
      fabricCanvas.add(shape);
      updateShapeCounts(fabricCanvas);
      toast.success("شکل اضافه شد");
    }
  };

  const updateShapeCounts = (canvas: FabricCanvas) => {
    const objects = canvas.getObjects();
    const counts = {
      circle: 0,
      rectangle: 0,
      triangle: 0,
    };

    objects.forEach((obj) => {
      if (obj instanceof Circle) {
        counts.circle++;
      } else if (obj instanceof Rect) {
        counts.rectangle++;
      } else if (obj instanceof Polygon) {
        counts.triangle++;
      }
    });

    setShapeCounts(counts);
    onShapeCountChange(counts);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="border-2 border-dashed border-muted-foreground rounded-lg p-4 bg-card">
        <canvas 
          ref={canvasRef} 
          className="border border-border rounded shadow-sm bg-white"
        />
      </div>
    </div>
  );
};