import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RechargeAddressListPage } from './recharge-address-list';
import { ComponentsModule } from '../../../components/components.module';
@NgModule({
  declarations: [
    RechargeAddressListPage,
  ],
  imports: [
    IonicPageModule.forChild(RechargeAddressListPage),
    ComponentsModule,
  ],
})
export class RechargeAddressListPageModule {}
