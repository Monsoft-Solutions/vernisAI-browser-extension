import React, { useEffect, useState } from 'react';
import { Copy, Send, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { useToast } from '../components/ui/use-toast';
import { SelectedText, Personality, Message } from '../types';
import { getApiKey, getPreferredPersonality, setPreferredPersonality } from '../services/storage';
import { generateReply } from '../services/api';
import { copyTextToClipboard } from '../lib/utils';
import SettingsModal from '../components/app/SettingsModal';

const Popup: React.FC = () => {
  const [selectedText, setSelectedText] = useState<SelectedText | null>(null);
  const [personality, setPersonality] = useState<Personality>('vernisai');
  const [generatedReply, setGeneratedReply] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get the currently selected text from the background script
    chrome.runtime.sendMessage(
      { type: 'GET_SELECTED_TEXT', payload: {} } satisfies Message,
      (response: SelectedText | null) => {
        if (response) {
          setSelectedText(response);
        }
      }
    );

    // Load user preferences
    const loadPreferences = async () => {
      const storedApiKey = await getApiKey();
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }

      const storedPersonality = await getPreferredPersonality();
      if (storedPersonality) {
        setPersonality(storedPersonality);
      }
    };

    loadPreferences();
  }, []);

  const handlePersonalityChange = async (value: Personality) => {
    setPersonality(value);
    await setPreferredPersonality(value);
    
    // If we already have selected text, regenerate the reply with the new personality
    if (selectedText && apiKey) {
      generateReplyText(selectedText, value, apiKey);
    }
  };

  const generateReplyText = async (
    text: SelectedText,
    personality: Personality,
    apiKey: string
  ) => {
    if (!text || !apiKey) return;

    setIsLoading(true);
    setGeneratedReply('');

    try {
      const response = await generateReply({
        text: text.text,
        sourceUrl: text.sourceUrl,
        personality,
        apiKey,
      });

      setGeneratedReply(response.reply);
    } catch (error) {
      console.error('Error generating reply:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate reply',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetReply = () => {
    if (selectedText && apiKey) {
      generateReplyText(selectedText, personality, apiKey);
    } else if (!apiKey) {
      setShowSettings(true);
      toast({
        title: 'API Key Required',
        description: 'Please enter your OpenAI API key in the settings',
      });
    }
  };

  const handleCopyReply = async () => {
    if (!generatedReply) return;

    try {
      await copyTextToClipboard(generatedReply);
      toast({
        title: 'Copied',
        description: 'Reply copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleUseReply = () => {
    if (!generatedReply) return;

    // Send message to content script via background
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'FILL_REPLY_FIELD',
          payload: { text: generatedReply },
        } satisfies Message);

        toast({
          title: 'Success',
          description: 'Reply inserted into text field',
        });
      }
    });
  };

  return (
    <div className="popup-container p-4 h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">VernisAI</h1>
        <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col space-y-4">
        {selectedText ? (
          <div className="border rounded-md p-3 bg-muted/30 text-sm overflow-auto max-h-24">
            {selectedText.text}
          </div>
        ) : (
          <div className="border rounded-md p-3 bg-muted/30 text-sm text-muted-foreground italic">
            Select text on the webpage to generate a reply
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Personality</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="capitalize">
                  {personality}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handlePersonalityChange('monsoft')}>
                  Monsoft Solutions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePersonalityChange('vernisai')}>
                  VernisAI
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePersonalityChange('personal')}>
                  Personal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            className="w-full"
            onClick={handleGetReply}
            disabled={!selectedText || isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Reply'}
          </Button>
        </div>

        {generatedReply && (
          <div className="space-y-2">
            <div className="border rounded-md p-3 bg-background text-sm overflow-auto max-h-32">
              {generatedReply}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCopyReply}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={handleUseReply}
              >
                <Send className="h-4 w-4 mr-2" />
                Use Reply
              </Button>
            </div>
          </div>
        )}
      </main>

      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          setApiKey={setApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default Popup;
