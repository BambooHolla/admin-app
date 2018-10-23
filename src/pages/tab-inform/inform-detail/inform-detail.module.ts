import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InformDetailPage } from './inform-detail';
import { ComponentsModule } from '../../../components/components.module';
@NgModule({
  declarations: [
    InformDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(InformDetailPage),
    ComponentsModule,
  ],
})
export class InformDetailPageModule {}
