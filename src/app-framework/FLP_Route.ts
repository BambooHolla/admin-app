import { FLP_Lifecycle } from "./FLP_Lifecycle";
import {
    NavController,
    NavOptions,
    NavParams,
    ViewController,
} from "ionic-angular";
import { asyncCtrlGenerator } from "./Decorator";
import { PAGE_STATUS } from "./const";

export class FLP_Route extends FLP_Lifecycle {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
    ) {
        super();
    }
    _navCtrlPush(path: string, params?: any, opts?: NavOptions, done?: any) {
        // opts = Object.assign({animation: 'common-transition', direction: 'forward'}, opts);
        return this.navCtrl.push(path, params, opts, done);
    }
    /** 路由loading显示与否的控制器 */
    hide_jump_loading: boolean = true;
    current_routeTo_page: string = "";

    static jump_loading_message = {
        msg: "",
        toString() {
            return this.msg;
        },
    };
    static jump_error_title = {
        title: "",
        toString() {
          return this.title;
        },
    };
    setNavParams(key: string, val: any) {
        this.navParams.data[key] = val;
    }

    // JOB模式
    // 页面A为了实现某个任务，打开页面B
    // 页面B完成任务后，返回页面A，触发任务完成的回调
    // 这个流程相关的API
    viewCtrl?: ViewController;
    _job_res: any;
    jobRes(data: any) {
        this._job_res = data;
    }
    finishJob(
        remove_view_after_finish: boolean = this.navParams.get("auto_return") || this.navParams.get("remove_view_after_finish"),
        time: number = this.navParams.get("auto_return_time"),
    ) {
        this.navParams.data["is_finish_job"] = true;
        if(remove_view_after_finish) {
            time = time || 500;
            setTimeout(() => {
                const viewCtrl = this.viewCtrl;
                if(viewCtrl) {
                    const preView = this.navCtrl.getPrevious();
                    if(preView) {
                        this.navCtrl.removeView(viewCtrl);
                        const com = preView.instance as FLP_Route;
                        com.tryEmit("job-finished",{
                            id: viewCtrl.id,
                            data: this._job_res,
                        })
                    } else {
                        viewCtrl.dismiss();
                    }
                } else {
                    console.warn(
                        "使用remove_view_after_finish必须注入viewCtrl: ViewController对象",
                    );
                    this.PAGE_STATUS === PAGE_STATUS.DID_ENTER && this.navCtrl.pop();
                }
            }, time);
            return true;
        }
        return false;
    }

    @FLP_Route.didLeave
    private _doAfterFinishJob() {
        // 检查页面退出后要做的事情，从上一级页面传下来的
        if (this.navParams.get("is_finish_job")) {
          const after_finish_job = this.navParams.get("after_finish_job");
          if (after_finish_job instanceof Function) {
            after_finish_job();
          }
        }
    }


    /**
     * 页面跳转函数
     * 内置跳转拦截功能，需要通过 registerRouteToBeforeCheck 来注册拦截器
     */
    routeTo(path: string, ...args: any[]): Promise<any>;
    @asyncCtrlGenerator.loading(
        FLP_Route.jump_loading_message,
        "hide_jump_loading",
        { 
        showBackdrop: false,
        cssClass: "can-tap blockchain-loading",
        },
    )
    @asyncCtrlGenerator.error(FLP_Route.jump_error_title)
    async routeTo(path: string, params?: any, opts?: any, force = false) {
        if(this.current_routeTo_page == path && !force) {
            // 防止重复点击
            return ;
        }
        try {
            this.current_routeTo_page = path;
            // 重置参数
            this.hide_jump_loading = true;
            FLP_Route.jump_loading_message.msg = "请稍候";
            FLP_Route.jump_error_title.title = "页面切换异常";
            // 页面跳转
            const checkInfo = await FLP_Route.doRouteToBeforeCheck(
                this,
                path,
                params,
                opts,
            );
            if (checkInfo.preventDefault) {
                console.log("页面发生重定向");
                return;
            }
            params = Object.assign(checkInfo.to_next_params, params);
            return await this._navCtrlPush(path, params, opts);
        } catch(err) {

        } finally {
            this.current_routeTo_page = "";
        }
    }

    static registerRouteToBeforeCheck(
        match: string | string[] | RouteToBeforeCheck_Match,
        checker: RouteToBeforeCheck_Checker,
        weight = 0,
        name?: string,
    ) {
        if(typeof match === "string") {
            const match_path = match;
            match = path => match_path === path;
        }
        if(match instanceof Array) {
            const match_paths = match;
            match = path => match_paths.indexOf(path) !== -1;
        }
        this.ROUTE_TO_BEFORE_CHECK_LIST.push({
            name,
            match,
            checker,
            weight,
        });
        this.ROUTE_TO_BEFORE_CHECK_LIST.sort((a, b) => a.weight - b.weight);
    }

    static ROUTE_TO_BEFORE_CHECK_LIST: Array<RouteToBeforeCheck> = [];
    static async doRouteToBeforeCheck(
        self: FLP_Route,
        path: string,
        params?: any,
        opts?: any,
    ) {
        const to_next_params = {};
        let preventDefault = false;
        for(
            let i = 0, C: RouteToBeforeCheck;
            (C = this.ROUTE_TO_BEFORE_CHECK_LIST[i]);
            i +=1
        ) {
            const check_label = `CHECK ${i + 1}:${C.name || "NO-NAME"}`;
            console.time(check_label);
            if (C.match(path, params, opts)) {
                if(
                    await C.checker(
                        self, to_next_params,
                        {
                            path,
                            params,
                            opts,
                        }
                    )
                ) {
                    i = Infinity;
                    preventDefault = true;
                }
            }
            console.timeEnd(check_label);
        }
        return {
            preventDefault,
            to_next_params,
        };
        
    }
    /**
     * 智能跳转，尝试使用pop，如果是上一级的页面
     */
    smartRouteTo(path: string, params?: any, opts?: NavOptions) {
        const views = this.navCtrl.getViews();
        const pre_view = views[views.length - 2];
        if (pre_view.id === path) {
        Object.assign(pre_view.getNavParams().data, params);
        return this.navCtrl.pop();
        } else {
        return this.routeTo(path, params, opts);
        }
    }
    /**
     * 重定向页面
     */
    setRedirectUrl(
        redirect_url,
        title?: string,
        options?: {
        auto_close_when_redirect?: boolean;
        navbar_color?: string;
        after_nav_pop?: () => void;
        },
    ) {
        // this.redirect_url = this.sanitizer.bypassSecurityTrustResourceUrl(redirect_url);
        if (localStorage.getItem("disabled-iframe")) {
        navigator["clipboard"].writeText(redirect_url);
        return;
        }
        this.modalCtrl
        .create(
            "iframepage",
            Object.assign(
            {
                title,
                // 地址
                redirect_url,
                // 在第三方iframe页面加载出来后要显示给用户的提示
                load_toast: "", //"操作完成后请点击左上角的返回按钮"
                // 在第三方页面进行再跳转的时候，强制关闭页面
                auto_close_when_redirect: true,
            },
            options,
            ),
        )
        .present();
    }
}

enum QRCODE_GET_WAY {
    Cancle = "取消",
    FromPicture = "从相册中选择",
    FromCamera = "扫一扫",
}
const QRCODE_GET_WAY_value_set = new Set<QRCODE_GET_WAY>();
for (var key in QRCODE_GET_WAY) {
    QRCODE_GET_WAY_value_set.add(QRCODE_GET_WAY[key] as QRCODE_GET_WAY);
}
FLP_Route.registerRouteToBeforeCheck(
    ["page-address-scan"],
    async (self, to_next_params, { path, params, opts }) => {
    //   var result: QRCODE_GET_WAY;
      var inputEle: HTMLInputElement;
      const actionSheet = self.actionSheetCtrl.create({
        title: "请选择",
        buttons: [
          {
            icon: "qr-scanner",
            text: QRCODE_GET_WAY.FromCamera,
            handler() {
              actionSheet.dismiss(QRCODE_GET_WAY.FromCamera);
              return false;
            },
          },
          {
            icon: "ios-image-outline",
            text: QRCODE_GET_WAY.FromPicture,
            handler() {
              // 必须把触发函数写在click里头，不然安全角度来说，是无法正常触发的
              inputEle = document.createElement("input");
              inputEle.type = "file";
              inputEle.accept = "image/*";
              const clickEvent = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true,
              });
              inputEle.dispatchEvent(clickEvent);
              actionSheet.dismiss(QRCODE_GET_WAY.FromPicture);
              return false;
            },
          },
          {
            text: QRCODE_GET_WAY.Cancle,
            role: "cancel",
          },
        ],
      });
      const res = await new Promise<QRCODE_GET_WAY>((resolve, reject) => {
        actionSheet.present();
        actionSheet.onWillDismiss((data: QRCODE_GET_WAY) => {
          if (QRCODE_GET_WAY_value_set.has(data)) {
            resolve(data);
          } else {
            resolve(QRCODE_GET_WAY.Cancle);
          }
        });
      });
      if (res === QRCODE_GET_WAY.FromCamera) {
        return false;
      }
      if (res === QRCODE_GET_WAY.FromPicture) {
        const image_url = await new Promise<string | null>((resolve, reject) => {
          let runed = false;
          const cbWrap = (err?, res?) => {
            if (runed) {
              return;
            }
            runed = true;
  
            window.removeEventListener("focus", onCancel);
            err ? reject(err) : resolve(res);
          };
          inputEle.onchange = e => {
            if (inputEle.files && inputEle.files[0]) {
              cbWrap(null, URL.createObjectURL(inputEle.files[0]));
            } else {
              console.log("没有选择文件，代码不应该运行到这里");
              cbWrap(null);
            }
          };
          const onCancel = () => {
            setTimeout(() => {
              if (inputEle.files && !inputEle.files.length) {
                // cancel select;
                console.log("取消了文件选择");
                cbWrap(null);
              }
            }, 250);
          };
          window.addEventListener("focus", onCancel);
          inputEle.onerror = cbWrap;
        });
        if (image_url) {
          self._navCtrlPush(path, {
            title:"解析图片二维码",
            image_url,
            auto_return: true,
          });
        }
      }
      return true;
    },
    0,
    "询问用户是否要从相册选择图像进行二维码扫描",
);


type RouteToBeforeCheck = {
    name?: string;
    match: RouteToBeforeCheck_Match;
    checker: RouteToBeforeCheck_Checker;
    weight: number;
};
type RouteToBeforeCheck_Match = (
    path: string,
    params?: any,
    opts?: any,
) => boolean;
type RouteToBeforeCheck_Checker = (
    self: FLP_Route,
    to_next_params: any,
    route_to_args: {
        path: string;
        params?: any;
        opts?: any;
    }
) => Promise<undefined | boolean> | undefined | boolean;