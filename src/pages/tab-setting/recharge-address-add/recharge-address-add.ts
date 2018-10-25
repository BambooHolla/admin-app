import { Component, Optional, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
import { TabsPage } from '../../tabs/tabs';
import { ProductModel } from '../../../providers/product-service/product-service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { RechargeAddressAddPageModule } from './recharge-address-add.module';
import { AddressServiceProvider } from '../../../providers/address-service/address-service';
import { asyncCtrlGenerator } from '../../../app-framework/Decorator';
/**
 * Generated class for the RechargeAddressAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name: "page-recharge-address-add"})
@Component({
  selector: 'page-recharge-address-add',
  templateUrl: 'recharge-address-add.html',
})
export class RechargeAddressAddPage extends SecondLevelPage {
  private product: ProductModel;
  public formData: {
    addressName: string;
    address: string;
  } = {
    addressName: "",
    address: "",
  };
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public elementRef: ElementRef,
    @Optional() public tabs: TabsPage,
    public addressService: AddressServiceProvider,
  ) {
    super(navCtrl, navParams,true, tabs);
    this.init();
  }

  private observable$: Subscription;
  private observable = new BehaviorSubject<{type: string, value: string}>(undefined);

  init() {
    const data = this.navParams.data;
    this.product = data.product;
    this.event.on("job-finished", async ({ id, data }) => {
      console.log("job-finished", id, data);
      if(id === "page-address-scan" && data) {
        this.formData.address = data;
        this.checkAddressContent({type: "address", value: data});
      }
    }); 

    this.observable$ = this.observable
    .debounceTime(250)
    .subscribe(data => {
        if(data) {
          this.checkAddressContent(data);
        }
    });
    
  }

  checkAddressContent(addressInfo: {type: string, value: string}) {
    const { productHouseId } = this.product;
    const {type, value} = addressInfo;
    let checkPromise: any;
    if(type === "name") {
      checkPromise = this.addressService.checkAddressName(productHouseId, value);
    } else if(type === "address") {
      checkPromise = this.addressService.checkAddress(productHouseId, value);
    }
    return checkPromise.then(status => {
      delete this.errors[type]
    }).catch(error => {
      this.errors[type] = error.MESSAGE || error;
    })
  }

  changeInputEvent(type: string, value:string) {
    if(type === "name") {
      value = value.trim();
    } else {
      value = value.replace(/\s/g,"");
    }
    if(value) this.observable.next({type, value});
  }

  @asyncCtrlGenerator.loading()
  @asyncCtrlGenerator.success("新增地址成功")
  @asyncCtrlGenerator.error("新增地址失败")
  finishAddAddress() {
    const { productHouseId } = this.product;
    const { addressName, address } = this.formData;
    return this.addressService.saveRechargeAddress(
      productHouseId,
      addressName,
      address
    ).then(v => {
      this.jobRes({
        ...this.formData,
        productHouseId: this.product.productHouseId,
      });
      this.finishJob();
    })
  }

  @RechargeAddressAddPage.onDestory
  pageDestory() {
    this.observable$.unsubscribe();
  }

}
