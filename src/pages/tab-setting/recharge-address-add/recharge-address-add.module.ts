import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RechargeAddressAddPage } from './recharge-address-add';
import { ComponentsModule } from '../../../components/components.module';
@NgModule({
  declarations: [
    RechargeAddressAddPage,
  ],
  imports: [
    IonicPageModule.forChild(RechargeAddressAddPage),
    ComponentsModule,
  ],
})
export class RechargeAddressAddPageModule {}
