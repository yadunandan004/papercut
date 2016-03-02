import {App,IonicApp, Platform} from 'ionic-framework/ionic';
import {LoginPage} from './pages/login/login';
import {PrintPage} from './pages/print/print';
import {ShopselPage} from './pages/shopsel/shopsel';
import {Inject} from 'angular2/core';

@App({
  templateUrl: 'build/app.html',
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
  static get parameters() {
    return [[Platform],[IonicApp]];
  }
  
  constructor(platform,app) {
     this.app = app;
    this.platform = platform;
    
    this.pages = [
      { title: 'Login Page', component: LoginPage },
      { title: 'Print Page',component:PrintPage},
      {title:'Shop Selection',component:ShopselPage}
      ];
    this.rootPage = LoginPage;
    this.platform.ready().then(() => {
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
       if (window.StatusBar) {
        window.StatusBar.styleDefault();
      }
    });
  }
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.app.getComponent('leftMenu').close();
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
