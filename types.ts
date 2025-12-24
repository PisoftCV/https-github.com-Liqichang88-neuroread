export enum TrainingModule {
  DASHBOARD = 'DASHBOARD',
  SCHULTE = 'SCHULTE',
  RSVP = 'RSVP',
  CHUNKING = 'CHUNKING',
  PACING = 'PACING',
  WCPM = 'WCPM'
}

export interface SchulteConfig {
  size: number;
  targetTime: number; // seconds
}

export interface ReadingText {
  id: string;
  title: string;
  category: 'Fiction' | 'Non-Fiction' | 'Drill';
  content: string;
  chunks?: string[];
  wordCount: number;
}
