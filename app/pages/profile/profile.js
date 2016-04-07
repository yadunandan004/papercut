import {Page,NavController,Platform,NavParams,IonicApp,ActionSheet} from 'ionic-angular';
import {SelectFilePage} from '../select-file/select-file';
import {UserData} from '../../providers/user-data/user-data';
import {WalletPage} from '../wallet/wallet';
import {AboutPage} from '../about/about';
import {NgZone} from "angular2/core";

/*
  Generated class for the ProfilePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/profile/profile.html',
  providers:[UserData]
})
export class ProfilePage {
  static get parameters() {
    return [[NavController],[Platform],[NavParams],[IonicApp]];
  }

  constructor(nav,platform,navParams,app) {
    this.nav = nav;
    this.zone = new NgZone({enableLongStackTrace: false});
    this.navParams=navParams;
    this.platform=platform;
    this.title="";
    this.app=app;
    this.app.getComponent('leftMenu').enable(true);
    this.person='';
    this.orders=[];
    this.tabs="myprofile";
    
    this.socket=io('https://print-yadunandan004.c9users.io:8080');

          this.socket.on('new_order',(data)=>{
            this.actionSheet = ActionSheet.create({
          title: 'New Order',
          buttons: [
            {
              text: 'Process Now',
              handler: () => {
                this.acknowledge(data);
              }
            },{
              text: 'Process Later',
              handler: () => {
                console.log('Archive clicked');
              }
            },{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        this.nav.present(this.actionSheet);
      });
    
    if(typeof(navParams.get('data'))!=='undefined')
      {
        this.details=navParams.get('data');
        this.zone.run(() => {
          this.title=this.details.name;
          this.person=this.details.type;
        });
        if(this.person=='user')
        {
          this.regUser(this.details.email);
        }
        if(this.person=='shop')
          {
            this.listen(this.details.shopid);
          }
      }
    this.platform.ready().then(() => {
      document.addEventListener('backbutton', () => {
        if(!this.nav.canGoBack()){
          navigator.Backbutton.goHome(function() {
            console.log('success')
          }, function() {
            console.log('fail')
          });
        }  
        else
        {
          this.nav.pop();
        }
      }, false);  
    });
  }
   onPageWillLeave() {
    this.app.getComponent('leftMenu').enable(false);
  }
  selectFile(event,item){
    this.nav.push(SelectFilePage);
  }
  
  listen(shpid)
  {
    
     this.socket.on('connect',(data)=>{
        this.socket.emit('join',shpid);
       });   
  }
  regUser(uid)
  {
     this.socket.on('connect',(data)=>{
        this.socket.emit('new_user',uid);
       });
     
  }
  acknowledge(data)
  {
    var res=JSON.stringify(data);
    this.zone.run(() => {
           this.orders.push(res);
            });
    this.updateStatus(res);
  }

  updateStatus(res)
  {
      var url = 'https://print-yadunandan004.c9users.io:8080/orders/updateStatus';
     cordovaHTTP.post(url, {
    id: res._id,
    sts:'ongoing'
    },{'Content-type' :  'application/json'},response=>{
        alert('response sent');
      });
  }

}
