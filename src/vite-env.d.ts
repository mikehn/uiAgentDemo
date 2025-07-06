/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly REACT_APP_OPENAI_API_KEY: string
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 