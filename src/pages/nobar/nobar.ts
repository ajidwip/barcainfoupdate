import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-nobar',
  templateUrl: 'nobar.html',
})
export class NobarPage {
  public nobarverifikasi = [];
  public nobaropen = [];
  public nobarclsd = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider) {
    this.doGetNobarVerifikasi();
    this.doGetNobarOpen();
    this.doGetNobarClsd();
  }

  doGetNobarVerifikasi() {
    this.api.get('table/z_nobar', { params: { limit: 1000, filter: "status='VERIFIKASI'", sort: "date DESC " } })
      .subscribe(val => {
        this.nobarverifikasi = val['data'];
      });
  }
  doGetNobarOpen() {
    this.api.get('table/z_nobar', { params: { limit: 1000, filter: "status='OPEN'", sort: "date DESC " } })
      .subscribe(val => {
        this.nobaropen = val['data'];
      });
  }
  doGetNobarClsd() {
    this.api.get('table/z_nobar', { params: { limit: 1000, filter: "status='CLSD'", sort: "date DESC " } })
      .subscribe(val => {
        this.nobarclsd = val['data'];
      });
  }

}
