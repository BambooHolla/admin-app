import { Component, Optional } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
import { TabsPage } from '../../tabs/tabs';
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
  private product;
  private _formData: {
    name: string;
    address: string;
  } = {
    name: "",
    address: "",
  };
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    @Optional() public tabs: TabsPage,
  ) {
    super(navCtrl, navParams,true, tabs);
  }

  @RechargeAddressAddPage.willEnter
  init() {
    const data = this.navParams.data;
    this.product = data.product;
    this.event.on("job-finished", async ({ id, data }) => {
      console.log("job-finished", id, data);
      if(id === "page-address-scan" && data) {
        this._formData.address = data;
      }
    }); 
  }

  handlerFinishAddAddress() {
    this.jobRes(this._formData);
    this.finishJob();
  }

}
