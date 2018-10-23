import {Component, ElementRef, ViewChild, Renderer2} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, Events, Platform, AlertController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import { FirstLevelPage } from '../../app-framework/FirstLevelPage';
import { TabsPage, LoginPage } from '../pages';

export class Point {
  x: number;
  y: number;
  index?: number;
}
export class TipSelectPoint {
  value: Point;
  select: boolean;
}
export class AdminAppGestureLockObj {
  password: string;
  chooseType: number;
  step: number;

  constructor() {
    this.chooseType = 3;
    this.step = 0;
  }
}

export class AdminAppGestureAttemptObj {
  lockDate: number;
  lastAttemptDate: number;
  attemptsNu: number;

  constructor() {
    this.attemptsNu = 3;
  }
 
}
@Component({
  selector: 'page-gesture-lock',
  templateUrl: 'gesture-lock.html',
})
export class GestureLockPage extends FirstLevelPage {
  height = Math.floor((window.innerHeight*0.7)) || 320;
  width = Math.floor((window.innerWidth)) || 320;
  chooseType = 3;
  devicePixelRatio; // 设备密度
  titleTip = "设置手势密码";
  titleMes = "绘制解锁图案";
  titleMes_supplement = '';
  titleMes_number:any = '';
  unSelectedColor = '#a0ccee';
  selectedColor = '#a0ccee';
  settingColor = '#fce791';
  centerColor = "#fff";
  circularLineWidth = 2;
  lineWidth = 6;
  // successColor = '#C1B17F';
  errorColor = '#d54e20';
  tipColor = "#999999";
  lockTimeUnit = 60; //尝试失败后锁定多少秒
  transitionTime = 500; // 解锁操作后，等待几毫秒
  adminAppGestureLockObj: AdminAppGestureLockObj = new AdminAppGestureLockObj(); //密码本地缓存
  adminAppGestureAttemptObj: AdminAppGestureAttemptObj = new AdminAppGestureAttemptObj();  //尝试日期和次数本地缓存
  showReset: boolean = false;
  firstPassword: string;
  showDelete:boolean = false;
  private hasGestureLock:boolean = false;// 是否设置
  private canTouch = false;
  private radius: number; //小圆点半径

  private allPointArray: Point[] = [];
  private unSelectedPointArray: Point[] = [];
  private selectedPointArray: Point[] = [];
  private ctx;

  private lockTime = this.lockTimeUnit;

  @ViewChild('canvas') canvas: ElementRef;
  textColor = this.tipColor;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private render: Renderer2,
    private storage: Storage,
    public viewCtrl: ViewController,
    public events: Events,
    public platform: Platform,
    public alterCtrl: AlertController,
  ) {
    super(navCtrl, navParams);
  }

  @GestureLockPage.onInit
  async init() {
    this.height = this.width = this.height > this.width ? this.width : this.height;
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.radius = this.width * this.devicePixelRatio / (1 + 2 * this.chooseType) / 2; // 半径计算
    this.canvas.nativeElement.height = this.height * this.devicePixelRatio;
    this.canvas.nativeElement.width = this.width * this.devicePixelRatio;
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.initPointArray();
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawCircles(this.allPointArray);
    this.bindEvent();

    await this.storage.get('adminAppGestureLockObj').then(data => {
      if (data) {
        this.adminAppGestureLockObj = data;
        this.titleTip = "手势密码"
        this.titleMes = "手势密码解锁";
      }
    });

    await this.storage.get('adminAppGestureAttemptObj').then(data => {
      if (data) {
        this.adminAppGestureAttemptObj = data;
        if (this.adminAppGestureAttemptObj.attemptsNu === 0) {
          const now = Date.now();
          const last =this.adminAppGestureAttemptObj.lockDate;
          const secend = (now - last) / 1000 - this.lockTimeUnit;
          if (secend < 0) {
            this.setInteralFun( Math.abs(Math.ceil(secend)) );
            this.showReset = true;
          } else { 
            this.adminAppGestureAttemptObj = new AdminAppGestureAttemptObj();
            this.storage.set("adminAppGestureAttemptObj", this.adminAppGestureAttemptObj);
          }
        }
      }
    });
    // this.hasGestureLock = await this.navParams.get('hasGestureLock');
    
    // if(this.hasGestureLock) {
    //   this.resetPasswordFun();
    // }
    
    // if( this.hasGestureLock != false && this.hasGestureLock != true && !this.unregisterBackButton) {
    //   // 打开app解锁，屏蔽
    //   this.unregisterBackButton = this.platform.registerBackButtonAction(
    //     () => {
           
    //     },
    //   ); 
    //   this.adminAppGestureLockObj.step = 2;
    //   this.titleMes = "手势密码解锁";
    // }

    // if (this.adminAppGestureLockObj.step === 0) {
    //   this.titleMes = "绘制解锁图案";
    // }
  }
  //滑动结束后处理密码
  private dealPassword(selectedArray) {
    // 每次清空，避免提示错误
    this.titleMes_number = '';
    this.titleMes_supplement = '';

    if (this.adminAppGestureLockObj.step === 2) {   /** 进入解锁 **/
      if (this.checkPassword(selectedArray, this.adminAppGestureLockObj.password)) {  // 解锁成功
        // this.textColor = this.successColor;
        this.titleMes = '解锁成功';
        // this.drawAll(this.successColor); 
        this.setPage(TabsPage);
        this.drawAll(this.selectedColor);
        this.storage.remove('adminAppGestureAttemptObj');
      
      } else {   //解锁失败
        this.titleMes = '解锁失败';
        this.lockFaile(); 
      }
    } else if (this.adminAppGestureLockObj.step === 1) {  // 设置密码确认密码
      if (this.checkPassword(selectedArray, this.firstPassword)) { //设置密码成功
        this.adminAppGestureLockObj.step = 2;
        this.adminAppGestureLockObj.password = this.firstPassword;
        this.titleMes = '手势密码设置成功';
        this.textColor = this.settingColor;
        this.storage.set('adminAppGestureLockObj', this.adminAppGestureLockObj)
        this.drawAll(this.settingColor);
        this.setPage(TabsPage);
      } else {  //设置密码失败
        this.textColor = this.errorColor;
        this.titleMes = '两次不一致，重新设置';
        this.drawAll(this.errorColor);
        this.adminAppGestureLockObj = new AdminAppGestureLockObj();
      }
    } else if (this.adminAppGestureLockObj.step === 0) { //设置密码
      if(selectedArray.length < 3) {
        this.titleMes = '至少经过3个点';
        return ;
      }
      this.adminAppGestureLockObj.step = 1;
      this.firstPassword = this.parsePassword(selectedArray);
      this.textColor = this.tipColor;
      this.titleMes = '再次绘制解锁图案';
    } else if (this.adminAppGestureLockObj.step === 3) {//重置密码输入旧秘密
      if (this.checkPassword(selectedArray, this.adminAppGestureLockObj.password)) {  // 旧密码成功
        this.adminAppGestureLockObj.step = 0;
        // this.textColor = this.selectedColor;
        this.titleMes = '请输入新手势密码';
        this.showDelete =this.hasGestureLock
        this.drawAll(this.selectedColor);
      } else {   //旧密码失败
        this.lockFaile();
      }
    }
  }

  //解锁失败
  lockFaile() {
    this.drawAll(this.errorColor);
    this.textColor = this.errorColor;
    this.adminAppGestureAttemptObj.attemptsNu = this.adminAppGestureAttemptObj.attemptsNu - 1;
    if(!this.showReset) this.showReset = true;
    if (this.adminAppGestureAttemptObj.attemptsNu > 0) {
      this.titleMes = `密码错误，您还可以输入`;
      this.titleMes_number = this.adminAppGestureAttemptObj.attemptsNu;
      this.titleMes_supplement = '次';
    } else {
      this.adminAppGestureAttemptObj.lockDate = Date.now();
      this.storage.set("adminAppGestureAttemptObj", this.adminAppGestureAttemptObj);
      this.titleMes = `请在`; 
      this.titleMes_number = this.lockTime;
      this.titleMes_supplement = '秒后尝试';
      this.setInteralFun(this.lockTimeUnit);
    }
  }

  setInteralFun(time) { //检查是否超过设定时间
    this.lockTime = time;
    const interval = setInterval(() => {
      this.lockTime = this.lockTime - 1;
      this.titleMes = `请在`; 
      this.titleMes_number = this.lockTime;
      this.titleMes_supplement = '秒后尝试';
      if (this.lockTime <= 0) {
        this.adminAppGestureAttemptObj = new AdminAppGestureAttemptObj();
        this.storage.set("adminAppGestureAttemptObj", this.adminAppGestureAttemptObj);
        this.lockTime = this.lockTimeUnit;
        this.titleMes = "手势密码解锁";
        this.titleMes_number = '';
        this.titleMes_supplement = '';
        if(this.hasGestureLock) {
          this.resetPasswordFun();
        }
        clearInterval(interval);
      }
    }, 1000);
  }

  //重置手势密码
  resetPasswordFun() {
    this.titleMes = '请输入旧手势密码';
    this.adminAppGestureLockObj.step = 3;
  }
  //删除手势密码
  deletPasswordFun() {
    // this.alterCtrl.create({
    //   title: "手势密码",
    //   message:"确定删除？",
    //   buttons: [
    //     {
    //         text: "取消",
    //         role: "cancel",
    //         handler: () => {},
    //     },
    //     {
    //         text: "确定",
    //         handler: () => {
    //           this.storage.remove("adminAppGestureLockObj");
    //           this.adminAppGestureLockObj = new adminAppGestureLockObj();
    //           // this.titleMes = 'GESTURE_PLEASE_SET_PASSWORD';
    //           this.titleMes_number = '';
    //           this.titleMes_supplement = '';
    //           this.reset();
    //           this.hasGestureLock = false;
    //           setTimeout( () => {
    //             this.navCtrl.pop({
    //               animate: true,
    //               direction: "back",
    //               animation: "ios-transition",
    //             })
    //           },300)
    //         },
    //     },
    // ],
    // }).present();
    this.storage.remove("adminAppGestureLockObj");
    this.adminAppGestureLockObj = new AdminAppGestureLockObj();
    // this.titleMes = 'GESTURE_PLEASE_SET_PASSWORD';
    this.titleMes_number = '';
    this.titleMes_supplement = '';
    this.reset();
    this.hasGestureLock = false;
  }

  //设置手势密码矩阵
  setChooseType(type) {
    this.chooseType = type;
  }

  //初始化手势点的坐标数组
  private initPointArray() {
    const n = this.chooseType;
    const radius = this.radius;
    this.selectedPointArray = [];
    this.allPointArray = [];
    this.unSelectedPointArray = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const obj = {
          x: (j * 4 + 3) * radius,
          y: (i * 4 + 3) * radius,
          index: ((i * n + 1 + j) + 2) * 7 - 1
        };
        this.allPointArray.push(obj);
        this.unSelectedPointArray.push(obj);
      }
    }
  }

  //滑动手势的时候更新画布
  private update(nowPoint: Point) {
    this.drawAll(this.selectedColor, nowPoint);
    this.dealPoint(this.unSelectedPointArray, nowPoint);
  }

  private checkPassword(pointArray, password): boolean {
    return password === this.parsePassword(pointArray);
  }

  private parsePassword(pointArray): string {
    return pointArray.map(data => {
      return data.index;
    }).join("");
  }

  //获得手指滑动点的位置
  private getPosition(e): Point {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.touches[0].clientX - rect.left) * this.devicePixelRatio,
      y: (e.touches[0].clientY - rect.top) * this.devicePixelRatio
    };
  }

  //重置
  reset() {
    this.initPointArray();
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawCircles(this.allPointArray);
  }

  //添加滑动监听事件
  private bindEvent() {
    this.render.listen(this.canvas.nativeElement, "touchstart", (e) => {
      e.preventDefault();
      if (this.selectedPointArray.length === 0 && this.adminAppGestureAttemptObj.attemptsNu !== 0) {
        this.dealPoint(this.allPointArray, this.getPosition(e), true);
      }
    });
    this.render.listen(this.canvas.nativeElement, "touchmove", (e) => {
      if (this.canTouch) {
        this.update(this.getPosition(e));
      }
    });
    const self = this;
    this.render.listen(this.canvas.nativeElement, "touchend", () => {
      if (this.canTouch) {
        this.canTouch = false;
        this.dealPassword(this.selectedPointArray);
        setTimeout(function () {
          self.reset();
        }, this.transitionTime);
      }
    });
  }

  //绘制滑动屏幕后的点
  private drawAll(color, nowPoint = null) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawLine(this.selectedPointArray, color, nowPoint);
    this.drawCircles(this.allPointArray);
    this.drawCircles(this.selectedPointArray, color);
    this.drawPoints(this.selectedPointArray, color);
  }

  //滑动点的时候处理是否划中点
  private dealPoint(pointArry: Point[], nowPoint: Point, canTouch = false) {
    for (let i = 0; i < pointArry.length; i++) {
      if (Math.abs(Number(nowPoint.x) - Number(pointArry[i].x)) < this.radius && Math.abs(Number(nowPoint.y) - Number(pointArry[i].y)) < this.radius) {
        if (canTouch) {
          this.canTouch = true;
        }
        this.drawPoint(pointArry[i]);
        this.selectedPointArray.push(pointArry[i]);
        this.unSelectedPointArray.splice(i, 1);
        break;
      }
    }
  }

  private drawPoints(pointArray: Point[], style = this.selectedColor) {
    for (const value of pointArray) {
      this.drawPoint(value, style);
    }
  }

  private drawCircles(pointArray: Point[], style = this.unSelectedColor) {
    for (const value of pointArray) {
      this.drawCircle(value, style);
    }
  }

  //画圈
  private drawCircle(point: Point, style = this.unSelectedColor) {
    this.ctx.strokeStyle = style; 
    this.ctx.lineWidth = this.circularLineWidth;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.radius, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  //画点
  private drawPoint(point: Point, style = this.selectedColor) {
    this.ctx.fillStyle = style;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.radius / 1.35, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.fillStyle = this.centerColor;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.radius / 3.2, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fill();
  }

  //划线
  private drawLine(pointArray: Point[], style, nowPoint: Point = null) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = style;
    this.ctx.lineWidth = this.lineWidth;
 
    this.ctx.moveTo(pointArray[0].x, pointArray[0].y);
    for (let i = 1; i < pointArray.length; i++) {
      this.ctx.lineTo(pointArray[i].x, pointArray[i].y);
    }
    if (nowPoint) {
      this.ctx.lineTo(nowPoint.x, nowPoint.y);
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }
  
  
  @GestureLockPage.willLeave
  dissView() {
  
  }

  setPage(page) {
    setTimeout(() => {
      this.myapp.openPage(page, undefined, null);
    }, 500);
  }

  forgetGestureLock() {
    this.deletPasswordFun();
    this.setPage(LoginPage);
  }
}


