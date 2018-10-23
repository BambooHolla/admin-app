import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncBehaviorSubject } from "../../app-framework/RxExtends";
import { TB_AB_Generator, AppSettingProvider } from '../app-setting/app-setting';
import { AppFetchProvider } from '../app-fetch/app-fetch';
/*
  Generated class for the ProductServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductServiceProvider {
	readonly GET_PRODUCTS = this.appSetting.APP_URL("/product/product");
	constructor(
		public appSetting: AppSettingProvider,
		public fetch: AppFetchProvider,
	) {
        console.log('Hello AccountServiceProvider Provider');
       
	}

  	productList: AsyncBehaviorSubject<ProductModel[]>;
	@TB_AB_Generator("productList") 
	productList_Executor(promise_pro) { 
		return promise_pro.follow(this.getProducts(0, 30));
	}

	getProducts(
        page: number,
        pageSize: number = 10,
        productType: ProductType = ProductType.singleProduct,
        productStatus?: ProductStatus,
        productName?: string,
        productIdArr?: string,
    ) {
        return this.fetch.post<ProductModel[]>(this.GET_PRODUCTS, {
            page,
            pageSize,
            productType,
            productStatus,
            productName,
            productIdArr,
        }).then( data => {
            data.sort((item_1, item_2) => {
                if (item_1.productName == "IBT") {
                    return -1;
                } else if (item_1.productName == "USDT") {
                    return 1;
                } else if (
                    item_1.productId > item_2.productId
                ) {
                    return -1;
                } else {
                    return 1;
                }
			});
			debugger
            return data;
        });
    }

}

export type ProductModel = {
    _id: string;
    productId: string;
    productHouseId: string;
    platformType: string;
    productName: string;
    productCover: string;
    productDetail: string;
    priceId: string;
    limitedPriceId: string;
    bonusId: string;
    commissionId: string;
    rateId: string;
    interestId: string;
    issuePrice: number;
    issueQuantity: number;
    remainQuantity: number;
    participants: number;
    issueDate: string;
    productStatus: string;
    crtUserId: string;
    lstModUserId: string;
    lstModDateTime: string;
    crtDateTime: string;
    transactionObjectId: string[];
    agreementId: string[];
    cryptoCurrencyCode: string;
};
export enum ProductType {
    "singleProduct" = "001", //单一产品
    "pairProduct" = "002", //交易对产品
    "others" = "999", //"其他"
}
export enum ProductStatus {
    "suspension" = "001", //"已下架/停牌",
    "tradable" = "002", //"已上架/可交易",
    "others" = "999", //"其他"
}