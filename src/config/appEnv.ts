const { TB_API_ENDPOINT, TB_API_SUFFIX, TB_PRODUCTION_PROFILE_URL, TB_CAREER_EMAIL } =
  import.meta.env;

const appEnv = {
  API_ENDPOINT: TB_API_ENDPOINT,
  API_SUFFIX: TB_API_SUFFIX,
  PRODUCTION_PROFILE_URL: TB_PRODUCTION_PROFILE_URL,
  CAREER_EMAIL: TB_CAREER_EMAIL || "career@praeclarumtech.com",
};

Object.freeze(appEnv);

export default appEnv;
