import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {
  public videoverifikasi = [];
  public videoopen = [];
  public videoclsd = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider) {
    this.doGetVideoVerifikasi();
    this.doGetVideoOpen();
    this.doGetVideoClsd();
  }

  doGetVideoVerifikasi() {
    this.api.get('table/z_content_videos', { params: { limit: 1000, filter: "status='VERIFIKASI'", sort: "date DESC " } })
      .subscribe(val => {
        this.videoverifikasi = val['data'];
      });
  }
  doGetVideoOpen() {
    this.api.get('table/z_content_videos', { params: { limit: 1000, filter: "status='OPEN'", sort: "date DESC " } })
      .subscribe(val => {
        this.videoopen = val['data'];
      });
  }
  doGetVideoClsd() {
    this.api.get('table/z_content_videos', { params: { limit: 1000, filter: "status='CLSD'", sort: "date DESC " } })
      .subscribe(val => {
        this.videoclsd = val['data'];
      });
  }

}
