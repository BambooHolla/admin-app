import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemindProductListPage } from './remind-product-list';
import { ComponentsModule } from '../../../components/components.module';
@NgModule({
  declarations: [
    RemindProductListPage,
  ],
  imports: [
    IonicPageModule.forChild(RemindProductListPage),
    ComponentsModule,
  ],
})
export class RemindProductListPageModule {}
