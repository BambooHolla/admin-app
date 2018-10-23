import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressScanPage } from './address-scan';

@NgModule({
  declarations: [
    AddressScanPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressScanPage),
  ],
})
export class AddressScanPageModule {}
