import { Http, Headers, RequestOptionsArgs } from "@angular/http";
import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";

import { AppUrl, AppSettingProvider } from "../app-setting/app-setting";
import { UserInfoProvider } from "../user-info/user-info";
import { getSocketIOInstance, baseConfig } from "../../app-framework/helper";
import { CommonService } from "../commonService";

type HTTP_Method = "get" | "post" | "put" | "delete";

export class ServerResError extends Error {
    static parseErrorMessage(code, message) {
        const CODE_LIST = [code + ""];
        var MESSAGE = message;
        while (MESSAGE.indexOf("500 - ") === 0) {
            const rest_msg = MESSAGE.substr(6);
            try {
                const rest_err = JSON.parse(rest_msg);
                if (rest_err.error) {
                    CODE_LIST.push(rest_err.error.code);
                    MESSAGE = rest_err.error.message;
                } else {
                    break;
                }
            } catch (err) {}
        }
        return new ServerResError(CODE_LIST, MESSAGE);
    }

    constructor(code_list: string[], message: string) {
        super(message);
        this.MESSAGE = String(message);
        this.CODE_LIST = code_list;
        this.stack += "\t\n" + code_list.join("\t\n");
    }
    CODE_LIST: string[];
    CODE: string;
    MESSAGE: string;
}

@Injectable()
export class AppFetchProvider extends CommonService {
    
    constructor(
        public http: Http,
        public appSetting: AppSettingProvider,
        // public translateService: TranslateService,
        public user: UserInfoProvider,
    ) {
        super();
        ["token@valid","token@expire"].forEach(key => {
            this.on(key, (token)=> {
                this.webio.emit(key, token);
            })
        });
        this.webio.on("io@data",(data) => {
            this.emit("io@data",data)
        })
        this.webio.on("io@reconnect",() => {
            const token = this.user.userToken;
            token &&  this.webio.emit("token@valid",token)
           
        })
    }

    webio = getSocketIOInstance(baseConfig.SERVER_URL, "/notices", AppSettingProvider.APP_ID);
    // get io() {
    //     return this.webio.io;
    // }
    get onLine() {
        return this.webio.onLine;
    }
    
    private _timeout_ms;
    private get timeout_ms(): number|any {
      const res = this._timeout_ms;
      // 一次性取值，取完就不用了
      this._timeout_ms = undefined;
      return res;
    }
    timeout(timeout_ms?: number): this {
      this._timeout_ms = timeout_ms;
      return this;
    }

    private async _requestWithApiService<T>(
        method: HTTP_Method,
        url: string,
        body: any,
        options: RequestOptionsArgs = {},
        no_token?: boolean,
        timeout_ms = this.timeout_ms,
    ) {
    
        return this._request<T>(
            method,
            url,
            body,
            options,
            no_token,
            timeout_ms,
        );
    }

    private _handleUrlAndOptions(
        url: string,
        options: RequestOptionsArgs = {},
        no_token?: boolean,
    ) {
        const headers = options.headers || (options.headers = new Headers());
        headers.append("appid", AppSettingProvider.APP_ID||'');
        headers.append("x-bnqkl-platform", AppSettingProvider.PLATFORM_TYPE);
        if(!no_token) {
            headers.append("x-auth-token", this.user.userToken);
            this.appSetting.refreshTokenExpiredTime();
        }
        const params = options.params as { [key: string]: any };
        if(params && params.constructor === Object) {
            delete options.params;
            for (var key in params) {
                const val = params[key];
                url = url.replace(new RegExp(`\:${key}`, "g"), val);
            }
            console.log(url);
        }
        return { url, options };
    }

    private _request<T>(
        method: string,
        url: string,
        body: any,
        options: RequestOptionsArgs = {},
        no_token?: boolean,
        timeout_ms = this.timeout_ms,
        ) {
        const reqInfo = this._handleUrlAndOptions(url, options, no_token);

        var req;
        switch (method) {
            case "get":
            case "delete":
            case "head":
            case "options":
                req = this.http[method](reqInfo.url, reqInfo.options);
                break;
            case "post":
            case "put":
            case "patch":
                req = this.http[method](reqInfo.url, body, reqInfo.options);
                break;
        }
        var req_promise = req.then instanceof Function ? req : req.toPromise();
        
        return this._handlePromise(req_promise);
    }
    private _handlePromise(promise) {
        return promise.catch(this._handleResCatch.bind(this))
                .then(this._handleResThen.bind(this));
    }
    private _handleResCatch(res) {
        const data = res.json instanceof Function ? res.json() : res;
        const error = data.message ? data : data.error;
       
        if(error) {
            let { message: err_message, code: error_code } = error;
            if (typeof error === "string") {
                err_message = error;
            }
            if(+error_code == -1) {
                // token失效
                this.appSetting.emit("token@expire",this.user.userToken);
                this.appSetting.clearUserToken();
            }
            throw ServerResError.parseErrorMessage(
                error_code,
                err_message,
            );
        } else {
            if(data) {
                if(
                    data.constructor.name === "ProgressEvent" ||
                    data.constructor.name === "XMLHttpRequestProgressEvent"
                ) {
                    throw new Error("网络异常");
                }
                    return Promise.resolve(data.data || data);
            } else {
                throw new Error("未知异常");
            }
        }
    }
    private _handleResThen(res) {
        const data = res.json instanceof Function ? res.json() : res;
    
        if (data.success) {
          return data;
        } else {
          //返回的错误在reject中统一处理，翻译后返回
          return this._handleResCatch(res);
        }
    }

    get<T>(
        url: string | AppUrl,
        options: RequestOptionsArgs = {},
        no_token?: boolean,
    ): Promise<T> {
        return this._requestWithApiService(
        "get",
        url.toString(),
        void 0,
        options,
        no_token,
        );
    }
    post<T>(
        url: string | AppUrl,
        body: any = {},
        options: RequestOptionsArgs = {},
        no_token?: boolean,
    ): Promise<T> {
        return this._requestWithApiService(
        "post",
        url.toString(),
        body,
        options,
        no_token,
        );
    }
    put<T>(
        url: string | AppUrl,
        body: any = {},
        options: RequestOptionsArgs = {},
        no_token?: boolean,
    ): Promise<T> {
        return this._requestWithApiService(
        "put",
        url.toString(),
        body,
        options,
        no_token,
        );
    }
    delete<T>(
        url: string | AppUrl,
        options: RequestOptionsArgs = {},
        no_token?: boolean,
    ): Promise<T> {
        return this._requestWithApiService(
        "delete",
        url.toString(),
        void 0,
        options,
        no_token,
        );
    }
}