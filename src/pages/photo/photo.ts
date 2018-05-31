import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { HttpHeaders } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {
  public photoverifikasi = [];
  public photoopen = [];
  public photoclsd = [];
  public nextno: any;
  public uuid = '';
  public photos = [];
  public id: any;
  myFormGallery: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public api: ApiProvider) {
    this.myFormGallery = fb.group({
      title: ['', Validators.compose([Validators.required])],
      imageurl: ['', Validators.compose([Validators.required])],
      url: [''],
    })
    this.doGetPhotoVerifikasi();
    this.doGetPhotoOpen();
    this.doGetPhotoClsd();
  }

  doGetPhotoVerifikasi() {
    this.api.get('table/z_content_photos', { params: { limit: 1000, filter: "status='VERIFIKASI'", sort: "date DESC " } })
      .subscribe(val => {
        this.photoverifikasi = val['data'];
      });
  }
  doGetPhotoOpen() {
    this.api.get('table/z_content_photos', { params: { limit: 1000, filter: "status='OPEN'", sort: "date DESC " } })
      .subscribe(val => {
        this.photoopen = val['data'];
      });
  }
  doGetPhotoClsd() {
    this.api.get('table/z_content_photos', { params: { limit: 1000, filter: "status='CLSD'", sort: "date DESC " } })
      .subscribe(val => {
        this.photoclsd = val['data'];
      });
  }
  doAddGallery() {
    let uuid = UUID.UUID();
    this.uuid = uuid;
    this.getNextNoGallery().subscribe(val => {
      this.nextno = val['nextno'];
      this.id = this.nextno;
      let date = moment().format('YYYY-MM-DD h:mm:ss');
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");

      this.api.post("table/z_content_photos",
        {
          "id": this.id,
          "title": this.myFormGallery.value.title,
          "image_url_thumb": this.myFormGallery.value.imageurl,
          "date": date,
          "status": 'VERIFIKASI',
          "uuid": this.uuid
        },
        { headers })
        .subscribe(val => {
          document.getElementById("myGallery").style.display = "block";
          document.getElementById("header").style.display = "none";
        })
    });
  }
  doCloseAddGallery() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Close',
      message: 'Do you want to close this gallery?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'OK',
          handler: () => {
            const headers = new HttpHeaders()
              .set("Content-Type", "application/json");
            this.api.delete('table/z_content_photos', { params: { limit: 1000, filter: "id=" + "'" + this.id + "'" } })
              .subscribe(val => {
                document.getElementById("myGallery").style.display = "none";
                document.getElementById("header").style.display = "block";
                this.nextno = '';
                this.id = '';
                this.uuid = '';
                this.photos = [];
              });
          }
        }
      ]
    });
    alert.present();
  }
  getNextNoGallery() {
    return this.api.get('nextno/z_content_photos/id')
  }
  getNextNoImageLink() {
    return this.api.get('nextno/z_image_link/id')
  }
  doRefreshPhotos() {
    this.api.get('table/z_image_link', { params: { limit: 1000, filter: "uuid_parent=" + "'" + this.uuid + "'" } })
      .subscribe(val => {
        this.photos = val['data'];
      });
  }
  doSaveGallery() {
    let date = moment().format('YYYY-MM-DD h:mm:ss');
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");

    this.api.put("table/z_content_photos",
      {
        "id": this.id,
        "title": this.myFormGallery.value.title,
        "image_url_thumb": this.myFormGallery.value.imageurl,
        "date": date,
        "status": 'VERIFIKASI'
      },
      { headers })
      .subscribe(val => {
        this.myFormGallery.reset();
        let alert = this.alertCtrl.create({
          title: 'Sukses',
          subTitle: 'Save Sukses',
          buttons: ['OK']
        });
        alert.present();
        document.getElementById("myGallery").style.display = "none";
        document.getElementById("header").style.display = "block";
        this.nextno = '';
        this.id = '';
        this.uuid = '';
        this.photos = [];
      })
  }
  doAddphotos() {
    this.getNextNoImageLink().subscribe(val => {
      this.nextno = val['nextno'];
      let date = moment().format('YYYY-MM-DD h:mm:ss');
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");

      this.api.post("table/z_image_link",
        {
          "id": this.nextno,
          "uuid_parent": this.uuid,
          "title": this.myFormGallery.value.title,
          "image_url": this.myFormGallery.value.url,
          "date": date
        },
        { headers })
        .subscribe(val => {
          this.doRefreshPhotos();
          this.myFormGallery.get('url').setValue('');
        })
    });
  }

}
