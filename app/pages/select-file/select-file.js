import {Page, NavController,Platform} from 'ionic-framework/ionic';

/*
  Generated class for the SelectFilePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/select-file/select-file.html',
})
export class SelectFilePage {
  static get parameters()
  {
    return [[NavController],[Platform]];
  }
  constructor(nav,platform) {
    this.nav = nav;
    this.platform=platform;
    this.file="not selected";
  }
  selectFile()
  {
     var success = function(data) {
        alert(data.filepath);
        var filepath=data.filepath;
        function win(r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
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
    };

    var error = function(msg) {
        console.log( msg );
    };

    filechooser.open({},success,error); 

  }
  takePhoto() {
    this.platform.ready().then(() => {
      var options = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: true
      };
      // https://github.com/apache/cordova-plugin-camera#module_camera.getPicture
      navigator.camera.getPicture(
        (data) => {
          var imagedata = "data:image/jpeg;base64," + data;
          // this._zone.run(()=> this.images.unshift({
            // src: imagedata
           //}))
        }, (error) => {
          alert(error);
        }, options
      );
    });
  }
  uploadFile(event,item)
  {
    alert(this.file);
    cordovaHTTP.uploadFile("http://print-yadunandan004.c9users.io:8080/prints/addpage", {
    user:'abdulla@gmail.com'
    }, { Authorization: "OAuth2: token" }, "/storage/emulated/0/Download/_20160216_170813.JPG", "docs", function(response) {
        alert(response);
    }, function(response) {
        console.error(response.error);
    });
  }
}
