import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsupdatePage } from './newsupdate';

@NgModule({
  declarations: [
    NewsupdatePage,
  ],
  imports: [
    IonicPageModule.forChild(NewsupdatePage),
  ],
})
export class NewsupdatePageModule {}
