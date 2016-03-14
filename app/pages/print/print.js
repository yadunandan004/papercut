import {Page, NavController,Platform,NavParams} from 'ionic-framework/ionic';
import {SelectFilePage} from '../select-file/select-file';

/*
  Generated class for the PrintPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/print/print.html',
})
export class PrintPage {
  static get parameters()
  {
    return [[NavController],[Platform],[NavParams]];
  }
  constructor(nav,platform,navParams) {
    this.nav = nav;
    this.platform=platform;
    //this.orders.push(navParams.get('order'));
  }
  selectFile(event,item){
  	this.nav.push(SelectFilePage);
  }

  listen()
  {
    var socket=io('https://print-yadunandan004.c9users.io:8080');
    socket.on('new_order',(data)=>{

    });
  }
}
