import {Page,NavController,NavParams,Alert,Platform,Storage} from 'ionic-framework/ionic';
import {Inject} from 'angular2/core';
import {SignupPage} from '../signup/signup';
import {UserData} from '../../providers/user-data/user-data';
/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {

  static get parameters() {
    return [[NavController],[NavParams],[Platform],[UserData]];
  }
  constructor(nav,navParams,platform,userData) {
  		this.nav = nav;
      this.userData=userData;
      this.platform=platform;
      this.listen();
      this.userData = userData;    
  }
  	listen()
    {
      this.platform.ready().then(() => {
        var socket=io('http://print-yadunandan004.c9users.io:8080/');
        socket.on('test_msg',(data)=>{
          console.log(data);
          var alert = Alert.create({
                  title: 'Response',
                  subTitle: data,
                  buttons: ['Dismiss']
                });
                this.nav.present(alert);
        });
      });
    }
    signup(event, item) {

     this.nav.push(SignupPage);
  }
  	print(event,item){
  		//this.nav.push(PrintPage);
  	}
      logger()
    {
      var url = 'https://print-yadunandan004.c9users.io:8080/users/readuser';
     cordovaHTTP.post(url, {
    email: this.email,
    pass: this.pass
    },{'Content-type' :  'application/json'},response=>{
    try {
        
        var alert = Alert.create({
                  title: 'Response',
                  subTitle: JSON.parse(response.data),
                  buttons: ['Dismiss']
                });
                this.nav.present(alert);
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
}
