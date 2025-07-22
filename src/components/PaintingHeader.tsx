import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface PaintingHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onExport: () => void;
  onImport: (data: any) => void;
}

export const PaintingHeader = ({ title, onTitleChange, onExport, onImport }: PaintingHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleTitleSave = () => {
    onTitleChange(tempTitle);
    setIsEditing(false);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result);
        onImport(data);
        toast.success("Painting imported successfully!");
      } catch (error) {
        toast.error("Error reading file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="border-b border-primary/20 bg-gradient-to-r from-card to-card/80 
                       backdrop-blur-sm shadow-elegant p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isEditing ? (
            <Input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              className="max-w-xs bg-card/50 border-primary/20 focus:border-primary 
                         focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent 
                             bg-clip-text text-transparent">
                {title || "Digital Canvas"}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 hover:bg-primary/10 text-primary/70 hover:text-primary"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onExport} 
            className="bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary 
                       backdrop-blur-sm transition-all duration-200 hover:scale-105 
                       shadow-lg hover:shadow-primary/25"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="bg-accent/10 hover:bg-accent/20 border-accent/30 text-accent-foreground 
                       backdrop-blur-sm transition-all duration-200 hover:scale-105 
                       shadow-lg hover:shadow-accent/25"
          >
            <Upload className="h-4 w-4 mr-2" />
            <label htmlFor="import-file" className="cursor-pointer">
              Import
            </label>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </Button>
        </div>
      </div>
    </header>
  );
};