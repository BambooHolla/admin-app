import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressAssetDetailsPage } from './address-asset-details';
import { ComponentsModule } from '../../../components/components.module';
@NgModule({
  declarations: [
    AddressAssetDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressAssetDetailsPage),
    ComponentsModule,
  ],
})
export class AddressAssetDetailsPageModule {}
