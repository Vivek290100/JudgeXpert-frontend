// Frontend\src\config\Languages.ts
export interface LanguageConfig {
  name: string;
  id: number;
}
  export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
    { name: "javascript", id: 63 },
    { name: "cpp", id: 54 },
  ];