import {Page, NavController,Platform,NavParams} from 'ionic-framework/ionic';
import {SelectFilePage} from '../select-file/select-file';
import {UserData} from '../../providers/user-data/user-data';
import {NgZone} from "angular2/core";

/*
  Generated class for the PrintPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/print/print.html',
  providers:[UserData]
})
export class PrintPage {
  static get parameters()
  {
    return [[NavController],[Platform],[NavParams],[UserData]];
  }
  constructor(nav,platform,navParams,userData) {

    this.nav = nav;
    this.zone = new NgZone({enableLongStackTrace: false});
    this.navParams=navParams;
    this.platform=platform;
    this.title="";
    this.userData=userData;
    this.person='';
    this.orders=[];
    this.userData.getPerson((data)=>{
      this.person=data;
      //alert(this.person);
      if(this.person=='shop')
      {
        this.userData.getAccountDetails(this.person,(data)=>{
          this.listen(data.shopid);
          this.zone.run(() => {
           this.title=data.name; 
            });
        },(err)=>{
            alert(err);
        });    
      }
      else if(this.person=='user')
      {
        this.userData.getAccountDetails(this.person,(data)=>{
          this.zone.run(() => {
           this.title=data.name;
           alert('called'); 
            });
        },(err)=>{
            alert(err);
        });
      }
    },(err)=>{
      alert('couldn\'t find any log in database');
    });
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
      
      if(typeof(navParams.get('data'))!=='undefined')
      {
        this.details=navParams.get('data');
      }
      if(typeof(navParams.get('msg'))!=='undefined')
      {
        //alert(navParams.get('msg'));
      }
    });
  }
  selectFile(event,item){
  	this.nav.push(SelectFilePage);
  }
  
  listen(shpid)
  {
    var socket=io('https://print-yadunandan004.c9users.io:8080');
     socket.on('connect',function(){
        socket.emit('join',shpid);
       });
      socket.on('new_order',(data)=>{
        //        alert(JSON.stringify(data));
        this.zone.run(() => {
           this.orders.push(JSON.stringify(data));
            });
      });   
  }
}
