import {Page,Platform, NavController,ActionSheet,NavParams,Alert} from 'ionic-framework/ionic';
import {UserData} from '../../providers/user-data/user-data';
import {PrintPage} from '../print/print';
/*
  Generated class for the ShopselPage page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/shopsel/shopsel.html',
  providers:[UserData]
})
export class ShopselPage {
  static get parameters()
  {
    return [[NavController],[Platform],[UserData],[NavParams]];
  }
  constructor(nav,platform,userData,navParams) {
    this.nav = nav;
    this.userData=userData;
    this.platform = platform;
    this.map = null;
    this.mapInitialised = false;  
    this.marker=null;
    this.loadMap();
    this.files=navParams.get('src');
    this.shpArr;
    this.city='';
    CheckGPS.check(function(){
    //GPS is enabled!
    },
    function(){
      //GPS is disabled!
      if(typeof cordova.plugins.settings.openSetting != undefined)
      {
      cordova.plugins.settings.openSetting("location_source", 
        function(){console.log("opened location_source settings")},
        function(){console.log("failed to open location_source settings")});
      }

    });
    
  }

  loadshops()
  {
      var url = 'https://print-yadunandan004.c9users.io:8080/shops/findshop';
     cordovaHTTP.post(url, {
    city:this.city,  
    lat: this.lat,
    lng: this.lng
    },{'Content-type' :  'application/json'},(response)=>{
    try {
        var resdat=JSON.parse(response.data);
        this.shpArr=resdat.shops;
        for(var i=0;i<this.shpArr.length;i++)
        {
         var LatLng={lat:this.shpArr[i].lat,lng:this.shpArr[i].lng};
          this.addMarker(LatLng);   
        }
        } catch(e) {
        console.error("JSON parsing error");
        }
      });
  }
  loadMap(){
  var options = {timeout: 10000, enableHighAccuracy: true};
 this.platform.ready().then(() => {
  navigator.geolocation.getCurrentPosition(
      
      (position) => {
          this.lat=position.coords.latitude;
          this.lng=position.coords.longitude;
          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.getcity(latLng,(data)=>{
            var mapOptions = {
              center: latLng,
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP
           } 
           this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
          /*var marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: latLng
            });*/
          this.loadshops();
          });   
      },
      (error) => {
          console.log(error);
      }, options
  );
 });
}
getcity(latlng,fn)
{
  var geocoder;
geocoder = new google.maps.Geocoder();
//var latlng = new google.maps.LatLng(latitude, longitude);

geocoder.geocode(
    {'latLng': latlng}, 
    (results, status)=> {

        if (status == google.maps.GeocoderStatus.OK) {

                if (results[0]) {

                    var add= results[0].formatted_address ;
                    //alert(add);
                    var  value=add.split(",");
                    var count=value.length;
                    //var country=value[count-1];
                   //var  state=value[count-2];
                     this.city=value[count-3].trim();
                      fn(1);
                    //alert("city name is: " + this.city);
                }
                else  {
                    alert("address not found");
                }
              }
         else {
            alert("Geocoder failed due to: " + status);
        }
    }
  );
}
addMarker(LatLng){
 var navg=this.nav;
 var sarray=this.shpArr;
   var marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: LatLng
  });
    var files=this.files;
    var sname='';
    var fare='';
    var shop={};
    var that=this;
    marker.addListener('click',function(){

      for(var i=0;i<sarray.length;i++)
      {
        //alert(sarray[i].lat+'  '+sarray[i].lng);
        if(this.position.lat().toFixed(7)==sarray[i].lat && this.position.lng().toFixed(7)==sarray[i].lng)
        {
          sname=sarray[i].name;
          fare=sarray[i].fare;
          shop=sarray[i];
          //alert(sname);
        }
      }
        that.presentdtls(sname,fare,shop);
    });

}
  
  presentdtls(sname,fare,shop)
  {
      var actionSheet = ActionSheet.create({
      title: sname,
      buttons: [
        {
          text: 'Print',
          role: 'destructive',
          handler: () => {
            this.userData.getAccountDetails('user',(data)=>{
              this.sendFile(data.email,shop);
            },(err)=>{
              alert(err);
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    this.nav.present(actionSheet);
  }
  sendOrder(shop,files,nav)
  {
     
     var prompt = Alert.create({
      title: 'Order',
      message: "Are you sure?",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: (data) => {
          }
        }
      ]
    });
     nav.present(prompt);
  }
  sendFile(email,shop)
  {
    var url="https://print-yadunandan004.c9users.io:8080/orders/neworder";
            cordovaHTTP.post(url,{
              shopid:shop.shopid,
              user:email,
              src:this.files
            },{'Content-type' :  'application/json'},(response)=>{
            var resdat=JSON.parse(response.data);
            this.userData.newOrder('user',resdat,(data)=>{
              if(data==1)
              {
                this.nav.setRoot(PrintPage,{msg:resdat});
              }
            });
            },(error)=>{
              alert(error);
            });
  }
}