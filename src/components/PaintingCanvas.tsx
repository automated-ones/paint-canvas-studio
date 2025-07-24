
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, Polygon } from "fabric";
import { ShapeType } from "./ShapesSidebar";
import { toast } from "sonner";

interface PaintingCanvasProps {
  onShapeCountChange: (counts: { circle: number; rectangle: number; triangle: number }) => void;
  importData?: any;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onAddShape?: (addShapeFn: (type: ShapeType) => void) => void;
}

export const PaintingCanvas = ({ onShapeCountChange, importData, onCanvasReady, onAddShape }: PaintingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [shapeCounts, setShapeCounts] = useState({
    circle: 0,
    rectangle: 0,
    triangle: 0,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log("Initializing canvas...");
    
    const canvas = new FabricCanvas(canvasRef.current, {
      width: 700,
      height: 450,
      backgroundColor: "#1a1a2e",
    });

    // Add a test circle to make sure canvas is working
    const testCircle = new Circle({
      left: 300,
      top: 200,
      fill: "hsl(200, 80%, 60%)",
      radius: 40,
      stroke: "hsl(220, 100%, 70%)",
      strokeWidth: 3,
    });
    
    canvas.add(testCircle);
    console.log("Test circle added to canvas");

    setFabricCanvas(canvas);
    onCanvasReady(canvas);

    // Handle double click to remove shapes
    canvas.on("mouse:dblclick", (e) => {
      if (e.target) {
        canvas.remove(e.target);
        updateShapeCounts(canvas);
        toast.success("Shape removed!");
      }
    });

    // Update shape counts initially
    updateShapeCounts(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Handle drag and drop
  useEffect(() => {
    if (!canvasRef.current || !fabricCanvas) return;

    console.log("Setting up drag and drop handlers...");

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = "copy";
      console.log("Drag over canvas");
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      console.log("Drop event triggered");
      
      const shapeType = e.dataTransfer?.getData("shape-type") as ShapeType;
      console.log("Shape type from drag:", shapeType);
      
      if (shapeType && fabricCanvas) {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        console.log("Drop position:", x, y);
        
        addShape(shapeType, x, y);
      }
    };

    const canvasElement = canvasRef.current;
    canvasElement.addEventListener("dragover", handleDragOver);
    canvasElement.addEventListener("drop", handleDrop);

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener("dragover", handleDragOver);
        canvasElement.removeEventListener("drop", handleDrop);
      }
    };
  }, [fabricCanvas]);

  // Handle import data
  useEffect(() => {
    if (importData && fabricCanvas) {
      fabricCanvas.loadFromJSON(importData, () => {
        fabricCanvas.renderAll();
        updateShapeCounts(fabricCanvas);
        toast.success("Painting loaded successfully!");
      });
    }
  }, [importData, fabricCanvas]);

  // Expose addShape function to parent when canvas is ready
  useEffect(() => {
    if (fabricCanvas && onAddShape) {
      onAddShape((type: ShapeType) => {
        console.log("Adding shape via click:", type);
        addShape(type);
      });
    }
  }, [fabricCanvas, onAddShape]);

  const addShape = (type: ShapeType, x?: number, y?: number) => {
    if (!fabricCanvas) {
      console.log("Canvas not ready");
      return;
    }

    console.log("Adding shape:", type, "at position:", x, y);

    const colors = [
      "hsl(200, 80%, 60%)", 
      "hsl(150, 70%, 55%)", 
      "hsl(180, 75%, 50%)", 
      "hsl(120, 65%, 60%)", 
      "hsl(220, 85%, 65%)"
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    let shape;
    const posX = x !== undefined ? x - 30 : Math.random() * 400 + 50;
    const posY = y !== undefined ? y - 30 : Math.random() * 250 + 50;

    switch (type) {
      case "circle":
        shape = new Circle({
          left: posX,
          top: posY,
          fill: color,
          radius: 30,
          stroke: "hsl(220, 100%, 70%)",
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
          stroke: "hsl(220, 100%, 70%)",
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
            stroke: "hsl(220, 100%, 70%)",
            strokeWidth: 2,
          }
        );
        break;
    }

    if (shape) {
      console.log("Shape created, adding to canvas");
      fabricCanvas.add(shape);
      fabricCanvas.renderAll();
      updateShapeCounts(fabricCanvas);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added!`);
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

    console.log("Shape counts updated:", counts);
    setShapeCounts(counts);
    onShapeCountChange(counts);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="border-2 border-dashed border-primary/40 rounded-2xl p-6 
                      bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm 
                      shadow-elegant hover:shadow-glow transition-all duration-300">
        <canvas 
          ref={canvasRef} 
          className="border-2 border-primary/20 rounded-xl shadow-lg bg-gradient-to-br 
                     from-background to-muted/20 backdrop-blur-sm"
        />
        <p className="text-center text-sm text-muted-foreground mt-4 font-medium">
          Drag shapes here or double-click shapes to remove them
        </p>
      </div>
    </div>
  );
};
