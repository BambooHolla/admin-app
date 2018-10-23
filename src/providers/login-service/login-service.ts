import { Injectable } from '@angular/core';
import { FLP_Tool } from '../../app-framework/FLP_Tool';
import { Observable, BehaviorSubject, Subscription } from "rxjs";
import { AppSettingProvider } from '../app-setting/app-setting';
import { AppFetchProvider } from '../app-fetch/app-fetch';
/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginServiceProvider extends FLP_Tool {
  public loginStatus: Observable<boolean>;

  readonly LOGIN_URL = this.appSetting.APP_URL("/user/loginByAdmin");
  // readonly LOGIN_URL = this.appSetting.APP_URL("/loginByAdmin");
  readonly OUT_URL = this.appSetting.APP_URL("/user/logout");

  constructor(
    public appSetting: AppSettingProvider,
    public fetch: AppFetchProvider,
  ) {
    super();
    console.log('Hello LoginServiceProvider Provider');

    // 获取登录
    this.loginStatus = this.appSetting.user_token.map(val => {
      return !!val;
    });
  }

  async doLogin(account: string, password: string) {
    return this.fetch.post(this.LOGIN_URL, {
          account,
          password
    }).then( data => {
      const infoObj = data;
      return this.appSetting.setUserToken(infoObj);
    });
  }

  loginOut() {
    return this.fetch.get(this.OUT_URL);
  }
}
