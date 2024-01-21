/* 
Inspiration from: https://stackoverflow.com/a/70187506
*/

import { Configuration } from './configuration';
import { RulesApi, TokenApi, FirewallsApi, UsersApi } from './api';
import { AxiosError } from 'axios';

class MyApi {

  private getAccessToken = () => {
    return localStorage.getItem('access');
  }

  private getRefreshToken = () => {
    return localStorage.getItem('refresh');
  };

  private configuration = () => {
    const openapiConfig = new Configuration();
    openapiConfig.basePath = "http://127.0.0.1:8000";
    openapiConfig.accessToken = this.getAccessToken() || '';

    return openapiConfig;
  };

  // private tokenRefreshCreate = async (tokenApi: TokenApi, refreshToken: string) => {
  //   try {
  //     const response = await tokenApi.tokenRefreshCreate(
  //       {
  //         'access': '',
  //         'refresh': refreshToken
  //       }
  //     );
  //     console.log("Provided valid refresh token - created access token", response.data.access);
  //     localStorage.setItem("access", response.data.access);
  //     localStorage.setItem("refresh", response.data.refresh);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // private tokenVerifyCreate = async (tokenApi: TokenApi, accessToken: string, refreshToken?: string) => {
  //   try {
  //     const response = await tokenApi.tokenVerifyCreate(
  //       {'token': accessToken}
  //       );
  //     if (response.status == 200) {
  //       console.log("Provided valid access token - nothing to do");
  //     } else {
  //       console.log("tokenVerifyCreate: ", response);
  //     }
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       if (error.response?.data.code == 'token_not_valid') {
  //         console.log("Access token not valid");
  //         if (refreshToken) {
  //           console.log("Trying to create new access token");
  //           await this.tokenRefreshCreate(tokenApi, refreshToken);
  //         }
  //       }
  //     }
  //     console.log(error);
  //   }
  // }

  // public async verifyOrRefreshToken() {
  //   const tokenApi = this.tokenApi();
  //   const accessToken = this.getAccessToken();
  //   const refreshToken = this.getRefreshToken();

  //   if (accessToken === null && refreshToken === null) {
  //     console.log("No access-token and refresh-token available");
  //     return false;
  //   }

  //   if (accessToken === null && refreshToken !== null) {
  //     await this.tokenRefreshCreate(tokenApi, refreshToken);
  //   } 
    
  //   if (accessToken !== null) {
  //     if (refreshToken === null) {
  //       await this.tokenVerifyCreate(tokenApi, accessToken);
  //     } else {
  //       await this.tokenVerifyCreate(tokenApi, accessToken, refreshToken);
  //     }
  //   }
  // }

  public rulesApi = () => {
    // this.verifyOrRefreshToken();
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