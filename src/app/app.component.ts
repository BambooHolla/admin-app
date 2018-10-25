import { Component, ViewChild, Renderer2 } from '@angular/core';
import { Platform, ActionSheetController, LoadingController, AlertController, ToastController, ModalController, Nav, MenuController, Events, LoadingOptions } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { JPush } from '@jiguang-ionic/jpush';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Clipboard } from "@ionic-native/clipboard";

import { 
  TabsPage,
  LoginPage,
  GestureLockPage
 } from '../pages/pages';

 import { EventEmitter } from "eventemitter3";

import { KeyboardServiceProvider } from '../providers/keyboard-service/keyboard-service';
import { AppDataServiceProvider } from '../providers/app-data-service/app-data-service';
import { AppPageServiceProvider } from '../providers/app-page-service/app-page-service';
import { AppSettingProvider } from '../providers/app-setting/app-setting';
import { UserInfoProvider } from '../providers/user-info/user-info';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { asyncCtrlGenerator } from '../app-framework/Decorator';
import { AppFetchProvider } from '../providers/app-fetch/app-fetch';
import { ProductServiceProvider } from '../providers/product-service/product-service';
import { InformServiceProvider } from '../providers/inform-service/inform-service';
@Component({
  templateUrl: 'app.html'
})
export class MyApp extends EventEmitter {
  @ViewChild('myNav') nav: Nav;
  private pages = [
    {
      name: "密码修改",
      icon: "picasso-change-pwd",
      path: "page-change-pwd",
    },{
      name: "登录设备",
      icon: "picasso-login-device",
      path: "page-change-pwd",
    },
    // {
    //   name: "手势密码",
    //   icon:'',
    //   path: "gesture-lock"
    // }
  ];
  // rootPage:any = TabsPage;
  static WINDOW_MAX_HEIGHT = 0;
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public jPush: JPush,
    public clipboard: Clipboard,
    public keyboardService: KeyboardServiceProvider,
    public screenOrientation: ScreenOrientation,
    public menuCtrl: MenuController,
    public appSetting: AppSettingProvider,
    public appDataProvider: AppDataServiceProvider,
    public appPageProvider: AppPageServiceProvider,
    public userInfo: UserInfoProvider,
    public appFetch: AppFetchProvider,
    public loginService: LoginServiceProvider,
    public productService: ProductServiceProvider,
    public InformService: InformServiceProvider,
    public renderer2: Renderer2,
  ) {
    super();
    window["myapp"] = this;
    window["actionSheetCtrl"] = actionSheetCtrl;
    window["alertCtrl"] = alertCtrl;
    window["loadingCtrl"] = loadingCtrl;
    window["toastCtrl"] = toastCtrl;
    window["modalCtrl"] = modalCtrl;
    window["menuCtrl"] = menuCtrl;
    window["platform"] = platform;
    window["jPush"] = jPush;
    window["appSetting"] = appSetting;
    window["appDataProvider"] = appDataProvider;
    window["appFetch"] = appFetch;
    window["userInfo"] = userInfo;
    window["productService"] = productService;
    window["InformService"] = InformService;
    productService.getExchangeRate()
    if (!navigator["clipboard"]) {
      navigator["clipboard"] = {
          writeText: text => clipboard.copy(text),
          readText: () => clipboard.paste(),
      };
    }
    // app配置
    this.appInit();
    // 初始化页面
    const initPage = (async () => {
      if(this.appSetting.getUserToken()){
        return GestureLockPage;
      }
      return LoginPage;
    })().catch( error => {
      console.error("get init page error:", error);
      return LoginPage;
    });
    platform.ready().then(() => {
      this.afterPlatformReady();
      // this.openPage(TabsPage);
      initPage.then(page => {
        return this.openPage(page)
      }).catch(error => {
        console.warn("INIT PAGE ERRROR", error);
        return this.openPage(LoginPage);
      })
    });
  }
  
  appInit() {
    // push推送, 只适合android
    if(this.isAndroid) {
      this.jPush.init();
      this.jPush.setDebugMode(true);
    }

    this.productService.init();
    // 监听token过期
    this.appSetting.on("token@expire", () => {
      this.openPage(LoginPage);
      this.appFetch.emit("token@expire");
      this.toastCtrl
      .create({
        message: "token过期，请重新登录",
        position: "bottom",
        duration: 2000,
      }).present();
    })

    this.keyboardService.init(this.renderer2); 

    // 解决顶部状态栏顶下来问题 
    this.overlaysWebView();
    
    this.statusBar.hide();

    // 禁止旋转区分
    this.screenOrientation
    .lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
    .catch(err => console.log("screenOrientation error:", err.message));

  }

  afterPlatformReady() {
    // this.nav.setRoot(TabsPage); // 设置首页为tabs页
    // this.nav.setRoot(LoginPage); // 设置首页为登录页面

    this.menuCtrl.enable(false, "myMenu");
    this.statusBar.show();
    this.overlaysWebView();

    if (this.isIOS) {
      // ios 设备需要在 platform ready 之后再设置方向锁定，
      // 并且锁定的方向应为 PORTRAIT_PRIMARY 。
      this.screenOrientation
      .lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
      .catch(err => {
          console.log("screenOrientation error:", err.message);
      });
    }


    // 确保页面元素准备就绪,避免出现白屏现象
    this.tryOverlaysWebView(5);

    setTimeout(() => {
      this.splashScreen.hide();
    }, 500);
  }


  overlaysWebView() {
    this.statusBar.styleDefault();
    this.statusBar.overlaysWebView(false);
    setTimeout(() => {
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleDefault();
    }, 0);
  }


  currentPage: any;
  _currentOpeningPage: any; // 前置对象 锁
  tryInPage: any;
  async openPage(page: string, force = false, loading_content?: string | null) {
    this.tryInPage = page;
    // if (!force) {
    //   if (
    //     this.currentPage == FirstRunPage ||
    //     this.currentPage == ScanPeersPage
    //   ) {
    //     return;
    //   }
    // }
    return this._openPage(page, loading_content);
  }
  private async _openPage(page: string, loading_content?: string | null) {
    // if (this.currentPage === page || this._currentOpeningPage === page) {
    //   return;
    // }
    try {
      this._currentOpeningPage = page;
      console.log(
        `%c Open Page:[${page}] and set as root`,
        "font-size:1.2rem;color:green;",
      );
      // if (page === MainPage) {
      //   if (!(await this.showFAIO(FAIO_CHECK.Login))) {
      //     return;
      //   }
      //   if (loading_content) {
      //     loading_content = loading_content;
      //   }
      // }
      this.currentPage = page;
      const loading_opts: LoadingOptions = { cssClass: "logo-loading" };
      const loadinger = loading_content
        ? this.loadingCtrl.create({
            content: loading_content || "",
            ...loading_opts,
          })
        : this.loadingCtrl.create(loading_opts);
      await (loadinger && loadinger.present());
      try {
        if (this.nav) {
          await this.nav.setRoot(page);
        } else {
          return this.nav && this.nav.setRoot(page);
        }
      } finally {
        await (loadinger && loadinger.dismiss());
      }
    } finally {
      // 还原临时对象
      this._currentOpeningPage = this.currentPage;
    }
  }



  _isIOS?: boolean;
  get isIOS() {
    if (this._isIOS === undefined) {
      this._isIOS = this.platform.is("ios");
    }
    return this._isIOS;
  }
  _isAndroid?: boolean;
  get isAndroid() {
	if(this._isAndroid === undefined) {
		this._isAndroid == this.platform.is("android");
	}
	return this._isAndroid;
  }

  overlay_finished = false;
  tryOverlaysWebView(loop_times: number = 0) {
    if (this.isIOS || this.overlay_finished) {
      return;
    }
    if (window.innerHeight < MyApp.WINDOW_MAX_HEIGHT) {
      // 如果高度不对劲的话，尽可能重新搞一下
      this.overlaysWebView();
    } else {
      this.overlay_finished = true;
    }
    if (loop_times > 0) {
      // 等一下再看看是否修正正确了，不行就再来一次
      setTimeout(() => {
        this.tryOverlaysWebView(loop_times - 1);
      }, 100);
    }
  }


  handlerMenuOpenPage(path: string) {
    this.appPageProvider.emit('menu@page',path);
  }

  @asyncCtrlGenerator.loading()
  loginOut() {
    this.openPage(LoginPage);
    this.appFetch.emit('token@expire', this.userInfo.userToken);
    // 不管退出是否失败，统一认为已退出，清空本地用户数据
    return this.loginService.loginOut().then( () => {
      this.appSetting.clearUserToken();
    }).catch( () => {
      this.appSetting.clearUserToken();
    });
  }
}

/*获取global正确的最大高度，可能对于分屏支持有问题*/
var resizeInfo = document.createElement("div");
function onresize() {
  if (!resizeInfo.parentElement && document.body) {
    resizeInfo.style.cssText =
      "display:none;position:fixed;top:100px;left:100px;background:rgba(0,0,0,0.5);color:#FFF;opacity:0.3;pointer-events:none;";
    document.body.appendChild(resizeInfo);
  }
  resizeInfo.innerHTML += `<p>${[
    window.innerHeight,
    document.body.clientHeight,
  ]}</p>`;
  MyApp.WINDOW_MAX_HEIGHT = Math.max(
    MyApp.WINDOW_MAX_HEIGHT,
    window.innerHeight,
  );
}
onresize();
window.addEventListener("resize", onresize);
