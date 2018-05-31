import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  public scheduleverifikasi = [];
  public scheduleopen = [];
  public scheduleclsd = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider) {
    this.doGetScheduleVerifikasi();
    this.doGetScheduleOpen();
    this.doGetScheduleClsd();
  }

  doGetScheduleVerifikasi() {
    this.api.get('table/z_schedule', { params: { limit: 1000, filter: "status='VERIFIKASI'", sort: "date DESC " } })
      .subscribe(val => {
        this.scheduleverifikasi = val['data'];
      });
  }
  doGetScheduleOpen() {
    this.api.get('table/z_schedule', { params: { limit: 1000, filter: "status='OPEN'", sort: "date DESC " } })
      .subscribe(val => {
        this.scheduleopen = val['data'];
      });
  }
  doGetScheduleClsd() {
    this.api.get('table/z_schedule', { params: { limit: 1000, filter: "status='CLSD'", sort: "date DESC " } })
      .subscribe(val => {
        this.scheduleclsd = val['data'];
      });
  }

}
