import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
import { WithdrawAddressAddPage } from '../withdraw-address-add/withdraw-address-add';
import { asyncCtrlGenerator } from '../../../app-framework/Decorator';
import { AddressServiceProvider, AddressUse, AddressModel } from '../../../providers/address-service/address-service';
import { ProductModel } from '../../../providers/product-service/product-service';

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
  public productList: ProductModel[];
  public selectProduct: ProductModel;
  public selectIndex = 0;
  public selectAddressList: any[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public addressService: AddressServiceProvider,
  ) {
    super(navCtrl,navParams);
    this.init();
    this.event.on("job-finished", async ({ id, data }) => {
      console.log("job-finished", id, data);
      if(id === "page-withdraw-address-add" && data) {
        const { productHouseId } = data;
        if(this.selectProduct.productHouseId === productHouseId) {
          this.getAddressList(this.selectProduct);
        }
      }
    });
  }

  
  async init() {
    this.productList = await this.productService.productList.getPromise();
    if(this.productList && this.productList.length) {
        this.getAddressList(this.productList[0]);
    }
  }

  
  @asyncCtrlGenerator.loading()
  @asyncCtrlGenerator.error("获取地址列表失败")
  getAddressList(product) {
    return this.addressService.getAddressList(product.productHouseId,AddressUse.Withdraw).then(addressList => {
      this.selectAddressList = addressList;
      this.selectProduct = product;
    })
  }

  async handlerSelectProduct(product,index) {
    if(this.selectIndex === index) return ;
    this.selectIndex = index;
    this.selectAddressList = [];
    this.getAddressList(product);
  }

  askAddAddressType(type:string) {
   
    const buttons = [];
    this.productList.forEach(product => {
      buttons.push({
        text: product.productName,
        handler: () => {
          this.routeTo('page-withdraw-address-add',{auto_return:true,product,type});
        }
      });
    });
    buttons.push({
      text: '取消',
      role: 'cancel',
    });

    this.actionSheetCtrl.create({
      cssClass: "add-address",
      buttons
    }).present();

   
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
      }
      return status;
    })
  }


}