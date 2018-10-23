import { FLP_Form } from "./FLP_Form";
import { NavController, NavParams } from "ionic-angular";

// TODO: 待添加
export class FLP_Data extends FLP_Form {
    public hidden_data_logo: string = "*********";
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
    ) {
        super(navCtrl,navParams);
    }
    handlerHiddenData() {
        this.appDataProvider.hiddenData = this.appDataProvider.hiddenData ? false : true;
    }
}