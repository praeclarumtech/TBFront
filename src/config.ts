interface ApiConfig {
    API_URL: string;
  }
  
  interface Config {
    api: ApiConfig;
  }
  
  const config: Config = {
    api: {
      API_URL: "https://tbapi-jtu7.onrender.com/api/",
    },
  };
  export const configImage: Config = {
    api: {
      API_URL: "https://tbapi-jtu7.onrender.com/api/",
    },
  };
  
  export default config;
  