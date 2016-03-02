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
    this.listen();
  }
 listen()
    {
      this.platform.ready().then(() => {
        var socket=io('http://print-yadunandan004.c9users.io:8080/');
        socket.on('mark_res',(data)=>{
          console.log(data);
          var actionSheet = ActionSheet.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Archive',
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

    this.nav.present(actionSheet);
        });
      });
    }

  loadMap(){
  var options = {timeout: 10000, enableHighAccuracy: true};
 this.platform.ready().then(() => {
  navigator.geolocation.getCurrentPosition(
 
      (position) => {
          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
          var mapOptions = {
              center: latLng,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
          }
 
          this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
          
      },
 
      (error) => {
          console.log(error);
      }, options
 
  );
 });

}
addMarker(){
 
   this.marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
  });
 
    this.marker.addListener('click',function(){
      var socket=io('http://print-yadunandan004.c9users.io:8080/');
      socket.emit('marker','add');
    });

}
}


