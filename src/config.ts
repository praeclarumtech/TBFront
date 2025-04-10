interface ApiConfig {
  API_URL: string;
}

interface Config {
  api: ApiConfig;
}

const config: Config = {
  api: {
    // API_URL: "https://tbapi-jtu7.onrender.com/api/",
    API_URL: "http://localhost:4000/api/",
  },
};
export const configImage: Config = {
  api: {
    // API_URL: "https://tbapi-jtu7.onrender.com/api/",
    API_URL: "http://localhost:4000/api/",
  },
};

export default config;
