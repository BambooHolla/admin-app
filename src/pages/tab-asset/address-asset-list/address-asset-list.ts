import { Component, Optional } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
import { asyncCtrlGenerator } from '../../../app-framework/Decorator';
/**
 * Generated class for the AddressAssetListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name:"page-address-asset-list"})
@Component({
  selector: 'page-address-asset-list',
  templateUrl: 'address-asset-list.html',
})
export class AddressAssetListPage extends SecondLevelPage {
  private productName: string;
  private product;
  private typeArr = ["全部","转入","转出","失败"];
  private selectTypeIndex: number = 0;
  private selectAddress: any[] = [
    {assets:"136.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:1,date:"2018-10-08 12:00:01"},
    {assets:"134534536.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:1,date:"2018-10-08 12:00:01"},
    {assets:"136.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:2,date:"2018-10-08 12:00:01"},

    {assets:"16.548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:3,date:"2018-10-08 12:00:01"},
    {assets:"1436.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:2,date:"2018-10-08 12:00:01"},

    {assets:"136.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:1,date:"2018-10-08 12:00:01"},
    {assets:"136.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:3,date:"2018-10-08 12:00:01"},

    {assets:"136.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:1,date:"2018-10-08 12:00:01"},
    {assets:"136.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:1,date:"2018-10-08 12:00:01"},
    {assets:"136.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:1,date:"2018-10-08 12:00:01"},
    {assets:"136.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:1,date:"2018-10-08 12:00:01"},
    {assets:"136.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:1,date:"2018-10-08 12:00:01"},
    {assets:"136.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:1,date:"2018-10-08 12:00:01"},
    {assets:"136.546548", fee:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy",status:1,date:"2018-10-08 12:00:01"},

  ];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
  ) {
    super(navCtrl, navParams);
  }

  @AddressAssetListPage.willEnter
  init() {
    this.product = this.navParams.data.product
    this.productName = this.navParams.data.productName
  }

  checkType(item,i) {
    this.selectTypeIndex = i;
  }
  
  @asyncCtrlGenerator.success("地址已经成功复制到剪切板")
  @asyncCtrlGenerator.error("地址复制失败")
  copyAddress(address: string) {
    if(!navigator["clipboard"]) {
      return Promise.reject( "复制插件异常");
    }
    return navigator["clipboard"].writeText(address);
  }
}
