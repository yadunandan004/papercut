import {Page,NavController,Platform,Alert} from 'ionic-framework/ionic';

/*
  Generated class for the SignupPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/signup/signup.html',
})
export class SignupPage {
  static get parameters() {
    return [[NavController],[Platform]];
  }
  constructor(nav,platform) {
    this.nav = nav;
    this.platform=platform;
		this.profile='usr';
		this.getcords();
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
			this.addshop();

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
    },{'Content-type' :  'application/json'},response=>{
		    try {
		        
		        var alert = Alert.create({
		                  title: 'Response',
		                  subTitle: response.data,
		                  buttons: ['Dismiss']
		                });
		                this.nav.present(alert);
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
    },{'Content-type' :  'application/json'},response=>{
		    try {
		        
		        var alert = Alert.create({
		                  title: 'Response',
		                  subTitle: response.data,
		                  buttons: ['Dismiss']
		                });
		                this.nav.present(alert);
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
	 },(error)=>{
	 		console.log(error);
	 },options);
	});
	}
}
