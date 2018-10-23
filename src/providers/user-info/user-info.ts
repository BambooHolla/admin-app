import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
/*
  Generated class for the UserInfoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserInfoProvider {
  private _userInfo: any;
  get userInfo() {
    return this._userInfo || {};
  }
 
  private _userToken!: string;
  get userToken() {
    return this._userToken;
  }
  constructor(public storage: Storage) {
  }

  initUserInfo(userInfo) {
    if (!userInfo) {
      userInfo = {};
    }
    this._userInfo = userInfo;
    this._userToken = userInfo.token;
  }

  cleanUserInfo() {
    this._userInfo = {};
    this._userToken = '';
  }
}
