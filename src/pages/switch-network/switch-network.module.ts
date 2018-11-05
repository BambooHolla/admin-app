import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwitchNetworkPage } from './switch-network';

@NgModule({
  declarations: [
    SwitchNetworkPage,
  ],
  imports: [
    IonicPageModule.forChild(SwitchNetworkPage),
  ],
})
export class SwitchNetworkPageModule {}
