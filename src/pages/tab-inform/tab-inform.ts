import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirstLevelPage } from '../../app-framework/FirstLevelPage';

/**
 * Generated class for the TabInformPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-tab-inform',
  templateUrl: 'tab-inform.html',
})
export class TabInformPage extends FirstLevelPage {
  // 由于content背景底下有一段图形样式，如果内容太多，造成滑动到底部图形出现太过怪异，动态添加padding解决
  private ionContentEle: any; // 视图 content元素
  private informListEle: any; // 视图 消息list元素
  private informLiseElePadding: boolean = false; // 是否给list 添加padding-bottom

  private inform_list = [
    {
      title: "提现地址提醒",
      content: "系统维护提现已完成，具体回复时间为按时打卡会受到送丢啊十多i阿瑟东爱仕达阿斯顿阿斯顿啊实打实的阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿",
      time:"2018-01-02 13:13:50",
      read: true,

    },{
      title: "提现地址提醒",
      content: "系统维护提现已完成，具体回复时间为按时打卡会受到送丢啊十多i阿瑟东爱仕达阿斯顿阿斯顿啊实打实的阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿",
      time:"2018-01-02 13:13:50",
      read: false,
    },{
      title: "提现地址提醒",
      content: "系统维护提现已完成，具体回复时间为按时打卡会受到送丢啊十多i阿瑟东爱仕达阿斯顿阿斯顿啊实打实的阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿",
      time:"2018-01-02 13:13:50",
      read: true,
    },{
      title: "提现地址提醒",
      content: "系统维护提现已完成，具体回复时间为按时打卡会受到送丢啊十多i阿瑟东爱仕达阿斯顿阿斯顿啊实打实的阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿",
      time:"2018-01-02 13:13:50",
      read: true,
    }, {
      title: "提现地址提醒",
      content: "系统维护提现已完成，具体回复时间为按时打卡会受到送丢啊十多i阿瑟东爱仕达阿斯顿阿斯顿啊实打实的阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿",
      time:"2018-01-02 13:13:50",
      read: false,
    },{
      title: "提现地址提醒",
      content: "系统维护提现已完成，具体回复时间为按时打卡会受到送丢啊十多i阿瑟东爱仕达阿斯顿阿斯顿啊实打实的阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿",
      time:"2018-01-02 13:13:50",
      read: false,
    },{
      title: "提现地址提醒",
      content: "系统维护提现已完成，具体回复时间为按时打卡会受到送丢啊十多i阿瑟东爱仕达阿斯顿阿斯顿啊实打实的阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿",
      time:"2018-01-02 13:13:50",
      read: false,
    },{
      title: "提现地址提醒",
      content: "系统维护提现已完成，具体回复时间为按时打卡会受到送丢啊十多i阿瑟东爱仕达阿斯顿阿斯顿啊实打实的阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿",
      time:"2018-01-02 13:13:50",
      read: false,
    }, {
      title: "提现地址提醒",
      content: "系统维护提现已完成，具体回复时间为按时打卡会受到送丢啊十多i阿瑟东爱仕达阿斯顿阿斯顿啊实打实的阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿",
      time:"2018-01-02 13:13:50",
      read: false,
    },{
      title: "提现地址提醒",
      content: "系统维护提现已完成，具体回复时间为按时打卡会受到送丢啊十多i阿瑟东爱仕达阿斯顿阿斯顿啊实打实的阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿",
      time:"2018-01-02 13:13:50",
      read: false,
    },{
      title: "提现地址提醒",
      content: "系统维护提现已完成，具体回复时间为按时打卡会受到送丢啊十多i阿瑟东爱仕达阿斯顿阿斯顿啊实打实的阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿",
      time:"2018-01-02 13:13:50",
      read: false,
    },{
      title: "提现地址提醒",
      content: "系统维护提现已完成，具体回复时间为按时打卡会受到送丢啊十多i阿瑟东爱仕达阿斯顿阿斯顿啊实打实的阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿阿斯顿",
      time:"2018-01-02 13:13:50",
      read: false,
    },
  ]
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public elementRef: ElementRef,
  ) {
      super(navCtrl, navParams);
  }

  @TabInformPage.didEnter 
  i() {
    this.handleElePadding();
    
  }

  // 需要在每次加载数据后调用
  handleElePadding(): void {
    this.ionContentEle = this.queryElement(this.elementRef.nativeElement, 'ion-content .scroll-content');
    this.informListEle = this.queryElement(this.elementRef.nativeElement, 'ion-content ion-list');
    const _content_height = this.ionContentEle.offsetHeight;
    const _inform_height = this.informListEle.offsetHeight;
    this.informLiseElePadding = (_inform_height - _content_height) > -76;
    this.ionContentEle.style.overflowY = this.informLiseElePadding ? "scroll" : "hidden";
  }
 
  
}
