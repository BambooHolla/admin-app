import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
import { FeeAddressAddPage } from '../fee-address-add/fee-address-add';
import { asyncCtrlGenerator } from '../../../app-framework/Decorator';
import { AddressUse, AddressServiceProvider } from '../../../providers/address-service/address-service';
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
  private productIBT;
  public feeAddressList: any[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public addressService: AddressServiceProvider,
  ) {
    super(navCtrl, navParams);
    this.init();
  }

  
  async init() {
    const _productList = await this.productService.productList.getPromise();
    this.productIBT = _productList.find(product => product.productName.toLocaleLowerCase() === "ibt");
    if(this.productIBT) {
      this.getAddressList();
    }
    
  }
  

  @asyncCtrlGenerator.loading()
  @asyncCtrlGenerator.error("获取地址列表失败")
  getAddressList() {
    return this.addressService.getAddressList(this.productIBT.productHouseId,AddressUse.Miner).then(addressList => {
      this.feeAddressList = addressList;
    })
  }
  
  handlerAddAddress(type:string) {
   
    this.actionSheetCtrl.create({
      cssClass: "add-address",
      buttons: [{
        text: 'BTC',
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
