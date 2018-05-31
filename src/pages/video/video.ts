import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { HttpHeaders } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {
  myFormVideos: FormGroup;
  public videoverifikasi = [];
  public videoopen = [];
  public videoclsd = [];
  public nextno: any;
  public uuid = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public api: ApiProvider) {
    this.myFormVideos = fb.group({
      title: ['', Validators.compose([Validators.required])],
      imageurlthumb: ['', Validators.compose([Validators.required])],
      videourl: ['', Validators.compose([Validators.required])]
    })
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
  doAddVideos() {
    this.myFormVideos.get('videourl').setValue('https://www.youtube.com/embed/')
    document.getElementById("myVideos").style.display = "block";
    document.getElementById("header").style.display = "none";
  }
  doCloseAddVideos() {
    document.getElementById("myVideos").style.display = "none";
    document.getElementById("header").style.display = "block";
  }
  getNextNoVideos() {
    return this.api.get('nextno/z_content_videos/id')
  }
  doSaveVideos() {
    this.getNextNoVideos().subscribe(val => {
      this.nextno = val['nextno'];
      let uuid = UUID.UUID();
      this.uuid = uuid;
      let date = moment().format('YYYY-MM-DD h:mm:ss');
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");

      this.api.post("table/z_content_videos",
        {
          "id": this.nextno,
          "title": this.myFormVideos.value.title,
          "image_url_thumb": this.myFormVideos.value.imageurlthumb,
          "video_url": this.myFormVideos.value.videourl,
          "date": date,
          "status": 'VERIFIKASI',
          "uuid": this.uuid
        },
        { headers })
        .subscribe(val => {
          this.myFormVideos.reset();
          let alert = this.alertCtrl.create({
            title: 'Sukses',
            subTitle: 'Save Sukses',
            buttons: ['OK']
          });
          alert.present();
          this.doCloseAddVideos();
          this.nextno = '';
          this.uuid = '';
        })
    });
  }

}
