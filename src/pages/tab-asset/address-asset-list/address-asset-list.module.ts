import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressAssetListPage } from './address-asset-list';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
@NgModule({
  declarations: [
    AddressAssetListPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressAssetListPage),
    ComponentsModule,
    PipesModule,
  ],
})
export class AddressAssetListPageModule {}
