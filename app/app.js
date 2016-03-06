import {App,IonicApp, Platform,Alert} from 'ionic-framework/ionic';
import {LoginPage} from './pages/login/login';
import {PrintPage} from './pages/print/print';
import {ShopselPage} from './pages/shopsel/shopsel';
import {Inject} from 'angular2/core';
import {UserData} from './providers/user-data/user-data';

@App({
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers:[UserData]
})
export class MyApp {
  static get parameters() {
    return [[Platform],[IonicApp],[UserData]];
  }
  
  constructor(platform,app,userData) {
     this.app = app;
    this.platform = platform;
    this.userData=userData;
    //this.nav=nav;
    
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
  logout()
  {
   var alert = Alert.create({
                  title: 'Response',
                  subTitle: 'Are you Sure?',
                  buttons: [
                  {
                text: 'Cancel',
                handler: data => {
                  console.log('Cancel clicked');
                }
                },
                {
                  text: 'Ya',
                  handler: data => {
                    this.userData.logout('user');
                  }
                }]
                });
   this.userData.logout('user');
   //this.app.present(alert); 
  }
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.app.getComponent('leftMenu').close();
    // navigate to the new page if it is not the current page
    var navg = this.app.getComponent('nav');
    navg.setRoot(page.component);
  }
}
