import { Component, Optional } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
import { TabsPage } from '../../tabs/tabs';
import { asyncCtrlGenerator } from '../../../app-framework/Decorator';
import { AddressServiceProvider, AddressUse, AddressModel } from '../../../providers/address-service/address-service';
import { ProductModel } from '../../../providers/product-service/product-service';
import { Subscription, BehaviorSubject } from 'rxjs';

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
  // 页面显示状态
  private pageType:string = "create";
  private isChangeBackground: boolean;
  private product: ProductModel;
  private pageStatus: string = "first";
  

 
  // 导入情况下
  private imperInputValue:string;
  private imperAddress: AddressModel = {
    addressName: '',
    rechargeWithdrawAddress: '',
  };
  private importErrors = {};

  // 创建情况下
  private addressList: AddressModel[] = [];
  private addressErrorList: {address: string, name: string}[];
  // private addressErrorIndex: number[] = [];
  private createAddressNumber: number | string = 1;
  private validAddressNumber: number = 0;


  private observable$: Subscription;
  private observable = new BehaviorSubject<{type: string, addressInfo: AddressModel, index: number, withdrawType: string}>(undefined);

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    @Optional() public tabs: TabsPage,
    public addressService: AddressServiceProvider,
  ) {
    super(navCtrl, navParams,true, tabs);
    this.init();
  }
  
  init() {
    const _pageType = this.navParams.data.type;
    this.product = this.navParams.data.product;
    this.pageType = _pageType;
    this.isChangeBackground = _pageType == "create"? true : false;


    this.observable$ = this.observable
    .debounceTime(250)
    .subscribe(data => {
        if(data) {
          this.checkAddressContent(data);
        }
    });
  }
 
 
  handlerNextOrAdd() {
    if(this.pageType === "create") {
      if(this.pageStatus === "first" && this.createAddressNumber > 0) {
        this.createAddressList()
      } else if(this.pageStatus === "second" && this.canSubmit) {
        this.tipAddAddressLsit();
      }
    } else if(this.pageType === "import") {
      if(this.pageStatus === "first" && this.imperInputValue) {
        this.importAddressKey()
      } else if(this.pageStatus === "second" && this.canSubmit) {
        this.addAddressList("import");
      }
    }
     
  }

  @asyncCtrlGenerator.loading()
  @asyncCtrlGenerator.error("生成地址失败")
  createAddressList() {
    return this.addressService.createWFAddressList(
      this.product.productHouseId,
      AddressUse.Withdraw,
      +this.createAddressNumber
    ).then(addressList => {
        const _arr = [];
        for(let i = 0; i < addressList.length; i++) {
          _arr.push({});
          this.checkAddressContent({
            type: "name",
            addressInfo: addressList[i],
            index: i,
            withdrawType: "create"
          })
        }
        this.addressErrorList = [].concat(_arr);
        this.addressList = addressList;
        this.isChangeBackground = false;
        this.pageStatus = "second";
    });
  }

  @asyncCtrlGenerator.loading()
  @asyncCtrlGenerator.error("导入地址失败")
  importAddressKey() {
    return this.addressService.importAddressKey(
      this.product.productHouseId,
      this.imperInputValue,
    ).then(address => {
      this.pageStatus = "second";
      this.imperAddress = Object.assign(this.imperAddress, address[0]);
          this.checkAddressContent({
          type: "name",
          addressInfo: this.imperAddress,
          index: undefined,
          withdrawType: "import"
      });
    });
  }


  tipAddAddressLsit() {
    this.alertCtrl.create({
      title: "警告",
      subTitle: `校验通过${this.validAddressNumber}个地址`,
      message: "是否新增这些地址",
      buttons: [
        {
          text: "取消",
        },
        {
          text: "确定",
          handler: () => {
            this.addAddressList("create");
          }
        }
      ]
    }).present();
  }

  @asyncCtrlGenerator.loading()
  @asyncCtrlGenerator.success("新增地址成功")
  @asyncCtrlGenerator.error("新增地址失败")
  addAddressList(withdrawType: string) {
    let _addressList: AddressModel[] = [].concat(
      withdrawType === "create" ? this.addressList : this.imperAddress
    );
    let _saveArr: AddressModel[] = [];
    if(withdrawType === "create") {
      const _indexSet = new Set();
      this.addressErrorList.forEach((item, index) => {
        for(let k in item) {
          _indexSet.add(index);
          break;
        }
      });
      _addressList.forEach( (address,index) => {
        if(!_indexSet.has(index)) {
          _saveArr.push(address);
        }
      })
    } else {
      _saveArr = _addressList;
    }


    return this.addressService.saveBatchAddressList(_saveArr).then(data => {
      if(data.length) this.finishPage()
    })
  }

  /**
   * 由于地址名称校验通过请求，只能判断数据库是否已经存在
   * 这种只适合一个的情况下
   * 批量地址在确定数据库不存在的情况下，还需要本地校验各个输入框的名称是否重复
   * @param addressInfo 当前输入框对应的addressObj
   * @param index 当前输入框索引
   */
  checkRepeatAddress(addressInfo: AddressModel, index: number) {
    let _has_repeat: boolean = false;
    // 遍历地址列表
    // 如果有一致的，需要添加错误信息
    // 最后如果有发现重复，也需要对自身添加错误信息
    debugger
    this.addressList.forEach( (address, i) => {
      if(!this.addressErrorList[i]["name"] || this.addressErrorList[i]["name"] === "地址名称重复，请修改") {
        // 前提：已经过请求校验，addressName不存在，或者存在 “重复”的错误信息
        if(address.addressName == addressInfo.addressName && index != i) {
          // 满足addressName重复或者存在 “重复”的错误信息, 不是自身
          this.addressErrorList[i]["name"] =  "地址名称重复，请修改";
          if(!_has_repeat) _has_repeat = true;
        } else if(index != i) {
          // 不重复，需要再次遍历
          // 删除的情况需要在判断该需要删除的，排除当前的输入框，剩下的是否还存在重复
          let _again_find_repeat: any;
          const _again_find = this.addressList.find((again_address,again_i) => {
            if(
                this.addressErrorList[i]["name"] === this.addressErrorList[again_i]["name"]
                && i != again_i && index != again_i
            ) {
                // 重新遍历发现还是存在重复（自己，跟当前除外）
              return true;
            }
            return false;
          });
          if(!_again_find) delete this.addressErrorList[i]["name"];
        }
      }
      
    });
    
    // 是否发现跟自身重复，有的话当前输入框也要标识
    if(_has_repeat) {
      this.addressErrorList[index]["name"] = _has_repeat ? "地址名称重复，请修改" : '';
    } else {
      delete this.addressErrorList[index]["name"] 
    }
  }

  /**
   * 批量生成,只有校验失败的数量跟生成数量相等.才无法提交
   */
  get canSubmit() {
    if(this.pageType === "create") {
      let _errorNumer = 0;
      this.addressErrorList.forEach(error => {
        for(let k in error) {
          _errorNumer++;
          break;
        }
      });
      this.validAddressNumber = +this.createAddressNumber - _errorNumer;
      if(_errorNumer >= this.createAddressNumber) return false;
      
      return true;
    } else if(this.pageType === "import") {
      for (var k in this.importErrors) {
        return false;
      }
      return true;
    }
    return false;
  }

  changeInputEvent(type: string, addressInfo: AddressModel, index: number) {
    const withdrawType = this.pageType;
    if(type === "name") {
      addressInfo.addressName = addressInfo.addressName.trim();
    } else {
      addressInfo.rechargeWithdrawAddress = addressInfo.rechargeWithdrawAddress.replace(/\s/g,"");
    }
    if(!addressInfo.addressName) {
        return index == undefined ? this.importErrors["name"] = "请输入地址名称"
        : this.addressErrorList[index]["name"] = "请输入地址名称"; 
    }    
    if(addressInfo && addressInfo.addressName) return this.observable.next({type, addressInfo, index, withdrawType});
  }

  checkAddressContent(data: {type: string, addressInfo: AddressModel, index: number, withdrawType: string}) {
    const { productHouseId } = this.product;
    const {type, addressInfo, index, withdrawType} = data;
    let checkPromise: any;
    if(type === "name") {
      checkPromise = this.addressService.checkAddressName(productHouseId, addressInfo.addressName);
    } else if(type === "address") {
      checkPromise = this.addressService.checkAddress(productHouseId, addressInfo.rechargeWithdrawAddress);
    }
    return checkPromise.then(status => {
        if(!addressInfo.addressName) {
            return index == undefined ? this.importErrors["name"] = "请输入地址名称"
            : this.addressErrorList[index]["name"] = "请输入地址名称"; 
        }    
        if(withdrawType === "create") {
            delete this.addressErrorList[index][type]
            this.checkRepeatAddress(addressInfo, index);
        } else if(withdrawType === "import") {
            delete this.importErrors[type];
        }

    }).catch(error => {
        if(!addressInfo.addressName) {
            return index == undefined ? this.importErrors["name"] = "请输入地址名称"
            : this.addressErrorList[index]["name"] = "请输入地址名称"; 
        }    
        if(withdrawType === "create") {
            this.addressErrorList[index][type] =  error.MESSAGE || error;
        } else if(withdrawType === "import") {
            this.importErrors[type] = error.MESSAGE || error;
        }
    })
  }

  handlerAddressNumberInput(type: string) {
    let _number;
    if(type === "+") {
      _number = this.createAddressNumber || 1;
      _number++;
      this.createAddressNumber = _number;
    } else {
      _number = this.createAddressNumber || 1;
      _number--;
      this.createAddressNumber = _number < 1 ? 1 : _number;
    }
  }

  
  finishPage() {
    this.jobRes({productHouseId: this.product.productHouseId,});
    this.finishJob();
  }

  @WithdrawAddressAddPage.onDestory
  pageDestory() {
    this.observable$.unsubscribe();
  }

}
