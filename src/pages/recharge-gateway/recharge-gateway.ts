import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../bnlc-framework/SecondLevelPage';
import { asyncCtrlGenerator } from '../../bnlc-framework/Decorator';
import {
	AccountServiceProvider,
	ProductType
} from '../../providers/account-service/account-service';

/**
 * Generated class for the RechargeGatewayPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
	selector: 'page-recharge-gateway',
	templateUrl: 'recharge-gateway.html'
})
export class RechargeGatewayPage extends SecondLevelPage {
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public accountService: AccountServiceProvider
	) {
		super(navCtrl, navParams);
	}
	product_list: any[];

	@RechargeGatewayPage.willEnter
	@asyncCtrlGenerator.error('产品列表加载出错')
	async getProducts() {
		this.product_list = await this.accountService.getProducts(0, 30);
	}
}