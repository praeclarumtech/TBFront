const { TB_API_ENDPOINT, TB_API_SUFFIX } = import.meta.env;

const appEnv = {
  API_ENDPOINT: TB_API_ENDPOINT,
  API_SUFFIX: TB_API_SUFFIX,
};

Object.freeze(appEnv);

export default appEnv;
