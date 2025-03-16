import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { setApiKey as saveApiKey } from "../../services/storage";

interface SettingsModalProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  apiKey,
  setApiKey,
  onClose,
}) => {
  const [inputApiKey, setInputApiKey] = useState(apiKey);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await saveApiKey(inputApiKey);
      setApiKey(inputApiKey);
      toast({
        title: "Settings Saved",
        description: "Your API key has been saved successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-sm mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              OpenAI API Key
            </label>
            <input
              id="apiKey"
              type="password"
              className="w-full p-2 border rounded text-sm"
              value={inputApiKey}
              onChange={(e) => setInputApiKey(e.target.value)}
              placeholder="sk-..."
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never shared.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
