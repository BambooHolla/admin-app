import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeeAddressAddPage } from './fee-address-add';
import { ComponentsModule } from '../../../components/components.module';
@NgModule({
  declarations: [
    FeeAddressAddPage,
  ],
  imports: [
    IonicPageModule.forChild(FeeAddressAddPage),
    ComponentsModule,
  ],
})
export class FeeAddressAddPageModule {}
