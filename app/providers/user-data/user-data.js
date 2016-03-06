import {Injectable} from 'angular2/core';
import {Storage, SqlStorage,LocalStorage,Platform} from 'ionic-framework/ionic'; 

/*
  Generated class for the UserData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserData {
static get parameters() {
    return [[Platform]];
  }
  constructor(platform) {
    this.platform=platform;
    this.user='yadu'; 
  }

  initStorage(person)
  { 
    this.storage = new Storage(SqlStorage);
    var quer='';
       if(person=='user')
       { 
        quer='CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, shopname TEXT, shopid TEXT,pages TEXT,amount INTEGER,date TEXT,completion INTEGER)';
       }
       else if(person=='shop')
       {
        quer='CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pages TEXT,amount INTEGER,date TEXT,completion INTEGER)';
       } 
            this.storage.query(quer).then((data) => {
                console.log("TABLE CREATED -> " + JSON.stringify(data.res));
          }, (error) => {
                console.log("ERROR -> " + JSON.stringify(error.err));
        });
  }
  createPerson(person,details)
  {
    this.storage = new Storage(SqlStorage);
    
     var qr="CREATE TABLE IF NOT EXISTS person (type TEXT)";  
    this.storage.query(qr).then((data)=>{
       qr="SELECT * FROM person";
    this.storage.query(qr).then((data)=>{
      if(data.res.rows.length==0)
    {
        qr="INSERT INTO person (type) VALUES('"+person+"')";
        this.storage.query(qr).then((data)=>{
          //alert(JSON.stringify(data.res));
           this.createAccount(person,details);
        },(error)=>{
          alert(JSON.stringify(error.err));
        });
      }
      else
    {
      alert('user session already present');
    }
    }

    ,(error)=>{
      console.log(error);
    }
  );
    
    
  },(error)=>{
      alert(JSON.stringify(error.err));
    });
  }
  getPerson()
  {
    this.storage = new Storage(SqlStorage);
    var qr="SELECT * FROM person";
    this.storage.query(qr).then(data=>{
        alert(data.res.rows.item(0).type);
    },error=>{
        alert(JSON.stringify(error.err))
    });
  }
  islogged()
  {
    this.storage=new Storage(SqlStorage);
    var qr='SELECT * FROM person';
    this.storage.query(qr).then((data)=>{
      if(data.res.rows.length>0)
      {
        return 1;
      }
      else
       {
        return 0;
       } 
    },(error)=>{
        alert(JSON.stringify(error.err));
    });
  }
  createAccount(person,data)
  {
    this.storage = new Storage(SqlStorage);
    var qr='';
    if(person=='user')
    {
        qr="CREATE TABLE IF NOT EXISTS user (email TEXT PRIMARY KEY,name TEXT,college TEXT,city TEXT,pass TEXT,phone TEXT)";
    }
    else if(person=='shop')
    {
      qr="CREATE TABLE IF NOT EXISTS shop (shopid TEXT PRIMARY KEY,name TEXT,city TEXT,email TEXT,lat INTEGER,lng INTEGER,pass TEXT,phone TEXT,fare INTEGER)";
    } 
    this.storage.query(qr).then((data)=>{
      if(person=='user')
      {
       qr="INSERT INTO user (email,name,college,city,pass,phone) VALUES('"+data.email+"','"+data.name+"','"+data.college+"','"+data.city+"','"+data.pass+"','"+data.phone+"')";
      }
      else if(person=='shop')
      {
        qr="INSERT INTO shop (shopid,name,city,email,lat,lng,pass,phone,fare) VALUES('"+data.shopid+"','"+data.name+"','"+data.city+"','"+data.email+"','"+data.lat+"','"+data.lng+"','"+data.pass+"','"+data.phone+"','"+data.fare+"')";
      }
      this.storage.query(qr).then((data)=>{
        alert(JSON.stringify(data.res));
      },(error)=>{
        alert(JSON.stringify(error.err));
      });
    },
    (error)=>{
          console.log("ERROR -> " + JSON.stringify(error.err));
    }); 
  }
  checkAccount(person)
  {
    this.storage = new Storage(SqlStorage);
    var qr='SELECT * FROM '+person;
    this.storage.query(qr).then((data)=>{
      console.log(data);
    },(error)=>{
      console.log(error);
    });
  }
  newOrder()
  {
    this.storage = new Storage(SqlStorage);
    if(person=='user')
       { 
        quer='INSERT INTO orders (shopname , shopid ,pages ,amount ,date ,completion ) values ()';
       }
       else if(person=='shop')
       {
        quer='INSERT INTO orders ( user , pages ,amount ,date ,completion )values()';
       } 
  }
  logout(person)
  { 
    this.storage = new Storage(SqlStorage);
    var qr="DROP TABLE IF EXISTS person";
    this.storage.query(qr).then((data)=>{
      qr="DROP TABLE IF EXISTS "+ person;
      this.storage.query(qr).then((data)=>{
        //alert(JSON.stringify(data.res)); 
         navigator.app.exitApp();
      },(error)=>{
          alert("ERROR -> " + JSON.stringify(error.err));
      });
    },(error)=>{
      console.log("ERROR -> " + JSON.stringify(error.err));
    }); 
  }  
}

