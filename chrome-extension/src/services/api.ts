import { Personality, ApiResponse } from '../types';

const DEFAULT_API_URL = 'https://api.openai.com/v1/chat/completions';

interface GenerateReplyParams {
  text: string;
  sourceUrl: string;
  personality: Personality;
  apiKey: string;
}

export const getPersonalityPrompt = (personality: Personality): string => {
  switch (personality) {
    case 'monsoft':
      return 'You are responding as Monsoft Solutions, a professional software development company. Be professional, courteous, and business-oriented. Focus on providing value, showing expertise, and maintaining a formal tone.';
    case 'vernisai':
      return 'You are responding as VernisAI, an AI-powered context-aware reply generation tool. Be helpful, tech-savvy, and modern. Focus on showcasing AI abilities while maintaining a friendly, approachable tone.';
    case 'personal':
      return 'You are responding as a personal assistant. Be conversational, friendly, and personable. Use a casual tone while still being helpful and respectful.';
    default:
      return 'You are responding as VernisAI, an AI-powered context-aware reply generation tool. Be helpful, tech-savvy, and modern.';
  }
};

export const generateReply = async ({
  text,
  sourceUrl,
  personality,
  apiKey,
}: GenerateReplyParams): Promise<ApiResponse> => {
  try {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    const personalityPrompt = getPersonalityPrompt(personality);
    
    const response = await fetch(DEFAULT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: personalityPrompt,
          },
          {
            role: 'user',
            content: `Generate a contextually appropriate reply to the following text from ${sourceUrl}:\n\n${text}\n\nKeep the reply concise, under 280 characters if possible, and suitable for social media.`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate reply');
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || '';

    return { reply: generatedText };
  } catch (error) {
    console.error('Error generating reply:', error);
    throw error;
  }
};
