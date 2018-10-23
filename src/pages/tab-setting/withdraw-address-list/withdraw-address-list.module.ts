import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WithdrawAddressListPage } from './withdraw-address-list';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    WithdrawAddressListPage,
  ],
  imports: [
    IonicPageModule.forChild(WithdrawAddressListPage),
    ComponentsModule,
  ],
})
export class WithdrawAddressListPageModule {}
