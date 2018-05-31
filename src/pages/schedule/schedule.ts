import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { HttpHeaders } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  myFormSchedule: FormGroup;
  public scheduleverifikasi = [];
  public scheduleopen = [];
  public scheduleclsd = [];
  public nextno: any;
  public uuid = '';
  public Clubs = [];
  public TotalClubs: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public api: ApiProvider) {
    this.myFormSchedule = fb.group({
      league: ['', Validators.compose([Validators.required])],
      round: ['', Validators.compose([Validators.required])],
      clubhome: ['', Validators.compose([Validators.required])],
      clubhomeicon: ['', Validators.compose([Validators.required])],
      clubaway: ['', Validators.compose([Validators.required])],
      clubawayicon: ['', Validators.compose([Validators.required])],
      place: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])]
    })
    this.doGetClub();
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
  doGetClub() {
    this.api.get('table/z_club', { params: { limit: 100 } })
      .subscribe(val => {
        this.Clubs = val['data'];
        this.TotalClubs = val['count']
      });
  }
  doAddSchedule() {
    document.getElementById("mySchedule").style.display = "block";
    document.getElementById("header").style.display = "none";
  }
  doCloseAddSchedule() {
    document.getElementById("mySchedule").style.display = "none";
    document.getElementById("header").style.display = "block";
  }
  onSelectClubHome(club) {
    this.myFormSchedule.get('clubhomeicon').setValue(club.icon_url)
    this.myFormSchedule.get('place').setValue(club.stadion)
  }
  onSelectClubAway(club) {
    this.myFormSchedule.get('clubawayicon').setValue(club.icon_url)
  }
  getNextNoSchedule() {
    return this.api.get('nextno/z_schedule/id')
  }
  doSaveSchedule() {
    this.getNextNoSchedule().subscribe(val => {
      this.nextno = val['nextno'];
      let uuid = UUID.UUID();
      this.uuid = uuid;
      let year = moment().format('YYYY');
      let month = moment().format('MMMM');
      let day = moment().format('DD');
      let date = moment(this.myFormSchedule.value.date).format();
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");
      this.api.post("table/z_schedule",
        {
          "id": this.nextno,
          "league": this.myFormSchedule.value.league,
          "round": this.myFormSchedule.value.round,
          "club_home": this.myFormSchedule.value.clubhome,
          "club_home_icon_url": this.myFormSchedule.value.clubhomeicon,
          "club_away": this.myFormSchedule.value.clubaway,
          "club_away_icon_url": this.myFormSchedule.value.clubawayicon,
          "place": this.myFormSchedule.value.place,
          "date": date,
          "status": 'VERIFIKASI',
          "info_live": 'LIVE STREAMING',
          "uuid": this.uuid
        },
        { headers })
        .subscribe(val => {
          this.myFormSchedule.reset();
          let alert = this.alertCtrl.create({
            title: 'Sukses',
            subTitle: 'Save Sukses',
            buttons: ['OK']
          });
          alert.present();
          this.doCloseAddSchedule();
          this.nextno = '';
          this.uuid = '';
        })
    });
  }

}
