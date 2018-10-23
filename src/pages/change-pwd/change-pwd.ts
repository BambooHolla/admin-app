import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../app-framework/SecondLevelPage';
/**
 * Generated class for the ChangePwdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name: "page-change-pwd"})
@Component({
  selector: 'page-change-pwd',
  templateUrl: 'change-pwd.html',
})
export class ChangePwdPage extends SecondLevelPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
  ) {
    super(navCtrl, navParams);
  }


}
