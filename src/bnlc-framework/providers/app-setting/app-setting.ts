import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject, AsyncSubject } from 'rxjs';
import { AsyncBehaviorSubject, Executor } from '../RxExtends';

/*
  Generated class for the AppSettingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppSettingProvider {
  static SERVER_URL = 'http://bjs.bnqkl.cn/api/v1/bngj/';
  APP_URL(path: string) {
    return AppSettingProvider.SERVER_URL + path;
  }
  constructor(public http: Http) {
    console.log('Hello AppSettingProvider Provider');
    this.user_token = new BehaviorSubject<string>(this.getUserToken());
  }
  private USER_TOKEN_STORE_KEY = 'BNGJ_USER_LOGIN_TOKEN';
  user_token: BehaviorSubject<string>;
  private _token_timeout_ti: any;
  getUserToken() {
    try {
      clearTimeout(this._token_timeout_ti);
      var tokenJson = localStorage.getItem(this.USER_TOKEN_STORE_KEY);
      if (!tokenJson) {
        return '';
      }
      var obj = JSON.parse(tokenJson);
      if (obj.expiredTime && obj.expiredTime < Date.now()) {
        return '';
      }
      this._token_timeout_ti = setTimeout(() => {
        console.log('User Token 过期：', obj);
        this._setUserToken('');
      }, obj.expiredTime - Date.now());
      return obj.token || '';
    } catch (e) {
      return '';
    }
  }
  setUserToken(obj: any) {
    if (typeof obj !== 'string') {
      obj = JSON.stringify(obj);
    }
    localStorage.setItem(this.USER_TOKEN_STORE_KEY, obj);
    this._setUserToken(this.getUserToken());
  }
  clearUserToken() {
    localStorage.removeItem(this.USER_TOKEN_STORE_KEY);
    this._setUserToken(this.getUserToken());
  }
  private _setUserToken(token: string) {
    this.user_token.next(this.getUserToken());
  }
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
}

const server_host =
  getQueryVariable('SERVER_HOST') || localStorage.getItem('SERVER_HOST') || '';
if (location.hostname === 'dev-bnlc.bnqkl.cn') {
  AppSettingProvider.SERVER_URL = 'http://dev-bnlc.bnqkl.cn:40001/api/v1/bngj/';
} else if (server_host.startsWith('HOME')) {
  let home_ip = location.hostname;
  if (server_host.startsWith('HOME:')) {
    home_ip = server_host.replace('HOME:', '').trim();
  }
  AppSettingProvider.SERVER_URL = `http://${home_ip}:40001/api/v1/bngj/`;
} else if (location.hostname === 'wzx-bnlc.bnqkl.cn' || server_host === 'WZX') {
  AppSettingProvider.SERVER_URL = 'http://192.168.16.216:40001/api/v1/bngj/';
}
console.log(
  '%cSERVER_URL:',
  'font-size:2em;color:green;background-color:#DDD',
  AppSettingProvider.SERVER_URL
);
/**
 * 基于token的AsyncBehaviorSubjuet类型的属性/方法生成器
 * tokenBaseAsyncBehaviorSubjectGenerator
 * 
 * @export
 * @param {any} target 
 * @param {any} name 
 * @param {any} descriptor 
 */
export function TB_AB_Generator(target_prop_name: string, need_token = true) {
  return (target, name, descriptor) => {
    var executor: Executor<any> = descriptor.value;
    let _v: AsyncBehaviorSubject<any>;
    Object.defineProperty(target, target_prop_name, {
      get() {
        if (!_v) {
          if (!(this.appSetting instanceof AppSettingProvider)) {
            throw new Error(
              `${this.constructor.name} 需要注入依赖： (appSetting)AppSettingProvider`
            );
          }
          this.appSetting.user_token.subscribe(token => {
            if (need_token && !token) {
              return;
            }
            if (!_v) {
              _v = new AsyncBehaviorSubject(executor.bind(this));
            } else {
              _v.refresh();
            }
          });
        }
        return _v;
      }
    });
    return descriptor;
  };
}