import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeeAddressListPage } from './fee-address-list';
import { ComponentsModule } from '../../../components/components.module';
@NgModule({
  declarations: [
    FeeAddressListPage,
  ],
  imports: [
    IonicPageModule.forChild(FeeAddressListPage),
    ComponentsModule,
  ],
})
export class FeeAddressListPageModule {}
