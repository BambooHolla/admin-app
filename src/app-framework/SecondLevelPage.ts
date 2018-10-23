import { FirstLevelPage } from "./FirstLevelPage";
import { NavController, NavParams } from "ionic-angular";
import { TabsPage } from "../pages/tabs/tabs";

// TODO: 根页面控制器
// 用于隐藏tab
export class SecondLevelPage extends FirstLevelPage {
    public PAGE_LEVEL = 2;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams, 
        private _autoHiddenTabs: boolean = true,
        public tabs?: TabsPage,
    ) {
        super(navCtrl, navParams);
    }
    ionViewWillEnter() {
        super.ionViewWillEnter();
        if (this._autoHiddenTabs && this.tabs) {
            this.tabs.hideTabs(true, this.cname);
        }
    }
    ionViewDidLeave() {
        super.ionViewDidLeave();
        if (this._autoHiddenTabs && this.tabs) {
            this.tabs.hideTabs(false, this.cname);
        }
    }

}