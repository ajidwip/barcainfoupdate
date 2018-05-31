import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { HttpHeaders } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-fanspage',
  templateUrl: 'fanspage.html',
})
export class FanspagePage {
  myFormFansPage: FormGroup;
  public fanspageverifikasi = [];
  public fanspageopen = [];
  public fanspageclsd = [];
  public FansPage = [];
  public TotalFansPage: any;
  public nextno: any;
  public uuid = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public api: ApiProvider) {
    this.myFormFansPage = fb.group({
      fanspage: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      alias: ['', Validators.compose([Validators.required])],
      iconurl: ['', Validators.compose([Validators.required])],
      pageurl: ['', Validators.compose([Validators.required])]
    })
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
  doAddFansPage() {
    document.getElementById("myFansPage").style.display = "block";
    document.getElementById("header").style.display = "none";
  }
  doCloseAddFansPage() {
    document.getElementById("myFansPage").style.display = "none";
    document.getElementById("header").style.display = "block";
    this.myFormFansPage.reset();
  }
  getNextNoFansPage() {
    return this.api.get('nextno/z_fanspage/id')
  }
  doSaveFansPage() {
    this.getNextNoFansPage().subscribe(val => {
      this.nextno = val['nextno'];
      let uuid = UUID.UUID();
      this.uuid = uuid;
      let date = moment().format('YYYY-MM-DD h:mm:ss');
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");

      this.api.post("table/z_fanspage",
        {
          "id": this.nextno,
          "fanspage": this.myFormFansPage.value.fanspage,
          "name": this.myFormFansPage.value.name,
          "alias": this.myFormFansPage.value.alias,
          "icon_url": this.myFormFansPage.value.iconurl,
          "page_url": this.myFormFansPage.value.pageurl,
          "date": date,
          "uuid": this.uuid
        },
        { headers })
        .subscribe(val => {
          this.myFormFansPage.reset();
          let alert = this.alertCtrl.create({
            title: 'Sukses',
            subTitle: 'Save Sukses',
            buttons: ['OK']
          });
          alert.present();
          this.doCloseAddFansPage();
          this.nextno = '';
          this.uuid = '';
        })
    });
  }

}
