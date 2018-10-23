import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressAssetListPage } from './address-asset-list';
import { ComponentsModule } from '../../../components/components.module';
@NgModule({
  declarations: [
    AddressAssetListPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressAssetListPage),
    ComponentsModule,
  ],
})
export class AddressAssetListPageModule {}
