import { Injectable } from '@angular/core';
import { AppFetchProvider } from '../app-fetch/app-fetch';
import { AppSettingProvider } from '../app-setting/app-setting';

/*
  Generated class for the AddressServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AddressServiceProvider {
  // 初始化密钥
  readonly INIT_KEY = this.appSetting.APP_URL("/platform/key/init"); 
  // 获取地址列表
  readonly GET_ADDRESS_LIST = this.appSetting.APP_URL("/account/instAddress");
  // 地址是否启用
  readonly EDIT_ADDRESS_BY_ID = this.appSetting.APP_URL("/account/instAddress/update/:id");
  // 检验地址名称
  readonly CHECK_ADDRESS_NAME = this.appSetting.APP_URL("/account/instAddress/name/validate");
  // 检验地址有效性
  readonly CHECK_ADDRESS = this.appSetting.APP_URL("/account/instAddress/address/validate");
  // 保存充值地址
  readonly SAVE_RECHARGE_ADDRESS = this.appSetting.APP_URL("/account/instAddress/recharge/add");
  // 批量生成地址（提现:withdraw，矿工费:fee）
  readonly CREATE_WF_ADDRESS_LIST = this.appSetting.APP_URL("/account/instAddress/create");
  // 保存批量生成的地址
  readonly SAVE_BATCH_ADDRESS_LIST = this.appSetting.APP_URL("/account/instAddress/save");
  // 导入地址私钥
  readonly IMPORT_ADDRESS_KEY = this.appSetting.APP_URL("/account/instAddress/withdraw/import");


  constructor(
    public appSetting: AppSettingProvider,
		public fetch: AppFetchProvider,
  ) {
    console.log('Hello AddressServiceProvider Provider');
  }

  getInitKeyInfo() {
    return this.fetch.get<keyModel>(this.INIT_KEY).then(data => data['data'] || data)
  }

  getAddressList(productHouseId: string, addressUse: string, page: number = 1, pageSize: number = 1000): Promise<AddressModel[]> {
    return this.fetch.get<AddressModel[]>(
      this.GET_ADDRESS_LIST,
      {
        search: {
          productHouseId,
          addressUse,
          page,
          pageSize,
        }
      }
    ).then(data => data["data"]||data);
  }

  editAddressById(id: string, addressClass: string) {
    return this.fetch.put(
      this.EDIT_ADDRESS_BY_ID,
      {},
      {
        search: { addressClass },
        params: { id }
      }
    ).then( data => data["status"] || data);
  }

  checkAddressName(productHouseId: string, addressName: string) {
    return this.fetch.get(
      this.CHECK_ADDRESS_NAME,
      {
        search: {
          productHouseId,
          addressName,
        }
      }
    )
  }

  checkAddress(productHouseId: string, address: string) {
    return this.fetch.get(
      this.CHECK_ADDRESS,
      {
        search: {
          productHouseId,
          address,
        }
      }
    )
  }

  saveRechargeAddress(productHouseId: string, addressName: string, address: string) {
    return this.fetch.post<AddressModel>(
      this.SAVE_RECHARGE_ADDRESS,
      {
        productHouseId,
        addressName,
        address,
      }
    )
  }

  createWFAddressList(productHouseId: string, addressUse: string, count: number = 1) {
    return this.fetch.post<AddressModel[]>(
      this.CREATE_WF_ADDRESS_LIST,
      {
        productHouseId,
        addressUse,
        count,
      }
    )
  }

  saveBatchAddressList(addressArr: AddressModel[]) {
    return this.fetch.post<AddressModel[]>(
      this.SAVE_BATCH_ADDRESS_LIST,
      {
        addressArr: addressArr,
      }
    );
  }

  importAddressKey(productHouseId: string, privateKey: string) {
    return this.fetch.post<AddressModel[]>(
      this.IMPORT_ADDRESS_KEY,
      {
        productHouseId,
        privateKey,
      }
    );
  }
  
}

export type keyModel = {
  key: string;
}

export enum AddressUse {
    Recharge = '001', // 充值
    Withdraw = '002', // 提现
    Miner = '003', // 矿工费
    Other = '999', // 其他
}

export type AddressModel = {
  addressBalance?: string;
  addressBlock?: string;
  addressClass?: string;
  addressName?: string;
  addressUse?: string | number;
  crtDateTime?: string ;
  id?: string;
  lstModDateTime?: string;
  productHouseId?: string;
  rechargeWithdrawAddress?: string;
}