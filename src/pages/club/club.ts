import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { HttpHeaders } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-club',
  templateUrl: 'club.html',
})
export class ClubPage {
  myFormClub: FormGroup;
  public clubsverifikasi = [];
  public clubsopen = [];
  public clubsclsd = [];
  public Clubs = [];
  public TotalClubs: any;
  public nextno: any;
  public uuid = '';
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public api: ApiProvider,
    public navParams: NavParams) {
    this.myFormClub = fb.group({
      nation: ['', Validators.compose([Validators.required])],
      clubname: ['', Validators.compose([Validators.required])],
      alias: ['', Validators.compose([Validators.required])],
      stadion: ['', Validators.compose([Validators.required])],
      iconurl: ['', Validators.compose([Validators.required])]
    })
    this.doGetClubsVerifikasi();
    this.doGetClubsOpen();
    this.doGetClubsClsd();
  }

  doGetClubsVerifikasi() {
    this.api.get('table/z_club', { params: { limit: 1000, filter: "status='VERIFIKASI'", sort: "name ASC " } })
      .subscribe(val => {
        this.clubsverifikasi = val['data'];
      });
  }
  doGetClubsOpen() {
    this.api.get('table/z_club', { params: { limit: 1000, filter: "status='OPEN'", sort: "name ASC " } })
      .subscribe(val => {
        this.clubsopen = val['data'];
      });
  }
  doGetClubsClsd() {
    this.api.get('table/z_club', { params: { limit: 1000, filter: "status='CLSD'", sort: "name ASC " } })
      .subscribe(val => {
        this.clubsclsd = val['data'];
      });
  }
  doAddClub() {
    document.getElementById("myClub").style.display = "block";
    document.getElementById("header").style.display = "none";
    this.myFormClub.get('iconurl').setValue('http://101.255.60.202/webapi5/img/')
  }
  doCloseAddClub() {
    document.getElementById("myClub").style.display = "none";
    document.getElementById("header").style.display = "block";
    this.myFormClub.reset();
  }
  changename() {
    this.myFormClub.get('iconurl').setValue('http://101.255.60.202/webapi5/img/' + this.myFormClub.value.clubname)
  }
  getNextNoClub() {
    return this.api.get('nextno/z_club/id')
  }
  doSaveClub() {
    this.getNextNoClub().subscribe(val => {
      this.nextno = val['nextno'];
      let uuid = UUID.UUID();
      this.uuid = uuid;
      let date = moment().format('YYYY-MM-DD h:mm:ss');
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");

      this.api.post("table/z_club",
        {
          "id": this.nextno,
          "name": this.myFormClub.value.clubname,
          "alias": this.myFormClub.value.alias,
          "nation": this.myFormClub.value.nation,
          "stadion": this.myFormClub.value.stadion,
          "icon_url": this.myFormClub.value.iconurl,
          "date": date,
          "uuid": this.uuid
        },
        { headers })
        .subscribe(val => {
          this.myFormClub.reset();
          let alert = this.alertCtrl.create({
            title: 'Sukses',
            subTitle: 'Save Sukses',
            buttons: ['OK']
          });
          alert.present();
          this.doCloseAddClub();
          this.nextno = '';
          this.uuid = '';
        })
    });
  }

}
