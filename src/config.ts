interface ApiConfig {
  API_URL: string;
}

interface Config {
  api: ApiConfig;
}

// Helper function to build API URL from environment variables
const buildApiUrl = (): string => {
  const baseUrl = import.meta.env.TB_API_ENDPOINT;
  // const suffix = import.meta.env.TB_API_SUFFIX;

  if (!baseUrl) {
    throw new Error("TB_API_ENDPOINT environment variable is not set");
  }

  const cleanBase = baseUrl.replace(/\/$/, "");

  return `${cleanBase}/api`;
};

const apiUrl = buildApiUrl();

const config: Config = {
  api: {
    API_URL: apiUrl,
  },
};

export const configImage: Config = {
  api: {
    API_URL: apiUrl,
  },
};

export default config;
