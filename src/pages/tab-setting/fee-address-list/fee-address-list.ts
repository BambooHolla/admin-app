import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
/**
 * Generated class for the FeeAddressListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name:"page-fee-address-list"})
@Component({
  selector: 'page-fee-address-list',
  templateUrl: 'fee-address-list.html',
})
export class FeeAddressListPage extends SecondLevelPage {
  public feeAddress = [
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
    super(navCtrl, navParams);
  }

 
  
  handlerAddAddress(type:string) {
   
    this.actionSheetCtrl.create({
      cssClass: "add-address",
      buttons: [{
        text: 'USDT',
        handler: () => {
          this.routeTo('page-fee-address-add',{auto_return:true,product:"USDT",type});
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
