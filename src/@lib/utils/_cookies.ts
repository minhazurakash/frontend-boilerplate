import { ENV } from '.environments';
import { IdType } from '@lib/interfaces';
import jwtDecode from 'jwt-decode';

// Storage utils functions using cookies
export const cookies = {
  //for save data to cookies with an optional expiration period (default: 30 days)
  setData(name: string, data: any, days: number = 30) {
    if (typeof window === 'undefined') return;
    data = JSON.stringify(data);
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = `${name}=${data}; ${expires}; path=/`;
  },
  // for retrieve data from cookies
  getData<T = any>(name: string) {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie;
    const data = cookies?.split(`${name}=`)[1]?.split(';')[0];
    if (!data) return null;
    return JSON.parse(data) as T;
  },
  // for remove data from cookies
  removeData(name: string) {
    if (typeof window === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  },
  // for clear all cookies
  clear(): boolean {
    if (typeof window === 'undefined') return;
    const cookies = document.cookie?.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const equalIndex = cookie.indexOf('=');
      const name = equalIndex > -1 ? cookie?.substring(0, equalIndex) : cookie;
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    }
  },

  setToken(token: string) {
    this.setData(`${ENV.storagePrefix}-token`, token, 30);
  },
  getToken(): string {
    const token = this.getData(`${ENV.storagePrefix}-token`);
    if (!token) return null;
    return token;
  },
  removeToken() {
    this.removeData(`${ENV.storagePrefix}-token`);
  },
  getTokenData(): ITokenData {
    const token = this.getToken();
    if (!token) return null;
    return jwtDecode(token) as ITokenData;
  },
};

interface ITokenData {
  user: {
    id: IdType;
  };
  iat: number;
  exp: number;
}
