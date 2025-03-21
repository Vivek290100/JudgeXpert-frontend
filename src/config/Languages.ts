export interface LanguageConfig {
    name: string;
    id: number;
  }
  
  export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
    { name: "cpp", id: 54 },
    { name: "js", id: 63 },
    { name: "rust", id: 73 },
  ];