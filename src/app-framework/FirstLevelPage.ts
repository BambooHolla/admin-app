import { FLP_Data } from "./FLP_Data";
import { NavController, NavParams } from "ionic-angular";

// TODO: 根页面控制器
export class FirstLevelPage extends FLP_Data {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams, 
    ) {
        super(navCtrl, navParams);
    }
}