declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      POSTGRES_DB: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_HOST: string;
      POSTGRES_PORT: string;
      CLIENT_URL: string;
      CLIENT_PORT: string;
      INTRA_API_UID: string;
      INTRA_API_SECRET: string;
      JWT_SECRET: string;
      AUTH_CALLBACK: string;
    }
  }
}

export {};
