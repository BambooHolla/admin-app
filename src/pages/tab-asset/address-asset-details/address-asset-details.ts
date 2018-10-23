import { Component, Optional } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
import { TabsPage } from '../../tabs/tabs';
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
  private address;
  private productName: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    @Optional() public tabs: TabsPage,
  ) {
    super(navCtrl, navParams,true, tabs);
  }

  @AddressAssetDetailsPage.willEnter
  init() {

    this.address = this.navParams.data.address;
    this.productName = this.navParams.data.productName;
  }

 

}
