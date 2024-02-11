/* 
Inspiration from: https://stackoverflow.com/a/70187506
*/

import { Configuration } from './configuration';
import { RulesApi, TokenApi, FirewallsApi, UsersApi } from './api';

class MyApi {

  private getAccessToken = () => {
    return localStorage.getItem('access');
  }

  private getRefreshToken = () => {
    return localStorage.getItem('refresh');
  };

  private configuration = () => {
    const openapiConfig = new Configuration();
    openapiConfig.basePath = process.env.REACT_APP_API_BASE_URL;
    openapiConfig.accessToken = this.getAccessToken() || '';

    return openapiConfig;
  };

  public rulesApi = () => {
    const api = new RulesApi(this.configuration());
    return api;
  };

  public tokenApi = () => {
    const api = new TokenApi(this.configuration());
    return api;
  };

  public firewallsApi = () => {
    const api = new FirewallsApi(this.configuration());
    return api;
  };

  public usersApi = () => {
    const api = new UsersApi(this.configuration());
    return api;
  };

}

export default MyApi;