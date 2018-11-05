import { Component, Optional } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
import { TabsPage } from '../../tabs/tabs';
import { ProductModel } from '../../../providers/product-service/product-service';
import { AddressModel, AddressServiceProvider } from '../../../providers/address-service/address-service';
import { asyncCtrlGenerator } from '../../../app-framework/Decorator';
/**
 * Generated class for the AddressAssetDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name:"page-address-asset-details"})
@Component({
  selector: 'page-address-asset-details',
  templateUrl: 'address-asset-details.html',
})
export class AddressAssetDetailsPage extends SecondLevelPage {
  private address: AddressModel;
  private product: ProductModel;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    @Optional() public tabs: TabsPage,
    public addressService: AddressServiceProvider,
  ) {
    super(navCtrl, navParams,true, tabs);
    this.init() 
    
  }


  @asyncCtrlGenerator.loading()
  @asyncCtrlGenerator.error("获取数据失败")
  init() {
    debugger
    this.address = this.navParams.data.address;
    this.product = this.navParams.data.product;
    return this.addressService.getAddressAssetDetails(this.product.productHouseId, this.address.transType, this.address.txid)
  }

 

}
