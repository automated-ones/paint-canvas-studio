import { useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, Polygon } from "fabric";
import { PaintingHeader } from "@/components/PaintingHeader";
import { ShapesSidebar, ShapeType } from "@/components/ShapesSidebar";
import { PaintingCanvas } from "@/components/PaintingCanvas";
import { ShapeCounter } from "@/components/ShapeCounter";
import { toast } from "sonner";

const Index = () => {
  const [title, setTitle] = useState("My Painting");
  const [shapeCounts, setShapeCounts] = useState({
    circle: 0,
    rectangle: 0,
    triangle: 0,
  });
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [importData, setImportData] = useState<any>(null);

  const handleShapeSelect = (shape: ShapeType) => {
    if (canvas) {
      // Add shape directly when clicked
      addShapeToCanvas(shape);
    } else {
      toast.error("Canvas not ready");
    }
  };

  const addShapeToCanvas = (type: ShapeType, x?: number, y?: number) => {
    if (!canvas) return;

    const colors = ["#3b82f6", "#10b981", "#06b6d4", "#8b5cf6", "#f59e0b"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    let shape;
    const posX = x !== undefined ? x - 30 : Math.random() * 600 + 50;
    const posY = y !== undefined ? y - 30 : Math.random() * 350 + 50;

    switch (type) {
      case "circle":
        shape = new Circle({
          left: posX,
          top: posY,
          fill: color,
          radius: 30,
          stroke: "#ffffff",
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
          stroke: "#ffffff",
          strokeWidth: 2,
        });
        break;
      case "triangle":
        shape = new Polygon([
          { x: 0, y: -30 },
          { x: 30, y: 30 },
          { x: -30, y: 30 }
        ], {
          left: posX,
          top: posY,
          fill: color,
          stroke: "#ffffff",
          strokeWidth: 2,
        });
        break;
    }

    if (shape) {
      canvas.add(shape);
      canvas.renderAll();
      updateShapeCounts();
      toast.success(`${type} added!`);
    }
  };

  const updateShapeCounts = () => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const counts = { circle: 0, rectangle: 0, triangle: 0 };
    
    objects.forEach((obj) => {
      if (obj instanceof Circle) counts.circle++;
      else if (obj instanceof Rect) counts.rectangle++;
      else if (obj instanceof Polygon) counts.triangle++;
    });
    
    setShapeCounts(counts);
  };

  const handleExport = () => {
    if (!canvas) {
      toast.error("Canvas is not ready");
      return;
    }

    const data = {
      title,
      canvas: canvas.toJSON(),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Painting exported successfully");
  };

  const handleImport = (data: any) => {
    if (data.title) {
      setTitle(data.title);
    }
    if (data.canvas) {
      setImportData(data.canvas);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PaintingHeader
        title={title}
        onTitleChange={setTitle}
        onExport={handleExport}
        onImport={handleImport}
      />
      
      <div className="flex-1 flex">
        <div className="p-4">
          <ShapesSidebar onShapeSelect={handleShapeSelect} />
        </div>
        
        <PaintingCanvas
          onShapeCountChange={setShapeCounts}
          importData={importData}
          onCanvasReady={setCanvas}
          onAddShape={addShapeToCanvas}
        />
      </div>
      
      <div className="p-4">
        <ShapeCounter counts={shapeCounts} />
      </div>
    </div>
  );
};

export default Index;