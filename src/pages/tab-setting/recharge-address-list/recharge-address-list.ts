import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
/**
 * Generated class for the RechargeAddressListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name: "page-recharge-address-list"})
@Component({
  selector: 'page-recharge-address-list',
  templateUrl: 'recharge-address-list.html',
})
export class RechargeAddressListPage extends SecondLevelPage {
  public productList = ["BTC","ETH","IBT","USDT"];
  public selectProduct = "BTC";
  public selectIndex = 0;
  public selectAddress = [
    {
      enable: true,
      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    }, {
      enable: false,
      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    }, {

      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    }, {

      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    }, {

      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    }, {

      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    }, {

      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    }, {

      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    }, {

      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    }, {

      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    }, {

      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    }, {

      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    }, {

      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
    },
  ]
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    super(navCtrl,navParams);
    this.event.on("job-finished", async ({ id, data }) => {
      console.log("job-finished", id, data);
      if(id === "page-recharge-address-add" && data) {
        
      }
    });
  }

  

  handlerSelectProduct(product,index) {
    this.selectProduct = product;
    this.selectIndex = index;
  }

  handlerAddAddress() {
   
    this.actionSheetCtrl.create({
      cssClass: "add-address",
      buttons: [{
        text: 'IBT',
        handler: () => {
          this.routeTo('page-recharge-address-add',{auto_return:true,product:"IBT"});
        }
      }, {
        text: 'USDT',
        handler: () => {
          this.routeTo('page-recharge-address-add',{auto_return:true,product:"USDT"});
        }
      }, {
        text: 'ETH',
        handler: () => {
          this.routeTo('page-recharge-address-add',{auto_return:true,product:"ETH"});
        }
      }, {
        text: 'BTC',
        handler: () => {
          this.routeTo('page-recharge-address-add',{auto_return:true,product:"BTC"});
        }
      }, {
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    }).present();
  }

  handlerAddressEnabled() {
  
    this.showErrorDialog("是否禁用该地址",undefined,undefined,[
      {
        text: "确认",
        handler: () => {
          console.log("确认")
        }
      },{
        text: "取消",
        handler: () => {
          console.log("取消")
        }
      }
    ])
  }
}
