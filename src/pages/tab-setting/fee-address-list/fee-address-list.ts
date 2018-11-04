import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
import { FeeAddressAddPage } from '../fee-address-add/fee-address-add';
import { asyncCtrlGenerator } from '../../../app-framework/Decorator';
import { AddressUse, AddressServiceProvider, AddressModel } from '../../../providers/address-service/address-service';
import { ProductModel } from '../../../providers/product-service/product-service';
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
  private productBTC: ProductModel;
  public feeAddressList: any[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public addressService: AddressServiceProvider,
  ) {
    super(navCtrl, navParams);
    this.init();
    this.event.on("job-finished", async ({ id, data }) => {
      console.log("job-finished", id, data);
      if(id === "page-fee-address-add" && data) {
        const { productHouseId } = data;
          this.getAddressList();
      }
      this.triggerPageEvent();
    });
  }

  
  async init() {
    const _productList = await this.productService.productList.getPromise();
    this.productBTC = _productList.find(product => product.productName.toLocaleLowerCase() === "btc");
    if(this.productBTC) {
      this.getAddressList();
    }
    
  }
  

  @asyncCtrlGenerator.loading()
  @asyncCtrlGenerator.error("获取地址列表失败")
  getAddressList() {
    return this.addressService.getAddressList(this.productBTC.productHouseId,AddressUse.Miner).then(addressList => {
      this.feeAddressList = addressList;
    })
  }

  askAddressEnabled(address: AddressModel) {
    const _message = address.addressClass == "0" ? "是否禁用该地址" : "是否启用该地址";
    const _tipType = _message === "是否禁用该地址" ? "showErrorDialog" : "showSuccessDialog";
    this[_tipType] (
      _message,
      undefined,
      undefined,
      [
        {
          text: "取消",
          handler: () => {}
        },
        {
          text: "确认",
          handler: () => {
            this.handlerAddressEnabled(address);
          }
        },
      ]
    );
  }

  @asyncCtrlGenerator.loading()
  @asyncCtrlGenerator.success("改变地址状态成功")
  @asyncCtrlGenerator.error("改变地址状态失败")
  handlerAddressEnabled(address: AddressModel) {
    let {id , addressClass} = address;
    addressClass = addressClass == "0" ? "1" : "0";
    return this.addressService.editAddressById(id, addressClass).then( status => {
      if(status === "ok") {
        address.addressClass = addressClass;
        this.triggerPageEvent();
      }
      return status;
    })
  }
  
  handlerAddAddress(type:string) {
    this.actionSheetCtrl.create({
      cssClass: "add-address",
      buttons: [{
        text: this.productBTC.productName,
        handler: () => {
          this.routeTo('page-fee-address-add',{auto_return:true,product: this.productBTC,type});
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

  triggerPageEvent() {
    this.appPageService.tryEmit("tab-asset@refresh",{
        productHouseId: this.productBTC.productHouseId,
        type: AddressUse.Miner,
        id: this.cname,
    });
  }

}
