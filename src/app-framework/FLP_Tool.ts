import { 
    ActionSheetController, 
    AlertController, 
    LoadingController, 
    ToastController, 
    ModalController, 
    MenuController,
    Platform
} from "ionic-angular";
import { EventEmitter } from "eventemitter3";

import {
    is_dev,
    tryRegisterGlobal,
    global,
    afCtrl,
} from "./helper";
import { AppSettingProvider } from "../providers/app-setting/app-setting";
import { AppDataServiceProvider } from "../providers/app-data-service/app-data-service";
import { UserInfoProvider } from "../providers/user-info/user-info";
import { ProductServiceProvider } from "../providers/product-service/product-service";
import { AppFetchProvider } from "../providers/app-fetch/app-fetch";
import { AppPageServiceProvider } from "../providers/app-page-service/app-page-service";

export { is_dev, tryRegisterGlobal, global }

export class FLP_Tool {
    @FLP_Tool.FromGlobal actionSheetCtrl!: ActionSheetController;
    @FLP_Tool.FromGlobal alertCtrl!: AlertController;
    @FLP_Tool.FromGlobal loadingCtrl!: LoadingController;
    @FLP_Tool.FromGlobal toastCtrl!: ToastController;
    @FLP_Tool.FromGlobal modalCtrl!: ModalController;
    @FLP_Tool.FromGlobal menuCtrl!: MenuController;
    @FLP_Tool.FromGlobal platform!: Platform;
    @FLP_Tool.FromGlobal appDataService!: AppDataServiceProvider;
    @FLP_Tool.FromGlobal appPageService!: AppPageServiceProvider;
    
    @FLP_Tool.FromGlobal appSetting!: AppSettingProvider;
    @FLP_Tool.FromGlobal productService!: ProductServiceProvider;
    @FLP_Tool.FromGlobal appFetch!: AppFetchProvider;
    @FLP_Tool.FromGlobal userInfo!: UserInfoProvider;
    @FLP_Tool.FromGlobal myapp!: any;

   
    private _isIOS?: boolean;
    get isIOS() {
        if (this._isIOS === undefined) {
        this._isIOS = this.platform.is("ios");
        }
        return this._isIOS;
    }
    private _isAndroid?: boolean;
    get isAndroid() {
        if (this._isAndroid === undefined) {
        this._isAndroid = this.platform.is("android");
        }
        return this._isAndroid;
    }
    private _isMobile?: boolean;
    get isMobile() {
        if (this._isMobile === undefined) {
        this._isMobile = this.platform.is("mobile");
        }
        return this._isMobile;
    }

    static FromGlobal(
        target: any,
        name: string,
        descriptor?: PropertyDescriptor,
    ) {
        if(!descriptor) {
            const _prop_name: string = `-G-${name}`;
            descriptor = {
                enumerable: true,
                configurable: true,
                get() {
                    return this[_prop_name] || window[name];
                },
                set(v) {
                    this[_prop_name] = v;
                }
            }
            Object.defineProperty(target, name, descriptor);
        }
    }

    async _showCustomDialog(
        data: {
          title?: string;
          iconType?: string;
          subTitle?: string;
          message?: string;
          buttons?: any[];
        },
        auto_open = true,
    ) {
        const dialog = this.modalCtrl.create("custom-dialog", data, {
            enterAnimation: "custom-dialog-pop-in",
            leaveAnimation: "custom-dialog-pop-out",
        });
        if (auto_open) {
            await dialog.present();
        }
        const getComponentInstance = () =>
            dialog && dialog.overlay && dialog.overlay["instance"];
        return Object.assign(dialog, {
            setTitle(new_title: string) {
            const instance = getComponentInstance();
            if (instance) {
                instance.content_title = new_title;
            } else {
                data.title = new_title;
            }
            },
            setSubTitle(new_subTitle: string) {
            const instance = getComponentInstance();
            if (instance) {
                instance.content_subTitle = new_subTitle;
            } else {
                data.subTitle = new_subTitle;
            }
            },
            setMessage(new_message: string) {
            const instance = getComponentInstance();
            if (instance) {
                instance.content_message = new_message;
            } else {
                data.message = new_message;
            }
            },
        });
    }

    showWarningDialog(
        title: string,
        subTitle?: string,
        message?: string,
        buttons?: any[],
        auto_open = true,
    ) {
        return this._showCustomDialog(
            {
            title,
            iconType: "warning",
            subTitle,
            message,
            buttons,
            },
            auto_open,
        );
    }

    showSuccessDialog(
        title: string,
        subTitle?: string,
        message?: string,
        buttons?: any[],
        auto_open = true,
    ) {
        return this._showCustomDialog(
            {
            title,
            iconType: "success",
            subTitle,
            message,
            buttons,
            },
            auto_open,
        );
    }
    showErrorDialog(
        title: string,
        subTitle?: string,
        message?: string,
        buttons?: any[],
        auto_open = true,
    ) {
        return this._showCustomDialog(
            {
            title,
            iconType: "error",
            subTitle,
            message,
            buttons,
            },
            auto_open,
        );
    }


    static getProtoArray = getProtoArray;
    static addProtoArray = addProtoArray;
    
    static raf: typeof afCtrl.raf = afCtrl.raf.bind(afCtrl);
    raf = FLP_Tool.raf;
    static caf: typeof afCtrl.caf = afCtrl.caf.bind(afCtrl);
    caf = FLP_Tool.caf;

    _event?: any;
    get event() {
      if (!this._event) {
        const event = new EventEmitter();
        this._event = event;
      }
      return this._event;
    }
    tryEmit(eventanme, ...args) {
        if (this._event) {
          return this._event.emit(eventanme, ...args);
        }
        return false;
    }
    
    queryElement(ele: HTMLElement, q: string) {
        return <HTMLElement>ele.querySelector(q)
    }
}

// 存储在原型链上的数据（字符串）集合
type classProtoArraydata = Map<string, string[]>;
const CLASS_PROTO_ARRAYDATA_POOL = (window[ "CLASS_PROTO_ARRAYDATA_POOL"] = new Map<string | Symbol, classProtoArraydata>());
const PA_ID_KEY = "@PAID:" + Math.random().toString(36).substr(2);

export function getProtoArray(target: any, key: string) {
    let res = new Set();
    const CLASS_PROTO_ARRAYDATA = CLASS_PROTO_ARRAYDATA_POOL.get(key);
    if(CLASS_PROTO_ARRAYDATA) {
        do {
            if(target.hasOwnProperty(PA_ID_KEY)) {
                const arr_data = CLASS_PROTO_ARRAYDATA.get(target[PA_ID_KEY]);
                if( arr_data ) {
                    for ( let item of arr_data) {
                        res.add(item);
                    }
                }
            }
        } while ((target = Object.getPrototypeOf(target)))
    }
    return res;
}
window['getProtoArray'] = getProtoArray;

let PA_ID_VALUE = 0;
export function addProtoArray(target: any, key: string, value: any) {
    let CLASS_PROTO_ARRAYDATA = CLASS_PROTO_ARRAYDATA_POOL.get(key);
    if(!CLASS_PROTO_ARRAYDATA) {
        CLASS_PROTO_ARRAYDATA = new Map();
        CLASS_PROTO_ARRAYDATA_POOL.set(key,CLASS_PROTO_ARRAYDATA);
    }

    const pa_id = target.hasOwnProperty(PA_ID_KEY)? target[PA_ID_KEY] : (target[PA_ID_KEY] = '#' + PA_ID_VALUE++);
    let arr_data =CLASS_PROTO_ARRAYDATA.get(pa_id);
    if(!arr_data) {
        arr_data = [value];
        CLASS_PROTO_ARRAYDATA.set(pa_id, arr_data);
    } else {
        arr_data.push(value);
    }
}