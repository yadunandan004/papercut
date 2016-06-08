import {App,IonicApp, Platform,Alert,Config} from 'ionic-angular';
import {LoginPage} from './pages/login/login';
import {WalletPage} from './pages/wallet/wallet';
import {AboutPage} from './pages/about/about';
import {ProfilePage} from './pages/profile/profile';
import {Inject} from 'angular2/core';
import {UserData} from './providers/user-data/user-data';
import {Splashscreen} from 'ionic-native';
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
       
    this.rootPage = LoginPage;
    this.pages = [{title:'Profile',component:ProfilePage},
    {title:'Wallet',component:WalletPage},
    {title:'AboutUs',component:AboutPage}]; 
    this.platform.ready().then(() => {

              
              /* this.userData.getPerson((data)=>{
                    if(typeof(data)!=='undefined')
                    {
                      var nav=this.app.getComponent('nav');
                      nav.setRoot(ProfilePage);
                    }
                },(err)=>{
                  if(err==1)
                  {
                  this.userData.initStorage('user',(res)=>{
                      //alert('table created');
                      });
                  }
                });*/
              
            
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
    var navg = this.app.getComponent('nav');
    navg.setRoot(page.component);
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
                    this.userData.logout();
                  }
                }]
                });
   this.userData.logout();
   //this.app.present(alert); 
  }
  
}
