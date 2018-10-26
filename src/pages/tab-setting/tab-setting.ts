import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirstLevelPage } from '../../app-framework/FirstLevelPage';
import { asyncCtrlGenerator } from '../../app-framework/Decorator';
import { AddressServiceProvider } from '../../providers/address-service/address-service';
import { File } from '@ionic-native/file';

/**
 * Generated class for the TabSettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-tab-setting',
  templateUrl: 'tab-setting.html',
})
export class TabSettingPage extends FirstLevelPage {

  private readonly DIR_ROOT_PATH: string = this.file.externalRootDirectory;
  private readonly DIR_NAME: string = "Picasso";
  private readonly FILE_PATH: string = this.DIR_ROOT_PATH + `/${this.DIR_NAME}`;
  private readonly FILE_NAME: string = "picassoAddressKey.txt";


  private setting_list = [
    {
      name: "充值地址本",
      icon: "picasso-asset",
      path: "page-recharge-address-list",
    },{
      name: "提现地址本",
      icon: "picasso-withdraw",
      path: "page-withdraw-address-list",
    },{
      name: "矿工费地址",
      icon: "picasso-miner",
      path: "page-fee-address-list",
    },{
      name: "地址低额提醒",
      icon: "picasso-remind",
      path: "page-remind-product-list",
    }
  ];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public addressService: AddressServiceProvider,
    public file: File,
    ) {
      super(navCtrl, navParams);
  }

  askInitKey() {
    this.alertCtrl.create({
      title: "初始化",
      message: "是否初始化管理员密钥？",
      buttons: [
        {
          text: "取消",
        },
        {
          text: "确定",
          handler: () => {
            this._initKey();
          }
        }
      ]
    }).present();
  }
  


  @asyncCtrlGenerator.loading()
  @asyncCtrlGenerator.error("初始化失败")
  private _initKey() {
   return this.addressService.getInitKeyInfo().then(key => {
    this.saveKeyFile(key);
   })
  }

  /**
   * 将内存保存在手机文件夹内
   */
  @asyncCtrlGenerator.success(
    "密钥保存到本地文件夹\nPicasso/picassoAddressKey.txt",
    "bottom",
    5000
  )
  @asyncCtrlGenerator.error("本地保存密钥失败")
  async saveKeyFile(key: string) {
    this.file.readAsText(this.FILE_PATH, this.FILE_NAME).then(a=> console.log(a)).catch(a=>console.log(a))
    try {
      // 判断是否存在文件夹
      // 由于找不到返回的错误信息会被try捕获,导致无法进行创建操作，所以对错误catch进行捕获
      let _is_key_dir = await this.file.checkDir(this.DIR_ROOT_PATH, this.DIR_NAME).catch(err => false);
      if(!_is_key_dir) await this.file.createDir(this.DIR_ROOT_PATH, this.DIR_NAME, true);
      // 文件夹存在，读取对应文件内容，如果读取不到，创建该文件
      let _file_content =  await this.file.readAsText(this.FILE_PATH, this.FILE_NAME).catch(err => false);
      if(_file_content === false) {
        // 创建文件
        await this.file.createFile(this.FILE_PATH, this.FILE_NAME, true);
      }
      // 写文件，会覆盖原来文件内容
      this.file.writeExistingFile(this.FILE_PATH, this.FILE_NAME, JSON.stringify(key));
    } catch(err) {
      return Promise.reject(err.message || err)
    }
  }






}
