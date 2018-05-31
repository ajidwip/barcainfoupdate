import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-fanspage',
  templateUrl: 'fanspage.html',
})
export class FanspagePage {
  public fanspageverifikasi = [];
  public fanspageopen = [];
  public fanspageclsd = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider) {
    this.doGetFanspageVerifikasi();
    this.doGetFanspageOpen();
    this.doGetFanspageClsd();
  }

  doGetFanspageVerifikasi() {
    this.api.get('table/z_fanspage', { params: { limit: 1000, filter: "status='VERIFIKASI'", sort: "date DESC " } })
      .subscribe(val => {
        this.fanspageverifikasi = val['data'];
      });
  }
  doGetFanspageOpen() {
    this.api.get('table/z_fanspage', { params: { limit: 1000, filter: "status='OPEN'", sort: "date DESC " } })
      .subscribe(val => {
        this.fanspageopen = val['data'];
      });
  }
  doGetFanspageClsd() {
    this.api.get('table/z_fanspage', { params: { limit: 1000, filter: "status='CLSD'", sort: "date DESC " } })
      .subscribe(val => {
        this.fanspageclsd = val['data'];
      });
  }

}
