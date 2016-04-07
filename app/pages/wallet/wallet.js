import {Page, NavController} from 'ionic-angular';

/*
  Generated class for the WalletPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/wallet/wallet.html',
})
export class WalletPage {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
  }
}
