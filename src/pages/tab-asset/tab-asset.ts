import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirstLevelPage } from '../../app-framework/FirstLevelPage';
import { StatusBar } from '@ionic-native/status-bar';
import { asyncCtrlGenerator } from '../../app-framework/Decorator';
import { AppPageServiceProvider } from '../../providers/app-page-service/app-page-service';
import { ProductModel } from '../../providers/product-service/product-service';


/**
 * Generated class for the TabAssetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-tab-asset',
  templateUrl: 'tab-asset.html',
})
export class TabAssetPage extends FirstLevelPage {
  private selectTypeIndex: number = 0;
  private headerProduct: string = "IBT";
  private selectAddress: any[] = [
    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},
    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},
    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},

    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},
    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},

    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},
    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},

    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},
    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},
    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},
    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},
    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},
    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},
    {title:"充值划转地址", total:'1321321.1321321',address:"3NEtefBUCiTxyJwUbRQnrGXXy9BxkH4GRy"},

  ];
  private allAddress: any = {
    "IBT": [
      {id:1,name:"ibt"},
      {id:2,name:"ibt"},
      {id:3,name:"ibt"},
      {id:4,name:"ibt"},
      {id:5,name:"ibt"},
      {id:6,name:"ibt"},
      {id:7,name:"ibt"},
      {id:8,name:"ibt"},
      {id:9,name:"ibt"},
      {id:10,name:"ibt"},
      {id:11,name:"ibt"},
    ],
    "USDT": [
      {id:1,name:"USDT"},
      {id:2,name:"USDT"},
      {id:3,name:"USDT"},
    ],
    "ETH": [
      {id:11,name:"ETH"},
      {id:12,name:"ETH"},
      {id:13,name:"ETH"},
      {id:14,name:"ETH"},
      {id:15,name:"ETH"},
      {id:16,name:"ETH"},
    ],
    "BTC": [
      {id:1,name:"BTC"},
      {id:2,name:"BTC"},
      {id:3,name:"BTC"},
      {id:4,name:"BTC"},
      {id:5,name:"BTC"},
      {id:6,name:"BTC"},
      {id:7,name:"BTC"},
    ]
  }
  private typeArr = [
    {name:"充值资产",value:13245678912.123456546,action:true},
    {name:"提现资产",value:1232134456.546,action:false},
    {name:"矿工费资产",value:2777774645456.546,action:false},
  ]
  selectType = this.typeArr[0];
  checkType(item,i) {
    this.selectTypeIndex = i;
    this.selectType = item;
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public statusBar: StatusBar, 
    public appPageService: AppPageServiceProvider,
  ) {
      super(navCtrl, navParams);
      
    this.appSetting = undefined;
  }
  async ngOnInit() {
 

  }

  productList: ProductModel[] = [];

  @TabAssetPage.willEnter
  @asyncCtrlGenerator.loading()
  async pageWillEnter() {
    this.statusBar.styleLightContent();
    this.menuCtrl.enable(true, "myMenu");
    
    this.appPageService.on("menu@page", async path => {
      this.routeTo(path);
    }) 
    this.productList = await this.productService.productList.getPromise();
  }
  
  @TabAssetPage.onDestory
  @TabAssetPage.willLeave
  async pageWillLeave() {
    this.menuCtrl.isOpen("myMenu") && await this.menuCtrl.close("myMenu");
    this.statusBar.styleDefault();
    this.menuCtrl.enable(false, "myMenu");
    this.appPageService.off("menu@page");
  }
  
  
  async handlerSelectProduct() {
    const _opts = {
      cssClass: "select-product",
      buttons: [],
    };
    this.productList.forEach(product => {
      _opts.buttons.push({
        text: product.productName,
        role: this.headerProduct === product.productName ? "destructive" : "",
        handler: () => {
          this.headerProduct = product.productName;
          this.getAddress(this.headerProduct);
        }
      })
    });
    _opts.buttons.push({
      text: '取消',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
    });
    debugger
    this.actionSheetCtrl.create(_opts).present();

  }

  getAddress(product: string) {
    // this.selectAddress = this.allAddress[product];
    if(product == "IBT") {
      this.typeArr = [
        {name:"充值资产",value:13245678912.123456546,action:true},
        {name:"提现资产",value:1232134456.546,action:false},
        {name:"矿工费资产",value:2777774645456.546,action:false},
      ] 
    } else {
      this.typeArr = [
        {name:"充值资产",value:22212.555,action:true},
        {name:"提现资产",value:456.6,action:false},
      ] 
    }
    this.selectTypeIndex = 0;
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

