import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WithdrawAddressAddPage } from './withdraw-address-add';
import { ComponentsModule } from '../../../components/components.module';
@NgModule({
  declarations: [
    WithdrawAddressAddPage,
  ],
  imports: [
    IonicPageModule.forChild(WithdrawAddressAddPage),
    ComponentsModule,
  ],
})
export class WithdrawAddressAddPageModule {}
