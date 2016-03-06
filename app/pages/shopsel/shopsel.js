import {Page,Platform, NavController,ActionSheet} from 'ionic-framework/ionic';

/*
  Generated class for the ShopselPage page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/shopsel/shopsel.html',
})
export class ShopselPage {
  static get parameters()
  {
    return [[NavController],[Platform]];
  }
  constructor(nav,platform) {
    this.nav = nav;
     this.platform = platform;
    this.map = null;
    this.mapInitialised = false;  
    this.marker=null;
    this.loadMap();
    this.shpArr;
    //if(typeof cordova.plugins.settings.openSetting != undefined)
    //{
    //cordova.plugins.settings.openSetting("location_source", 
     // function(){console.log("opened location_source settings")},
      //function(){console.log("failed to open location_source settings")});
    //}

  }

  loadshops()
  {
      var url = 'https://print-yadunandan004.c9users.io:8080/shops/findshop';
     cordovaHTTP.post(url, {
    city:'Bangalore',  
    lat: this.lat,
    lng: this.lng
    },{'Content-type' :  'application/json'},(response)=>{
    try {
        var resdat=JSON.parse(response.data);
        this.shpArr=resdat.shops;
         //var navg=this.nav;
        for(var i=0;i<this.shpArr.length;i++)
        {
         var LatLng={lat:this.shpArr[i].lat,lng:this.shpArr[i].lng};
          this.addMarker(LatLng);   
        }
        //alert(resdat.shops[0].name);
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
          var mapOptions = {
              center: latLng,
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP
          } 
          this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
          this.loadshops();
      },
      (error) => {
          console.log(error);
      }, options
  );
 });

}
addMarker(LatLng){
 var navg=this.nav;
 var sarray=this.shpArr;
   var marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: LatLng
  });
 
    var sname='';
    var fare='';
    marker.addListener('click',function(){

      for(var i=0;i<sarray.length;i++)
      {
        //alert(sarray[i].lat+'  '+sarray[i].lng);
        if(this.position.lat().toFixed(7)==sarray[i].lat && this.position.lng().toFixed(7)==sarray[i].lng)
        {
          sname=sarray[i].name;
          fare=sarray[i].fare;
          //alert(sname);
        }
      }
      var actionSheet = ActionSheet.create({
      title: sname,
      buttons: [
        {
          text: fare+' Rs',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Print',
          handler: () => {
            console.log('Archive clicked');
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

    navg.present(actionSheet);
    });

}
}