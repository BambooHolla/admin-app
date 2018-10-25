import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../app-framework/SecondLevelPage';
import { File, Entry } from '@ionic-native/file';
/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name: "page-account"})
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage extends SecondLevelPage {
  private readonly DIR_ROOT_PATH: string = this.file.externalRootDirectory;
  private readonly DIR_NAME: string = "Picasso";
  private readonly FILE_PATH: string = this.DIR_ROOT_PATH + `/${this.DIR_NAME}`;
  private readonly FILE_NAME: string = "picassoAddressKey.txt";
  value: string = '1';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public file: File,
  ) {
    super(navCtrl,navParams);
    this.event.on("job-finished", async ({ id, data }) => {
      console.log("job-finished", id, data);
      if(id === "page-address-scan" && data) {
        this.value = data;
      }
    });
  }

  /**
   * 将内存保存在手机文件夹内
   */
  async handlerFile() {
    try {
      // 判断是否存在文件夹
      // 由于找不到返回的错误信息会被try捕获，所以对错误进行改写
      let _is_key_dir = await this.file.checkDir(this.DIR_ROOT_PATH, this.DIR_NAME).catch(err => false);
      if(!_is_key_dir) await this.file.createDir(this.DIR_ROOT_PATH, this.DIR_NAME, true);
      // 文件夹存在，读取对应文件内容，如果读取不到，创建该文件
      let _file_content =  await this.file.readAsText(this.FILE_PATH, this.FILE_NAME).catch(err => false);
      if(_file_content === false) {
        await this.file.createFile(this.FILE_PATH, this.FILE_NAME, true);
        _file_content = '';
      }
      // 写文件，会覆盖原来文件内容
      this.file.writeExistingFile(this.FILE_PATH, this.FILE_NAME, _file_content + this.value)
    } catch(err) {
      console.log(err);
    }
   
  }
 
  logfileC() {
    this.file.readAsText(this.FILE_PATH, this.FILE_NAME).then(a=> console.log(a)).catch(a=>console.log(a))
  }

}
