import {Page, NavController,IonicApp} from 'ionic-angular';

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
    return [[NavController],[IonicApp]];
  }

  constructor(nav,app) {
    this.nav = nav;
    this.app=app;
    this.app.getComponent('leftMenu').enable(true);
    this.amount=1000;
  }
  onPageWillLeave() {
    this.app.getComponent('leftMenu').enable(false);
  }
}
