import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, TextInput, Content } from 'ionic-angular';
import { FirstLevelPage } from '../../app-framework/FirstLevelPage';
import * as CryptoJS from "crypto-js";
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { AppSettingProvider } from '../../providers/app-setting/app-setting';
import { Storage } from '@ionic/storage';
import { asyncCtrlGenerator } from '../../app-framework/Decorator';
import { UnsubscriptionError } from 'rxjs';

import { 
	TabsPage,
	GestureLockPage,
} from '../pages';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage extends FirstLevelPage {
	@ViewChild(Content) content: Content;
	private showPWD: boolean  = false;
	formData = {
		login_account: "",
		login_password: "",
		login_phone: "",
		login_code: "",
	};
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public loginService: LoginServiceProvider,
		public storage: Storage,
	) {
		super(navCtrl, navParams);
	}

	handlerShowPWD(ele: TextInput) {
		this.showPWD = !this.showPWD;
		if(this.showPWD) {
		ele.type = "text";
		ele.getElementRef().nativeElement.children[0].type = "text";
		} else {
		ele.type = "password";
		ele.getElementRef().nativeElement.children[0].type = "password";
		}
	}
  
	/**
	 * 发送验证码之前需要线校验手机号格式是否正确
	 */
	private isCheckoutPhone: boolean = true;
	private firstSendCode: boolean = true;
	private sendingCode: boolean = false;
	private sendTimeLock: number = 0;
	private sendTimeLockTi: any;
	private time: number = 60;
	checkoutFormat(value: string | number) {
		if(this.sendingCode) return;
		this.isCheckoutPhone = false;
	}
	handlerSendCode() {
		if(this.sendingCode) return;
		if(this.firstSendCode) this.firstSendCode = false;
		this.sendingCode = true;
		this.sendTimeLockTi && clearInterval(this.sendTimeLockTi);
		this.sendTimeLock = this.time;
		this.sendTimeLockTi = setInterval(() => {
			this.sendTimeLock -= 1;
			if (this.sendTimeLock < 0) {
				clearInterval(this.sendTimeLockTi);
				this.sendingCode = false;
			}
		}, 1000);
	}

	@asyncCtrlGenerator.loading()
	@asyncCtrlGenerator.error('登录失败')
	doSubmit() {
		window["content"] = this.content
		let { 
		login_account, 
		login_password 
		}: {login_account: string, login_password: string } = this.formData;
		let _longinStatus; 
		login_password = this.MD5(login_account + AppSettingProvider.SPECIAL_CHARACTER + login_password);

	return this.loginService.doLogin(login_account, login_password).then( async infoObj => {
		//  登录成功，检查是否已设置手势密码
		const _is_gesture_lock = await  this.storage.get("adminAppGestureLockObj")
		if(_is_gesture_lock) {
			return await this.myapp.openPage(TabsPage, undefined, null /*主页*/)
		} else {
			return await this.myapp.openPage(GestureLockPage, undefined, null /*手势密码*/);
		}
		
		})
		
	}
      
	MD5(text: string ) {
		return CryptoJS.MD5(text).toString();
	}
}
