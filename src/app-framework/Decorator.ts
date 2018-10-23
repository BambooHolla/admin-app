import {
    AlertController,
    AlertOptions,
    LoadingController,
    LoadingOptions,
    Loading,
    Content,
    ToastController,
    Modal,
    Alert,
} from "ionic-angular";
import {
    FLP_Tool,
} from "./FLP_Tool";
import { Toast } from "@ionic-native/toast";
import { isErrorFromAsyncerror, getErrorFromAsyncerror, PAGE_STATUS } from "./const";
export { isErrorFromAsyncerror, getErrorFromAsyncerror }
import { AbortError } from "./PromiseExtends";
import {afCtrl} from './helper'

export interface ErrorAlertOptions extends AlertOptions {
    independent?: boolean;
}
export type ErrorOptions =
  | ErrorAlertOptions
  | ((self: FLP_Tool) => ErrorAlertOptions)
  | ((self: FLP_Tool) => Promise<ErrorAlertOptions>);

/** 默认情况下，同样的错误信息只显示一个，除非指定 independent 为true*/
const ERROR_LAYER_MAP = new Map<string, Alert | Modal>();

export function asyncErrorWrapGenerator(
    error_title: any = "错误",
    opts?: ErrorOptions,
    hidden_when_page_leaved = true,
    keep_throw = false,
    dialogGenerator?: (
        params,
        self: FLP_Tool,
    ) => Modal | Alert | Promise<Modal> | Promise<Alert>,
) {
    return function asyncErrorWrap(target, name, descriptor) {
        const source_fun = descriptor.value;
        descriptor.value = function ErrorWrap(...args) {
            let page_leaved = false;
            if("PAGE_STATUS" in this) {
                this.event.once("didLeave", ()=> {
                    page_leaved = true;
                });
            }
            return source_fun.apply(this, args).then(data => {
                if(data && data.__source_err__) {
                    // 获取异常并抛出
                    return Promise.reject(data.__source_err__);
                }
                return data;
            }).catch(err => {
                if(isErrorFromAsyncerror(err)) {
                    // 已经弹出，不再提示
                    return keep_throw? Promise.reject(err) : err;
                }
                let err_msg;
                if(err instanceof Error) {
                    err_msg = err.message;
                } else if(err.message) {
                    err_msg = err.message + '';
                } else if(err.exception) {
                    err_msg = err.exception + '';
                } else {
                    err_msg = err + '';
                }
                console.group("CATCH BY asyncErrorWrapGenerator:");
                console.warn(err);
                console.groupEnd();
                if(hidden_when_page_leaved && page_leaved) {
                    console.log(
                      "%c不弹出异常提示因为页面的切换 " + (this.cname || ""),
                      "color:yellow",
                    );
                    return getErrorFromAsyncerror(keep_throw);
                }
                if(!dialogGenerator) {
                    const alertCtrl: AlertController = this.alertCtrl;
                    if(!(alertCtrl instanceof AlertController)) {
                        console.warn(
                            "需要在",
                            target.constructor.name,
                            "中注入 AlertController 依赖",
                        );
                        dialogGenerator = (params: {title: string}) => {
                            return {
                                present() {
                                    alert(params.title);
                                    this.__did_dismiss_cb_list.forEach(cb => cb());
                                },
                                __did_dismiss_cb_list: [],
                                onDidDismiss(cb) {
                                    this.__did_dismiss_cb_list.pus(cb);
                                },
                            } as any;
                        };
                    } else {
                        dialogGenerator = params => {
                            return alertCtrl.create(params);
                        };
                    }
                }
                const _dialogGenerator = dialogGenerator;
                const _error_title = error_title;
                const _err_msg = err_msg;

                Promise.all([_error_title,_err_msg,opts instanceof Function? opts(this) : opts])
                .then(
                    ([error_title, err_msg, opts]: [
                    string,
                    string,
                    ErrorAlertOptions | undefined
                  ]) => {
                    const dialog_opts = Object.assign(
                        {
                          title: String(error_title),
                          subTitle: String(err_msg),
                          buttons: ["确定"],
                        },
                        opts,
                    ); 
                    const present_able = _dialogGenerator(dialog_opts, this);
                    Promise.resolve<Modal | Alert>(present_able).then( p => {
                        if (opts && opts.independent) {
                            p.present();
                        } else {
                            const p_key = JSON.stringify(opts);
                            if (!ERROR_LAYER_MAP.has(p_key)) {
                                ERROR_LAYER_MAP.set(p_key, p);
                                p.present();
                                p.onDidDismiss(() => {
                                  afCtrl.raf(() => {
                                    ERROR_LAYER_MAP.delete(p_key);
                                  });
                                });
                            } else {
                                // 如果已经有了，那么就不用在弹出了
                                console.warn("弹出层已经存在，不重复弹出", dialog_opts);
                            }
                        }
                    });
                  },
                );
                return getErrorFromAsyncerror(keep_throw);
            });
        };
        descriptor.value.source_fun = source_fun;
        return descriptor;
    };
}

export function asyncSuccessWrapGenerator(
    success_msg: any = "成功",
    position = "bottom",
    duration = 800,
    hidden_when_page_leaved = true,
  ) {
    return function asyncSuccessWrap(target, name, descriptor) {
      const source_fun = descriptor.value;
      descriptor.value = function SuccessWrap(...args) {
        let is_show = null;
        return source_fun.apply(this, args).then(data => {
          if (isErrorFromAsyncerror(data) || data instanceof AbortError) {
            return data;
          }
          if (
            hidden_when_page_leaved &&
            // this.hasOwnProperty("PAGE_STATUS") &&
            isFinite(this.PAGE_STATUS) &&
            this.PAGE_STATUS > PAGE_STATUS.WILL_LEAVE
          ) {
            console.log("不弹出成功提示因为页面的切换");
            return data;
          }
          success_msg = success_msg;
  
          if ("plugins" in window && "toast" in window["plugins"]) {
            const toast = window["toast"] as Toast;
            Promise.resolve(success_msg).then(message => {
              toast.show(String(message), duration + "", position).toPromise();
            });
          } else {
            const toastCtrl: ToastController = this.toastCtrl;
            if (!(toastCtrl instanceof ToastController)) {
              console.warn(
                "需要在",
                target.constructor.name,
                "中注入 ToastController 依赖",
              );
              alert(String(success_msg));
            } else {
              Promise.resolve(success_msg).then(message => {
                 toastCtrl
                .create({
                  message: String(message),
                  position,
                  duration,
                }).present();
              });
            }
          }
          return data;
        });
      };
      descriptor.value.source_fun = source_fun;
      return descriptor;
    };
}


const loadingIdLock = (window["loadingIdLock"] = new Map<
  string,
  {
    // readonly is_presented: boolean;
    loading?: Loading;
    promises: Set<Promise<any>>;
  }
>());

export function asyncLoadingWrapGenerator(
    loading_msg: any = "请稍候",
    check_prop_before_present?: string,
    opts?: LoadingOptions & { dismiss_hanlder_name?: string },
    id?: string,
    export_to_proto_name?: string,
  ) {
    if (id) {
      var id_info = loadingIdLock.get(id);
      if (!id_info) {
        id_info = {
          // get is_presented() {
          //   return this.promises.size && this.loading;
          // },
          loading: undefined,
          promises: new Set<Promise<any>>(),
        };
        loadingIdLock.set(id, id_info);
      }
    }
    return function asyncLoadingWrap(target, name, descriptor) {
      const source_fun = descriptor.value;
      descriptor.value = function(...args) {
        const loadingCtrl: LoadingController = this.loadingCtrl;
        if (!(loadingCtrl instanceof LoadingController)) {
          throw new Error(
            target.constructor.name + " 缺少 LoadingController 依赖",
          );
        }
        // 创建loading
        loading_msg = loading_msg;
  
        Promise.resolve(loading_msg).then(loading_msg => {
          loading.setContent(String(loading_msg));
        });
  
        const loadingOpts = Object.assign(
          {
            content: String(loading_msg),
            cssClass:
              (this.PAGE_LEVEL | 0) > 1
                ? "can-goback blockchain-loading"
                : "blockchain-loading",
          },
          opts,
        );
        const loading = loadingCtrl.create(loadingOpts);
        if (export_to_proto_name !== undefined) {
          this[export_to_proto_name] = loading;
        }
        // 执行promise
        const res = source_fun.apply(this, args);
  
        // 进行唯一检查
        if (check_prop_before_present && this[check_prop_before_present]) {
          // 检测到不用弹出
          return res;
        }
        if (id_info) {
          // 加入到集合中
          id_info.promises.add(res);
        }
  
        loading.onWillDismiss(() => {
          loading["_is_dissmissed"] = true;
        });
        loading["_my_present"] = () => {
          if (loading["_is_presented"] || loading["_is_dissmissed"]) {
            return;
          }
          loading["_is_presented"] = true;
          loading.present();
          const checkLoadingPageRef = () => {
            if (!loading.pageRef()) {
              return afCtrl.raf(checkLoadingPageRef);
            }
            if (
              this.content instanceof Content &&
              loadingOpts.cssClass.split(/\s+/).indexOf("can-goback") !== -1
            ) {
              const loadingEle = loading.pageRef().nativeElement;
              loadingEle.style.marginTop = this.content._hdrHeight + "px";
              console.log(loadingEle, this.content._hdrHeight);
            }
          };
          afCtrl.raf(checkLoadingPageRef);
        };
        const loading_present = (...args) => {
          if (id_info) {
            if (!id_info.loading) {
              id_info.loading = loading;
              loading["_my_present"]();
            }
          } else {
            loading["_my_present"]();
          }
        };
  
        loading["_my_dismiss"] = () => {
          if (loading["_is_dissmissed"]) {
            return;
          }
          loading["_is_dissmissed"] = true;
          if (loading["_is_presented"]) {
            loading.dismiss();
          }
        };
        let before_dismiss: Function | undefined;
        const loading_dismiss = (...args) => {
          before_dismiss && before_dismiss();
          if (id_info) {
            if (id_info.promises.has(res)) {
              // 从集合中移除
              id_info.promises.delete(res);
              if (id_info.promises.size === 0 && id_info.loading) {
                id_info.loading["_my_dismiss"]();
                id_info.loading = undefined;
              }
            }
          } else {
            loading["_my_dismiss"]();
          }
        };
        if (loadingOpts.dismiss_hanlder_name) {
          this[loadingOpts.dismiss_hanlder_name] = loading_dismiss;
        }
        if ("PAGE_STATUS" in this) {
          // 还没进入页面
          const run_loading_present = with_dealy => {
            before_dismiss = undefined;
            with_dealy ? setImmediate(loading_present) : loading_present();
            this.event.once("didLeave", loading_dismiss);
          };
          if (this.PAGE_STATUS <= PAGE_STATUS.WILL_ENTER) {
            // 等到进入页面后再开始调用
            this.event.on("didEnter", run_loading_present);
            // before_dismiss = () => {
            //   this.event.off("didEnter", run_loading_present);
            // };
          } else if (this.PAGE_STATUS === PAGE_STATUS.DID_ENTER) {
            run_loading_present(true);
            this.event.on("didEnter", run_loading_present);
          } else {
            debugger;
          }
        } else {
          console.warn("loading修饰器请与FirstLevelPage或者其子类搭配使用最佳");
          loading_present();
        }
  
        return res
          .then(data => {
            // 这里的触发可能会比didEnter的触发更早
            // 所以应该在执行的时候移除掉present的显示
            loading_dismiss();
            return data;
          })
          .catch(err => {
            loading_dismiss();
            return Promise.reject(err);
          });
      };
      descriptor.value.source_fun = source_fun;
      return descriptor;
    };
}

export const asyncCtrlGenerator = {
    success: asyncSuccessWrapGenerator,
    loading: asyncLoadingWrapGenerator,
    error: asyncErrorWrapGenerator,
};
