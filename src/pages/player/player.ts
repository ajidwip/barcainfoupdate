import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { HttpHeaders } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {
  myFormPlayers: FormGroup;
  public playersbarca = [];
  public playersspain = [];
  public playersargentina = [];
  public nextno: any;
  public uuid = '';
  public Players = [];
  public TotalPlayers: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public api: ApiProvider) {
    this.myFormPlayers = fb.group({
      name: ['', Validators.compose([Validators.required])],
      position: ['', Validators.compose([Validators.required])],
      positiongroup: ['', Validators.compose([Validators.required])],
      number: ['', Validators.compose([Validators.required])],
      imgurl: ['', Validators.compose([Validators.required])],
      season: ['', Validators.compose([Validators.required])]
    })
    this.doGetPlayersBarca();
    this.doGetPlayersSpain();
    this.doGetPlayersArgentina();
  }

  doGetPlayersBarca() {
    this.api.get('table/z_players', { params: { limit: 1000, filter: "club='Barcelona'", sort: "name ASC " } })
      .subscribe(val => {
        this.playersbarca = val['data'];
      });
  }
  doGetPlayersSpain() {
    this.api.get('table/z_players', { params: { limit: 1000, filter: "club='Spain'", sort: "name ASC " } })
      .subscribe(val => {
        this.playersspain = val['data'];
      });
  }
  doGetPlayersArgentina() {
    this.api.get('table/z_players', { params: { limit: 1000, filter: "club='Argentina'", sort: "name ASC " } })
      .subscribe(val => {
        this.playersargentina = val['data'];
      });
  }
  doAddPlayers() {
    document.getElementById("myPlayers").style.display = "block";
    document.getElementById("header").style.display = "none";
    this.myFormPlayers.get('season').setValue('2017-2018')
  }
  doCloseAddPlayers() {
    document.getElementById("myPlayers").style.display = "none";
    document.getElementById("header").style.display = "block";
    this.myFormPlayers.reset();
  }
  getNextNoPlayers() {
    return this.api.get('nextno/z_players/id')
  }
  doSavePlayers() {
    this.getNextNoPlayers().subscribe(val => {
      this.nextno = val['nextno'];
      let uuid = UUID.UUID();
      this.uuid = uuid;
      let date = moment().format('YYYY-MM-DD h:mm:ss');
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");

      this.api.post("table/z_players",
        {
          "id": this.nextno,
          "name": this.myFormPlayers.value.name,
          "position": this.myFormPlayers.value.position,
          "position_group": this.myFormPlayers.value.positiongroup,
          "number": this.myFormPlayers.value.number,
          "img_url": this.myFormPlayers.value.imgurl,
          "season": this.myFormPlayers.value.season,
          "status": 'OPEN',
          "date": date,
          "uuid": this.uuid
        },
        { headers })
        .subscribe(val => {
          this.myFormPlayers.reset();
          let alert = this.alertCtrl.create({
            title: 'Sukses',
            subTitle: 'Save Sukses',
            buttons: ['OK']
          });
          alert.present();
          this.doCloseAddPlayers();
          this.nextno = '';
          this.uuid = '';
        })
    });
  }

}
