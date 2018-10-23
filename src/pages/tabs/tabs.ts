import { Component, ElementRef, Renderer, ViewChild } from '@angular/core';


import { TabAssetPage } from '../tab-asset/tab-asset';
import { TabSettingPage } from '../tab-setting/tab-setting';
import { TabInformPage } from '../tab-inform/tab-inform';
import { FLP_Lifecycle } from '../../app-framework/FLP_Lifecycle';
import { NavController, NavParams, Events, Tabs, Platform } from 'ionic-angular';
import { BackButtonServiceProvider } from '../../providers/back-button-service/back-button-service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage extends FLP_Lifecycle {
  @ViewChild("myTabs") tabRef: Tabs;
  public tab1Root = TabAssetPage;
  public tab2Root = TabSettingPage;
  public tab3Root = TabInformPage;
  private _tab_style: any; // 用于记录底部导航样式
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private elementRef: ElementRef,
    private events: Events,
    private renderer: Renderer,
    public platform: Platform,
    public backButtonService: BackButtonServiceProvider,
  ) {
    super();
    this.platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(this.tabRef);
    });
  }

  @TabsPage.willEnter
  pageWillEnter() {
    const tabs = this.queryElement(this.elementRef.nativeElement,'.tabbar');
    this.events.subscribe('hideTabs',() => {
        this.renderer.setElementStyle(tabs,"display",'none');
        let SelectTab = this.tabRef.getSelected()._elementRef.nativeElement;
        let content = this.queryElement(SelectTab,'.scroll-content');
        this._tab_style = content.style['margin-bottom'];
        this.renderer.setElementStyle(content,"margin-bottom","0")
    });
    this.events.subscribe('showTabs',() => {
        this.renderer.setElementStyle(tabs,"display",'');
        let SelectTab = this.tabRef.getSelected()._elementRef.nativeElement;
        let content = this.queryElement(SelectTab,'.scroll-content');
        this.renderer.setElementStyle(content,"margin-bottom",this._tab_style);
    });

    // websock连接
    this.appFetch.emit("token@valid", this.userInfo.userToken);
    
  }

  private _hidden_tabs = new Set();
  hideTabs(hidden: boolean, key:string) {
    if (hidden) {
      this._hidden_tabs.add(key);
    } else {
      this._hidden_tabs.delete(key);
    }
  }
  getTabsHidden() {
    return this._hidden_tabs.size > 0;
  }
  
}
