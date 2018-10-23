import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';

/**
 * Generated class for the WithdrawAddressListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name: "page-withdraw-address-list"})
@Component({
  selector: 'page-withdraw-address-list',
  templateUrl: 'withdraw-address-list.html',
})
export class WithdrawAddressListPage extends SecondLevelPage {
  public productList = ["BTC","ETH","IBT","USDT"];
  public selectProduct = "BTC";
  public selectIndex = 0;
  public selectAddress = [
    {

      address: "3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",
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

  handlerAddAddress(type:string) {
   
    this.actionSheetCtrl.create({
      cssClass: "add-address",
      buttons: [{
        text: 'IBT',
        handler: () => {
          this.routeTo('page-withdraw-address-add',{auto_return:true,product:"IBT",type});
        }
      }, {
        text: 'USDT',
        handler: () => {
          this.routeTo('page-withdraw-address-add',{auto_return:true,product:"USDT",type});
        }
      }, {
        text: 'ETH',
        handler: () => {
          this.routeTo('page-withdraw-address-add',{auto_return:true,product:"ETH",type});
        }
      }, {
        text: 'BTC',
        handler: () => {
          this.routeTo('page-withdraw-address-add',{auto_return:true,product:"BTC",type});
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


}