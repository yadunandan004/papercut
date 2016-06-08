import {Page,NavController,Platform,NavParams,IonicApp,ActionSheet,Alert} from 'ionic-angular';
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
    return [[NavController],[Platform],[NavParams],[IonicApp],[UserData]];
  }

  constructor(nav,platform,navParams,app,userData) {
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
    this.userData=userData;
    
    this.socket=io('https://print-yadunandan004.c9users.io:8080');
          this.socket.on('ordrSts',(data)=>{
            //alert(JSON.stringify(data));                    
             //states:0:request,1:ongoing,2:finished
              if(data.time>0)
              {
                 var alert = Alert.create({
                title: 'Order Status',
                subTitle:'There will be a delay of '+data.time+' mins for your order',
                buttons: ['OK']
                });
                this.nav.present(alert);
              }
              else if(data.status==1)
              {
                var alert = Alert.create({
                title: 'Order Status',
                subTitle:'The printing of your order has started now',
                buttons: ['OK']
                });
                this.nav.present(alert);
              }
              else if(data.status==2)
              {
                var alert = Alert.create({
                title: 'Order Status',
                subTitle:'Printing has finished, please collect it',
                buttons: ['OK']
                });
                this.nav.present(alert);
              }
           });
          this.socket.on('new_order',(data)=>{
            navigator.notification.beep(2);
            var time=0;
            this.actionSheet = ActionSheet.create({
          title: 'New Order',
          buttons: [
            {
              text: 'Process Now',
              handler: () => {
                this.acknowledge(data,time);
              }
            },{
              text: 'Process Later',
              handler: () => {
                //console.log('Archive clicked');
                this.processLater(data);
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
    if(typeof(navParams.get('order'))!=='undefined')
    {
      this.zone.run(() => {
          this.orders.push(navParams.get('order'));
        });
    }  
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
          this.userData.initStorage('user',(res)=>{
              console.log('table created for user');
          });
        }
        if(this.person=='shop')
          {
            this.listen(this.details.shopid);
            this.userData.initStorage('shop',(res)=>{
                console.log('table created for shop');
            });
          }
      }
      else
      {
        this.userData.getPerson((data)=>{
          this.userData.getAccountDetails(data,(res)=>{
              this.zone.run(()=>{
                this.title=res.name;
                this.person=data;
              });
          },(err)=>{
              console.log(err);
          })
        },
          (error)=>{
              console.log(error);
          })
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
  acknowledge(data,time)
  {
    var res=JSON.stringify(data);
    this.zone.run(() => {
           this.orders.push(data);
            });
    this.updateStatus(data,time,1);
  }
  processLater(res)
  {
    var alert = Alert.create({
                  title: 'Delay',
                  subTitle: 'Tell the user how much do they have to wait for their order!',
                  inputs: [
                        {
                          name: 'timeip',
                          placeholder: 'Time',
                          type:'Number',
                          '[(ngModel)]':'timedel'
                        },
                      ],
                    buttons: [
                      {
                        text: 'Cancel',
                        handler: data => {
                          console.log('Cancel clicked');
                        }
                      },
                      {
                        text: 'Save',
                        handler: data => {
                          //console.log('Saved clicked');
                          this.acknowledge(res,data.timeip);
                        }
                      }
                    ]
                });
                this.nav.present(alert);
  }
  updateStatus(res,time,status)
  {
     
      this.zone.run(()=>{
          if(status==2)
          {
          var i=this.orders.indexOf(res);
          this.orders.splice(i,1);
          }
          });   
      var url = 'https://print-yadunandan004.c9users.io:8080/orders/updateStatus';
     cordovaHTTP.post(url, {
    id: res._id,
    sts:status,
    user:res.user,
    time:time
    },{'Content-type' :  'application/json'},response=>{
        console.log('response sent');
          
      });
  }
  download(path,user)
  {
    //var dataDir = cordova.file.root.getDirectory("pxData", {create: true});
    var filename=path.substr(path.lastIndexOf('/')+1);
    var url = 'https://vfs-gce-ae-74-2.c9.io/vfs/2541302/9cV0YVjAkCKFXoNR/workspace/printage/uploads/'+user+'/'+filename+'?download&isfile=1'
    var fileTransfer = new FileTransfer();
    var targetPath = cordova.file.externalRootDirectory + filename;
     fileTransfer.download(url, targetPath,
        (result) => {
            alert("Download Success");
        },
        (error) => {
            console.log("error");
        }
    );
  }

}
