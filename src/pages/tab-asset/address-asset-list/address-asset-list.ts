import { Component, Optional, transition, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, Content } from 'ionic-angular';
import { SecondLevelPage } from '../../../app-framework/SecondLevelPage';
import { asyncCtrlGenerator } from '../../../app-framework/Decorator';
import { AddressModel, AddressServiceProvider, TransType, AddressTransModel } from '../../../providers/address-service/address-service';
import { BigNumber } from 'bignumber.js';
/**
 * Generated class for the AddressAssetListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name:"page-address-asset-list"})
@Component({
  selector: 'page-address-asset-list',
  templateUrl: 'address-asset-list.html',
})
export class AddressAssetListPage extends SecondLevelPage {
    private addressInfo: AddressModel;
    private page: number = 0;
    private pageSize: number = 10;
    private hasMore: boolean = true;
    private hasChangeType: boolean = true;
    private totalAssets: number | string = 0;
    private product;
    private typeArr = [
        {
            name: "全部",
            value: TransType.All,
        },
        {
            name: "转入",
            value: TransType.In,
        },
        {
            name: "转出",
            value: TransType.Out,
        }
    ];
    private selectTypeIndex: number = 0;
    private selectTypeAddressAssetList: AddressTransModel[];

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        public addressService: AddressServiceProvider,
    ) {
        super(navCtrl, navParams);
        this.addressInfo = this.navParams.data.address;
        this.product = this.navParams.data.product;
        this.init();
    }

    @asyncCtrlGenerator.loading()
    @asyncCtrlGenerator.error("获取数据失败")
    init() {
        this.selectTypeAddressAssetList = [];
        this.page = 1; 
        this.pageSize = 10;
        return this.getAddressAssetList().then(assetList => {
            this.selectTypeAddressAssetList = assetList;
        });
    }

    @ViewChild(Content) content: Content;
    async checkType(item,i) {
        if(!this.hasChangeType || this.selectTypeIndex === i) return;
        await this.content.scrollToTop(100);
        this.selectTypeIndex = i;
        return this.init();
    }


    @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
    async loadMoreAssets(ctrl: InfiniteScroll) {
        this.page += 1;
        this.hasChangeType = false;
        this.selectTypeAddressAssetList.push(...(await this.getAddressAssetList()));
        this.hasChangeType = true;
        ctrl.complete();
    }

   
    getAddressAssetList() {
        return this.addressService.getAddressAssetList({
            productHouseId: this.product.productHouseId,
            // address: this.addressInfo.rechargeWithdrawAddress,
            address: "mvDQzzLHRAA7DiXsDWrNPhQLrXv4ehfYuY",
            transType: this.typeArr[this.selectTypeIndex].value,
            page: this.page,
            pageSize: this.pageSize,
        })
        .then(async assetList => {
            this.hasMore = assetList.length === this.pageSize;
            this.infiniteScroll &&
            this.infiniteScroll.enable(this.hasMore);
            return assetList;
        })
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
