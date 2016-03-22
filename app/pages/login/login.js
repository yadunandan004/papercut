import {Page,NavController,NavParams,Alert,Platform} from 'ionic-framework/ionic';
import {Inject} from 'angular2/core';
import {SignupPage} from '../signup/signup';
import {PrintPage} from '../print/print';
import {UserData} from '../../providers/user-data/user-data';

//import {UserData} from '../../providers/user-data/user-data';
/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/login/login.html',
  providers:[UserData]
})
export class LoginPage {

  static get parameters() {
    return [[NavController],[NavParams],[Platform],[UserData]];
  }
  constructor(nav,navParams,platform,userData) {
  		this.nav= nav;
      this.userData=userData;             
      this.platform=platform;
      this.checkConnection(); 
  }
    signup(event, item) {
     this.nav.push(SignupPage);
    }
      logger()
    {
      var url = 'https://print-yadunandan004.c9users.io:8080/users/readuser';
     cordovaHTTP.post(url, {
    email: this.email,
    pass: this.pass
    },{'Content-type' :  'application/json'},response=>{
    try {
        var resdat=JSON.parse(response.data);
        this.userData.createPerson(resdat,(data)=>{
          if(data==1)
          {            
            this.nav.setRoot(PrintPage,{data:resdat}); 
          }
        });

        } catch(e) {
        console.error("JSON parsing error");
        }
      });
    }

    alerter()
    {
      var alert = Alert.create({
              title: 'Response',
              subTitle: 'response',
              buttons: ['Dismiss']
            });
            this.nav.present(alert);
    }
    checkConnection()
    {
       var networkState = navigator.connection.type;
       if(networkState=='none')
       {
          alert('please enable network connection');
       }
    } 
}
