import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {
  public playersbarca = [];
  public playersspain = [];
  public playersargentina = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider) {
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
    this.api.get('table/z_players', { params: { limit: 1000, filter: "club='Spain'",sort: "name ASC " } })
      .subscribe(val => {
        this.playersspain = val['data'];
      });
  }
  doGetPlayersArgentina() {
    this.api.get('table/z_players', { params: { limit: 1000, filter: "club='Argentina'",sort: "name ASC " } })
      .subscribe(val => {
        this.playersargentina = val['data'];
      });
  }

}
