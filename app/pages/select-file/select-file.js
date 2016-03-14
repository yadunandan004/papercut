import {Page, NavController,Platform,Alert} from 'ionic-framework/ionic';
import {UserData} from '../../providers/user-data/user-data';
import {ShopselPage} from '../shopsel/shopsel';
/*
  Generated class for the SelectFilePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/select-file/select-file.html',
  providers:[UserData]
})
export class SelectFilePage {
  static get parameters()
  {
    return [[NavController],[Platform],[UserData]];
  }
  constructor(nav,platform,userData) {
    this.nav = nav;
    this.platform=platform;
    this.files=new Array(); //file path, Name,option,copy
    this.supload=0;
    this.userData=userData;
    this.name="B/W";
    this.totalFiles=0;
  }
  toggle(event)
  {
    //alert(this.checked);
    if(this.checked===false)
    {
      this.name="B/W";
      this.userData.file['option']="Color";
    }
    if(this.checked===true)
    {
      
      this.name="Colour";
      this.userData.file['option']="B/W";
    }
  }
  selectFile()
  {    
     filechooser.open({},(data)=>{
        var file=new Object();
        file.path='';
        file.name='';
        file.copies=1;
        file.option='B/W';
       var filepath=data.filepath;
        this.totalFiles++;
        file.path=filepath;
        file.name=filepath.substr(filepath.lastIndexOf('/')+1);
        this.files.splice(0,0,file);
     },(error)=>{
      alert(error);
     }); 
  }
  takePhoto() {
    this.platform.ready().then(() => {
      var options = {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: true
      };
      // https://github.com/apache/cordova-plugin-camera#module_camera.getPicture
      navigator.camera.getPicture(
        (data) => {
          var file=new Object();
        file.path='';
        file.name='';
        file.copies=1;
        file.option='B/W';
        this.totalFiles++;
        file.path=data;
        file.name=data.substr(data.lastIndexOf('/')+1);
        this.files.splice(0,0,file);
        }, (error) => {
          alert(error);
        }, options
      );
    });
  }
  upload()
  {
    if(this.totalFiles>0)
    {
      for(var i=0;i<this.files.length;i++)
      {
        this.uploadFile(this.files[i].path,this.files[i].name);
      }
      
        this.nav.push(ShopselPage,{src:this.files});
    }
    else
    {
       var alert = Alert.create({
      title: 'Can\'t Upload!',
      subTitle: 'You haven\'t selected any file!!',
      buttons: ['Ok']
      });
      this.nav.present(alert);
    }
  }

  uploadFile(filepath,filename)
  {
    //var filepath=data.filepath;
        function win(r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            this.files.shift();
            this.supload++;
        }

        function fail(error) {
            console.log("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        }
        var uri = encodeURI("http://print-yadunandan004.c9users.io:8080/prints/addpage");
        var options = new FileUploadOptions();
        options.fileKey="docs";
        options.fileName=filename;
        var params = {};
        params.user = "abdulla@gmail.com";
        options.params=params;

        var ft = new FileTransfer();
        ft.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
                loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
            } 
            else {
                loadingStatus.increment();
            }
        };

        ft.upload(filepath, uri, win, fail, options); 
  }

}
