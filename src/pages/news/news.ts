import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { HttpHeaders } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  myFormNews: FormGroup;
  public newsverifikasi = [];
  public newsopen = [];
  public newsclsd = [];
  public nextno: any;
  public uuid = '';
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public api: ApiProvider) {
    this.myFormNews = fb.group({
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      imageurl: ['', Validators.compose([Validators.required])],
      sumber: ['', Validators.compose([Validators.required])],
    })
    this.doGetNewsVerifikasi();
    this.doGetNewsOpen();
    this.doGetNewsClsd();
  }
  doGetNewsVerifikasi() {
    this.api.get('table/z_content_news', { params: { limit: 1000, filter: "status='VERIFIKASI'", sort: "date DESC " } })
      .subscribe(val => {
        this.newsverifikasi = val['data'];
      });
  }
  doGetNewsOpen() {
    this.api.get('table/z_content_news', { params: { limit: 1000, filter: "status='OPEN'", sort: "date DESC " } })
      .subscribe(val => {
        this.newsopen = val['data'];
      });
  }
  doGetNewsClsd() {
    this.api.get('table/z_content_news', { params: { limit: 1000, filter: "status='CLSD'", sort: "date DESC " } })
      .subscribe(val => {
        this.newsclsd = val['data'];
      });
  }
  doAddNews() {
    document.getElementById("header").style.display = "none";
    document.getElementById("myNews").style.display = "block";
  }
  doCloseAddNews() {
    document.getElementById("header").style.display = "block";
    document.getElementById("myNews").style.display = "none";
  }
  getNextNoNews() {
    return this.api.get('nextno/z_content_news/id')
  }
  doSaveNews() {
    this.getNextNoNews().subscribe(val => {
      this.nextno = val['nextno'];
      let uuid = UUID.UUID();
      this.uuid = uuid;
      let date = moment().format('YYYY-MM-DD h:mm:ss');
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");

      this.api.post("table/z_content_news",
        {
          "id": this.nextno,
          "title": this.myFormNews.value.title,
          "description": this.myFormNews.value.description,
          "sumber": this.myFormNews.value.sumber,
          "image_url": this.myFormNews.value.imageurl,
          "date": date,
          "status": 'VERIFIKASI',
          "uuid": this.uuid
        },
        { headers })
        .subscribe(val => {
          this.myFormNews.reset();
          let alert = this.alertCtrl.create({
            title: 'Sukses',
            subTitle: 'Save Sukses',
            buttons: ['OK']
          });
          alert.present();
          this.doCloseAddNews();
          this.nextno = '';
          this.uuid = '';
        })
    });
  }
}
