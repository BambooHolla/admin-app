import { NgModule, ErrorHandler, InjectionToken } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, Config, IonicErrorHandler, DeepLinkConfigToken, UrlSerializer, App } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { setupUrlSerializer } from 'ionic-angular/navigation/url-serializer';
import { Keyboard } from "@ionic-native/keyboard";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { File } from '@ionic-native/file'
import { JPush } from '@jiguang-ionic/jpush';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { Clipboard } from "@ionic-native/clipboard";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { MyApp } from './app.component';

// 预加载页面
import { TabAssetPage } from '../pages/tab-asset/tab-asset';
import { TabSettingPage } from '../pages/tab-setting/tab-setting';
import { TabInformPage } from '../pages/tab-inform/tab-inform';
import { TabsPage } from '../pages/tabs/tabs';

import { LoginPage } from '../pages/login/login';

import { CustomDialogPage } from '../pages/custom-dialog/custom-dialog';
import { GestureLockPage } from '../pages/gesture-lock/gesture-lock';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from "@ionic/storage";
// 组件
import { ComponentsModule } from '../components/components.module';

// 管道
import { PipesModule } from '../pipes/pipes.module';

// 指令 
import { DirectivesModule } from '../directives/directives.module';

// 服务
import { AppFetchProvider } from '../providers/app-fetch/app-fetch';
import { AppSettingProvider } from '../providers/app-setting/app-setting';
import { AppDataServiceProvider } from '../providers/app-data-service/app-data-service';
import { KeyboardServiceProvider } from '../providers/keyboard-service/keyboard-service';
import { BackButtonServiceProvider } from '../providers/back-button-service/back-button-service';
import { AppPageServiceProvider } from '../providers/app-page-service/app-page-service';

// 页面切换动画
import { PageSwitchTransition } from './page-switch-transition';
import { CustomDialogPopIn, CustomDialogPopOut } from '../pages/custom-dialog/custom-dialog.transform';
import { LoginServiceProvider } from '../providers/login-service/login-service';


import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { UserInfoProvider } from '../providers/user-info/user-info';
import { ProductServiceProvider } from '../providers/product-service/product-service';
import { InformServiceProvider } from '../providers/inform-service/inform-service';
import { AddressServiceProvider } from '../providers/address-service/address-service';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}




export const MyDeepLinkConfigToken = new InjectionToken<any>("USERLINKS");
export function customDeepLinkConfig(deepLinkConfig) {
  const static_links = [
    { component: TabsPage, name: "tabs" },
    { component: TabAssetPage, name: "tab-asset" },
    { component: TabSettingPage, name: "tab-setting" },
    { component: TabInformPage, name: "tab-inform" },
    { component: CustomDialogPage, name: "custom-dialog"},
    { component: GestureLockPage, name: "gesture-lock"},
    { component: LoginPage, name: "login"}
  ];
  if (deepLinkConfig && deepLinkConfig.links) {
    const static_links_name_set = new Set(static_links.map(link => link.name));
    deepLinkConfig.links = deepLinkConfig.links.filter(
      link => !static_links_name_set.has(link.name as string),
    );
    deepLinkConfig.links.push(...static_links);
  }
  return deepLinkConfig;
}

const pages = [
  MyApp,
  TabAssetPage,
  TabSettingPage,
  TabInformPage,
  TabsPage,
  CustomDialogPage,
  GestureLockPage,
  LoginPage,
];

const providers = [
  AppFetchProvider,
  AppSettingProvider,
  AppDataServiceProvider,
  AppPageServiceProvider,
  UserInfoProvider,
  ProductServiceProvider,
  InformServiceProvider,
  AddressServiceProvider,
];
@NgModule({
  declarations: [
    ...pages,
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
      iconMode: "ios",
      mode: "ios",
      pageTransition: "page-switch-transition",
      tabsHideOnSubPages: 'true',
      scrollPadding: false,
      scrollAssist: false,
      autoFocusAssist: false,
      statusbarPadding: true,
      swipeBackEnabled: false,
      preloadModules: false,
      // tabsHideOnSubPages: true,// 这个有BUG，不要用。
    }),
    ComponentsModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    DirectivesModule,
    PipesModule,
  ],
  bootstrap: [IonicApp],
  entryComponents:pages,
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: MyDeepLinkConfigToken,
      useFactory: customDeepLinkConfig,
      deps: [DeepLinkConfigToken],
    },
    {
      provide: UrlSerializer,
      useFactory: setupUrlSerializer,
      deps: [App, MyDeepLinkConfigToken],
    },
    providers,
    Keyboard,
    KeyboardServiceProvider,
    BackButtonServiceProvider,
    AndroidPermissions,
    BarcodeScanner,
    JPush,
    File,
    ScreenOrientation,
    Clipboard,
    LoginServiceProvider,
    UserInfoProvider,
    ProductServiceProvider,
    InformServiceProvider,
    AddressServiceProvider,
  ]
})
export class AppModule {
  constructor(
    public config: Config,
  ) {
    config.setTransition("page-switch-transition", PageSwitchTransition); 
    config.setTransition("custom-dialog-pop-in", CustomDialogPopIn); 
    config.setTransition("custom-dialog-pop-out", CustomDialogPopOut); 
  }
}
