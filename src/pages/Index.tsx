import { useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { PaintingHeader } from "@/components/PaintingHeader";
import { ShapesSidebar, ShapeType } from "@/components/ShapesSidebar";
import { PaintingCanvas } from "@/components/PaintingCanvas";
import { ShapeCounter } from "@/components/ShapeCounter";
import { toast } from "sonner";

const Index = () => {
  const [title, setTitle] = useState("Painting Title");
  const [shapeCounts, setShapeCounts] = useState({
    circle: 0,
    rectangle: 0,
    triangle: 0,
  });
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [importData, setImportData] = useState<any>(null);

  const handleShapeSelect = (shape: ShapeType) => {
    // This will be handled by drag and drop or canvas click
    toast.info(`${shape} انتخاب شد - آن را به بوم بکشید`);
  };

  const handleExport = () => {
    if (!canvas) {
      toast.error("بوم آماده نیست");
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

    toast.success("نقاشی صادر شد");
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
        />
      </div>
      
      <div className="p-4">
        <ShapeCounter counts={shapeCounts} />
      </div>
    </div>
  );
};

export default Index;
