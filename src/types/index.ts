export type Personality = 'monsoft' | 'vernisai' | 'personal';

export interface SelectedText {
  text: string;
  sourceUrl: string;
}

export interface GeneratedReply {
  text: string;
  personality: Personality;
}

export interface ApiResponse {
  reply: string;
}

export interface Message {
  type: string;
  payload?: any;
}

export interface StorageData {
  apiKey?: string;
  preferredPersonality?: Personality;
}
