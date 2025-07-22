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
        toast.success("نقاشی با موفقیت وارد شد");
      } catch (error) {
        toast.error("خطا در خواندن فایل");
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="border-b border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              className="max-w-xs"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
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