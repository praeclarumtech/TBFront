const { TB_API_ENDPOINT, TB_API_SUFFIX, TB_PRODUCTION_PROFILE_URL } =
  import.meta.env;

const appEnv = {
  API_ENDPOINT: TB_API_ENDPOINT,
  API_SUFFIX: TB_API_SUFFIX,
  PRODUCTION_PROFILE_URL: TB_PRODUCTION_PROFILE_URL,
};

Object.freeze(appEnv);

export default appEnv;
