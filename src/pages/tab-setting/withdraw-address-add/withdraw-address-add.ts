import { Component, Optional } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
import { TabsPage } from '../../tabs/tabs';

/**
 * Generated class for the WithdrawAddressAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name: "page-withdraw-address-add"})
@Component({
  selector: 'page-withdraw-address-add',
  templateUrl: 'withdraw-address-add.html',
})
export class WithdrawAddressAddPage extends SecondLevelPage {
  private withdrawAddressAddType:string = "create";
  private isChangeBackground: boolean;
  private product;
  private pageStatus: string = "first";

  private createAddressNumber: number = undefined;

  private createPage = {
    addressCount: 0,
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    @Optional() public tabs: TabsPage,
  ) {
    super(navCtrl, navParams,true, tabs);
  }
  @WithdrawAddressAddPage.willEnter
  init() {
    const _withdrawType = this.navParams.data.type;
    this.product = this.navParams.data.product;
    this.withdrawAddressAddType = _withdrawType;
    this.isChangeBackground = _withdrawType == "create"? true : false;
  }
 

  handlerNextOrAdd() {
    this.pageStatus = "second";
    if(this.isChangeBackground) {
      this.isChangeBackground = false;
    }
  }

  handlerAddressNumberInput(type: string) {
    let _number;
    if(type === "+") {
      _number = this.createAddressNumber || 0;
      _number++;
      this.createAddressNumber = _number;
    } else {
      _number = this.createAddressNumber || 0;
      _number--;
      this.createAddressNumber = _number < 0 ? 0 : _number;
    }
  }
}
