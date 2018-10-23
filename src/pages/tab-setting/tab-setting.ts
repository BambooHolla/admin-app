import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirstLevelPage } from '../../app-framework/FirstLevelPage';

/**
 * Generated class for the TabSettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-tab-setting',
  templateUrl: 'tab-setting.html',
})
export class TabSettingPage extends FirstLevelPage {
  private setting_list = [
    {
      name: "充值地址本",
      icon: "picasso-asset",
      path: "page-recharge-address-list",
    },{
      name: "提现地址本",
      icon: "picasso-withdraw",
      path: "page-withdraw-address-list",
    },{
      name: "矿工费地址",
      icon: "picasso-miner",
      path: "page-fee-address-list",
    },{
      name: "地址低额提醒",
      icon: "picasso-remind",
      path: "page-remind-product-list",
    }
  ];
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
    ) {
      super(navCtrl, navParams);
  }


}
