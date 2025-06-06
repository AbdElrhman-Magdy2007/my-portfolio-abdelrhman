declare module 'next/dist/compiled/amphtml-validator' {
  export interface ValidationError {
    name?: string;
    message?: string;
    [key: string]: any;
  }
} 