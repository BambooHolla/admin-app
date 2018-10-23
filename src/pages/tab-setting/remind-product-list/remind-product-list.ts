import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
/**
 * Generated class for the RemindAddressListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name:"page-remind-product-list"})
@Component({
  selector: 'page-remind-product-list',
  templateUrl: 'remind-product-list.html',
})
export class RemindProductListPage extends SecondLevelPage {
  private modifyInput;
  private pageStatus: string = "first";
  private amountInput = undefined;
  private selectProduct;
  private remindList = [
    {
      productName: "IBT",
      amount: 0.564,
    },{
      productName: "BTC",
      amount: 0.65,
    },{
      amount: 0.65,
      productName: "ETH",
    },{
      productName: "USDT",
      amount: 0.2,
    }
  ];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public elementRef: ElementRef,
  ) {
    super(navCtrl, navParams);
    
  }

  handlerCheckPageStatus(pageStatus: string, product?) {
    console.log(product)
    this.pageStatus = pageStatus || "first";
    if(product) {
      this.selectProduct = product;
      this.amountInput = product.amount;
    }
  }
  handlerModifyRemindAmount() {
    this.selectProduct.amount = this.amountInput;
    this.handlerCheckPageStatus('first');
  }

}
