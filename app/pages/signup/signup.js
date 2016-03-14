import {Page,NavController,Platform,Alert} from 'ionic-framework/ionic';
import {UserData} from '../../providers/user-data/user-data';
import {PrintPage} from '../print/print';

/*
  Generated class for the SignupPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/signup/signup.html',
  providers:[UserData]
})
export class SignupPage {
  static get parameters() {
    return [[NavController],[Platform],[UserData]];
  }
  constructor(nav,platform,userData) {
    this.nav = nav;
    this.userData=userData;
    this.platform=platform;
		this.profile='usr';
		
  }
  	signup()
	{
		if(this.profile=='usr')
		{
			//alert('selected user profile');
			this.adduser();
		}
		else if (this.profile=='shp')
		{
			//alert('shop profile selected \n'+this.shoplat+'\n'+this.shoplng);
			this.getcords();
		}
	}
	 adduser()
    {
      var url = 'https://print-yadunandan004.c9users.io:8080/users/adduser';
     cordovaHTTP.post(url, {
    name:this.username,
    college:this.college,
    city:this.city,
    email: this.useremail,
    pass: this.pass,
    phone:this.phone
    },{'Content-type' :  'application/json'},(response)=>{
		    try {
		        var resdat=JSON.parse(response.data);
		        if(resdat!=0){
		        var alert = Alert.create({
		                  title: 'Response',
		                  subTitle: 'Signed in Successfully',
		                  buttons: ['Dismiss']
		                });
		                this.nav.present(alert);
		                this.userData.createPerson('user',resdat,(data)=>{
				          if(data==1)
				          {
				            this.nav.push(PrintPage);
				          }
	        			});
		            }
		            else{
		            	alert('Couldn\'t signup');
		            }
		    } catch(e) {
		        console.error("JSON parsing error");
		        }
    	});
    }
     addshop()
    {
      var url = 'https://print-yadunandan004.c9users.io:8080/shops/addshop';
     cordovaHTTP.post(url, {
    name:this.shopname,
    city:this.city,
    email: this.shopemail,
    lat:this.shoplat,
    lng:this.shoplng,
    pass: this.pass,
    phone:this.phone
    },{'Content-type' :  'application/json'},(response)=>{
		    try {
		        var resdat=JSON.parse(response.data);
		        if(resdat!=0){
		        var alert = Alert.create({
		                  title: 'Response',
		                  subTitle: 'Signed in Successfully',
		                  buttons: ['Dismiss']
		                });
		                this.nav.present(alert);
		                 this.userData.createPerson('shop',resdat,(data)=>{
				          if(data==1)
				          {			            
				            this.nav.push(PrintPage);
				          }
        			});
		           }
		           else
		           {
		           	alert('couldn\'t signup');
		           }
		    } catch(e) {
		        console.error("JSON parsing error");
		        }
    	});
    }
    	getcords(){
		var options = {timeout: 10000, enableHighAccuracy: true};
	this.platform.ready().then(() => {
	 navigator.geolocation.getCurrentPosition((position)=>{
	 	this.shoplat=position.coords.latitude;
	 	this.shoplng=position.coords.longitude;
	 	this.addshop();
	 },(error)=>{
	 		console.log(error);
	 },options);
	});
	}
}
