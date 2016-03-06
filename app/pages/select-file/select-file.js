import {Page, NavController,Platform} from 'ionic-framework/ionic';
import {UserData} from '../../providers/user-data/user-data';
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
    this.files=new Array();
    this.files.push('No files selected yet');
    this.userData=userData;
    this.name="B/W";
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
       var filepath=data.filepath;
        this.files.splice(0,0,filepath);
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
        this.files.splice(0,0,data);
        }, (error) => {
          alert(error);
        }, options
      );
    });
  }
  upload()
  {
    
    for(var i=0;i<this.files.length;i++)
    {
      this.uploadFile(this.files[i]);
    }
  }
  uploadFile(filepath)
  {
    //var filepath=data.filepath;
        function win(r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            this.files.shift();
        }

        function fail(error) {
            console.log("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        }
        var uri = encodeURI("http://print-yadunandan004.c9users.io:8080/prints/addpage");
        var options = new FileUploadOptions();
        options.fileKey="docs";
        options.fileName=filepath.substr(filepath.lastIndexOf('/')+1);
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
