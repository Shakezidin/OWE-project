import axios, { CancelTokenSource } from 'axios';

const cancelTokenSources: CancelTokenSource[] = [];

axios.interceptors.request.use(
  (config) => {
    const cancelTokenSource = axios.CancelToken.source();
    config.cancelToken = cancelTokenSource.token;
    cancelTokenSources.push(cancelTokenSource);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const cancelAllRequests = () => {
  cancelTokenSources.forEach((source) =>
    source.cancel('')
  );
  cancelTokenSources.length = 0;
};
