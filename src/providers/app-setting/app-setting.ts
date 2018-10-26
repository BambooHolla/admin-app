import { AppUrl, CommonService } from "../commonService";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Http } from "@angular/http";
import { observableToBeFn } from "rxjs/testing/TestScheduler";
import { UserInfoProvider } from "../user-info/user-info";
import { LoginPage } from "../../pages/pages";
import { FLP_Tool } from "../../app-framework/FLP_Tool";
export { AppUrl };
import {
  AsyncBehaviorSubject,
  Executor, 
} from "../../app-framework/RxExtends";
@Injectable()
export class AppSettingProvider extends CommonService {
    static readonly APP_ID: string = "com.picaex.adminApp";
    static readonly PLATFORM_TYPE = "10011001";
    // 特殊字符，加密用
    static readonly SPECIAL_CHARACTER: string = "!#%&(@$^*)~_+"
    APP_URL(path: string) {
        return new AppUrl(path);
    }
    user_token: BehaviorSubject<string>;
    account_address: Observable<string>;
    private USER_TOKEN_STORE_KEY = "LOGIN_TOKEN";
    constructor(
        public http: Http,
        public user: UserInfoProvider,
    ) {
        super();
        console.log("Hello AppSettingProvider Provider");
        const user_token = this.getUserToken();
        user_token && this.user.initUserInfo(user_token)
        this.user_token = new BehaviorSubject<string>(user_token);
        
    }

    private _token_timeout_ti: any;
    getUserToken() {
        try {
          clearTimeout(this._token_timeout_ti);
          var tokenJson = localStorage.getItem(this.USER_TOKEN_STORE_KEY);
          if (!tokenJson) {
          return null;
        }
        
          var obj = JSON.parse(tokenJson);
          if (obj.expiredTime && obj.expiredTime < Date.now()) {
            return "";
          }
          this._token_timeout_ti = setTimeout(() => {
            console.log("User Token 过期：", obj);
            this.emit("token@expire", this.user.userToken);
            this.clearUserToken();
          }, obj.expiredTime - Date.now());
          return obj || null;
        } catch (e) {
          return null;
        }
    }

    setUserToken(obj: any) {
        if (typeof obj !== "string") {
          this.user.initUserInfo(obj);
          obj = JSON.stringify(obj);
        } else {
          throw new TypeError(
            "user token must be an object",
          );
        }
        localStorage.setItem(this.USER_TOKEN_STORE_KEY, obj);
        this._setUserToken(this.getUserToken());
        return true;
    }

    refreshTokenExpiredTime() {
      clearTimeout(this._token_timeout_ti);
      try {
        var tokenJson = localStorage.getItem(this.USER_TOKEN_STORE_KEY);
        if (!tokenJson) {
          return null;
        }
        var obj = JSON.parse(tokenJson);
        if (obj.expiredTime && obj.expiredTime < Date.now()) {
          return null;
        }
        obj.expiredTime = (Date.now() + 10*60*1000);
        this._token_timeout_ti = setTimeout(() => {
          console.log("User Token 过期：", obj);
          this.emit("token@expire", this.user.userToken);
          this.clearUserToken();
        }, obj.expiredTime - Date.now());
        
        if (typeof obj !== "string") {
          obj = JSON.stringify(obj);
        } else {
          throw new TypeError(
            "user token must be an object",
          );
        }
        localStorage.setItem(this.USER_TOKEN_STORE_KEY, obj);
        
  
      } catch(e) {
        return null;
      }
    }

    private _setUserToken(token: string) {
        this.user_token.next(this.getUserToken());
    }
    
    async clearUserToken() {
      await localStorage.removeItem(this.USER_TOKEN_STORE_KEY);
      this.user.cleanUserInfo();
      this._setUserToken(this.getUserToken());
  }

}
/**
 * 基于token的AsyncBehaviorSubjuet类型的属性/方法生成器
 * tokenBaseAsyncBehaviorSubjectGenerator
 *
 * @export
 * @param {any} target
 * @param {any} name
 * @param {any} descriptor
 */
export function TB_AB_Generator(
  target_prop_name: string,
  need_token = true,
  expiry_time_opts?: ExpiryTime & {
    loop?: boolean;
  },
) {
  return (target, name, descriptor) => {
    var executor: Executor<any> = descriptor.value;
    let _v: AsyncBehaviorSubject<any>;
    const timeout_auto_refresh = (from: Date) => {
      let refresh_time = calcExpiryTime(
        Object.assign({}, expiry_time_opts, { from }),
      );
      const do_refresh = () => {
        if (_v) {
          console.log(target_prop_name, "过期，强制刷新");
          _v.refresh(target_prop_name);
          if (expiry_time_opts && expiry_time_opts.loop) {
            timeout_auto_refresh(refresh_time);
          }
        }
      };
      const time_out = +refresh_time - Date.now();
      if (time_out < 0) {
        const time_span_val = +refresh_time - +from;
        // 将refresh_time推进到一个合适的值，确保下一次执行timeout_auto_refresh，得到的time_out正好>=0
        refresh_time = new Date(
          +refresh_time +
            ((Math.abs(time_out) / time_span_val) | 0) * time_span_val,
        );
        do_refresh();
      } else {
        setTimeout(do_refresh, time_out);
      }
      console.log("time_out", time_out);
    };
    // console.log(target_prop_name);
    Object.defineProperty(target, target_prop_name, {
      get() {
        if (!_v) {
          if (!(this.appSetting instanceof AppSettingProvider)) {
            throw new Error(
              `${
                this.constructor.name
              } 需要注入依赖： (appSetting)AppSettingProvider`,
            );
          }
          (this.appSetting as AppSettingProvider).user_token
            .distinctUntilChanged()
            .subscribe(token => {
              if (need_token && !token) {
                return;
              }
              if (!_v) {
                debugger
                _v = new AsyncBehaviorSubject(executor.bind(this));
                expiry_time_opts && timeout_auto_refresh(expiry_time_opts.from);
              } else {
                _v.refresh(target_prop_name);
              }
            });
        }
        return _v;
      },
    });
    return descriptor;
  };
}



export type TimeSpan = {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
};
export type ExpiryTime = {
  from: Date;
  time_span: TimeSpan;
};
export function calcExpiryTime(expiry_time: ExpiryTime) {
  const { from, time_span } = expiry_time;
  const res_time = new Date(+from);
  for (var k in time_span) {
    const v = time_span[k] | 0;
    switch (k) {
      case "year":
        res_time.setFullYear(res_time.getFullYear() + v);
        break;
      case "month":
        res_time.setMonth(res_time.getMonth() + v);
        break;
      case "day":
        res_time.setDate(res_time.getDate() + v);
        break;
      case "hour":
        res_time.setHours(res_time.getHours() + v);
        break;
      case "minute":
        res_time.setMinutes(res_time.getMinutes() + v);
        break;
      case "second":
        res_time.setSeconds(res_time.getSeconds() + v);
        break;
    }
  }
  return res_time;
}