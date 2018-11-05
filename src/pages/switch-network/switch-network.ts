import { Component, Optional } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SecondLevelPage } from '../../app-framework/SecondLevelPage';
import { TabsPage } from '../tabs/tabs';
import { AppUrl } from '../../app-framework/helper';
/**
 * Generated class for the SwitchNetworkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name: "page-switch-network"})
@Component({
  selector: 'page-switch-network',
  templateUrl: 'switch-network.html',
})
export class SwitchNetworkPage extends SecondLevelPage {
    commandData: any[] = [
        {
            name: 'release:17.110',
            value: "http://192.168.17.110:40001",
            show: false,
        },
        {
            name: '本地:18.24',
            value: "http://192.168.18.24:40001",
            show: false,
        }
    ];
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        @Optional() public tabs: TabsPage,
    ) {
        super(navCtrl, navParams,true, tabs);
        
    }

    @SwitchNetworkPage.willEnter 
    init() {
        this.commandData.find((item, index) => {
            
            if (item.value == AppUrl.SERVER_URL) {
                item.show = true;
                return true;
            }
            return false;
        });
    }

    askChangeNetwork(data: any) {
        if (data.show) return;
        this.alertCtrl
        .create({
            title: "警告",
            message: "非相关人员请勿进行切换网络操作",
            buttons: [
                {
                    text: "取消",
                    role: "cancel",
                    handler: () => {},
                },
                {
                    text: "切换",
                    handler: () => {
                        this.swichNetwork(data);
                    },
                },
            ],
        })
        .present();
    }

    swichNetwork(data: any) {
        this.alertCtrl
        .create({
            title: `警告`,
            message: `是否重启切换到${data.name}`,
            buttons: [
                {
                    text: "取消",
                    role: "cancel",
                    handler: () => {},
                },
                {
                    text: "确定",
                    handler: () => {
                        localStorage.setItem(
                            "SERVER_URL_APP",
                            JSON.stringify(data.value),
                        );
                        this.appSetting.clearUserToken();
                        location.reload();
                    },
                },
            ],
        })
        .present();
    }

    private clickCount: number = 0;
    private _time: any;
    inputNetwork() {
        if(this._time) {
            clearTimeout(this._time);
        }
        this._time = setTimeout(() => {
            this.clickCount = 0;
        }, 1000);
        this.clickCount++;
        if(this.clickCount > 6) {
            const prompt = this.alertCtrl.create({
                title: '网络配置',
                cssClass: "network-page",
                inputs: [
                  {
                    name: 'network',
                    placeholder: '如：http://192.168.18.23：40001'
                  },
                ],
                buttons: [
                  {
                    text: '取消',
                    handler: data => {
                    }
                  },
                  {
                    text: '确定',
                    handler: data => {
                      console.log(data);
                      this.swichNetwork({
                        value: data.network,
                        name: "自定义网络",
                      })
                    }
                  }
                ]
            });
            prompt.present();
        }
        
    }
}
