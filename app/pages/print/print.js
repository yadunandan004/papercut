import {Page, NavController} from 'ionic-framework/ionic';
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
    return [[NavController]];
  }
  constructor(nav) {
    this.nav = nav;
  }
  selectFile(event,item){
  	this.nav.push(SelectFilePage);
  }
}
