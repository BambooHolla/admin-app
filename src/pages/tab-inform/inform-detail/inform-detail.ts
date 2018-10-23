import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
/**
 * Generated class for the InformDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name:"page-inform-detail"})
@Component({
  selector: 'page-inform-detail',
  templateUrl: 'inform-detail.html',
})
export class InformDetailPage extends SecondLevelPage {
  private inform;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    super(navCtrl, navParams);
    console.log(navParams)
    this.inform = navParams.data;
  }

 
}
