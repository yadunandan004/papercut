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
    this.orders=new Array();
  }
  saveOrder(order)
  {
    this.orders.push(order);
    alert(this.orders[0].name);
  }
  getOrder()
  {
    return this.orders[0];
  }
  initStorage(person,fn)
  { 
    this.storage = new Storage(SqlStorage);
    var quer='';
     if(person=='user')
     { 
      quer='CREATE TABLE IF NOT EXISTS orders (orderid TEXT PRIMARY KEY ,shopid TEXT,pages TEXT,completion INTEGER,date TEXT)';
     }
     else if(person=='shop')
     {
      quer='CREATE TABLE IF NOT EXISTS orders (orderid TEXT PRIMARY KEY , user TEXT, pages TEXT,completion INTEGER,date TEXT)';
     } 
          this.storage.query(quer).then((data) => {
            fn(1);
             // alert("TABLE CREATED -> " + JSON.stringify(data.res));
        }, (error) => {
              console.log("ERROR -> " + JSON.stringify(error.err));
      });
  }
  createPerson(details,fn)
  {
    this.storage = new Storage(SqlStorage);
     var qr="CREATE TABLE IF NOT EXISTS person (type TEXT)";  
    this.storage.query(qr).then((data)=>{
       qr="SELECT * FROM person";
    this.storage.query(qr).then((data)=>{
      if(data.res.rows.length==0)
      {
        qr="INSERT INTO person (type) VALUES('"+details.type+"')";
        this.storage.query(qr).then((data)=>{
            this.createAccount(details,(data)=>{
              fn(data);
            });
        },(error)=>{
          alert(JSON.stringify(error.err)+ ' from device');
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
  getPerson(fn,er)
  {
    this.storage = new Storage(SqlStorage);
    var qr="SELECT * FROM person";
    this.storage.query(qr).then(data=>{
        fn(data.res.rows.item(0).type);
    },error=>{
        //console.log(JSON.stringify(error.err))
        er(1);
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
  createAccount(data,fn)
  {
    this.storage = new Storage(SqlStorage);
    var person=data.type;
    var qr='';
    if(person=='user')
    {
        qr="CREATE TABLE IF NOT EXISTS user (email TEXT PRIMARY KEY,name TEXT,college TEXT,pass TEXT,phone TEXT)";
    }
    else if(person=='shop')
    {
      qr="CREATE TABLE IF NOT EXISTS shop (shopid TEXT PRIMARY KEY,name TEXT,city TEXT,email TEXT,lat INTEGER,lng INTEGER,pass TEXT,phone TEXT,fare INTEGER)";
    } 
    this.storage.query(qr).then((res)=>{
      if(person=='user')
      {
       qr="INSERT INTO user (email,name,college,pass,phone) VALUES('"+data.email+"','"+data.name+"','"+data.college+"','"+data.pass+"','"+data.phone+"')";
      }
      else if(person=='shop')
      {
        qr="INSERT INTO shop (shopid,name,city,email,lat,lng,pass,phone,fare) VALUES('"+data.shopid+"','"+data.name+"','"+data.city+"','"+data.email+"','"+data.lat+"','"+data.lng+"','"+data.pass+"','"+data.phone+"','"+data.fare+"')";
      }
      this.storage.query(qr).then((res)=>{
          fn(1);
      },(error)=>{
        alert(JSON.stringify(error.err)+' form device');
      });
    },
    (error)=>{
          console.log("ERROR -> " + JSON.stringify(error.err));
    }); 
  }
  getAccountDetails(type,fn,er)
  {
    this.storage=new Storage(SqlStorage);
    var qr='SELECT * FROM '+type;
     this.storage.query(qr).then((data)=>{
          fn(data.res.rows.item(0));
       },(error)=>{
          er(error.err);
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
  newOrder(person,order,fn)
  {
    this.storage = new Storage(SqlStorage);
    var src=this.convertArraytoString(order.src);
    var quer='';
    var completion=0;
    if(order.completed=='true')
    {
      completion=1;
    }
    if(person=='user')
       { 
        quer="INSERT INTO orders (orderid,shopid ,pages,completion,date ) VALUES('"+order._id+"','"+order.shopid+"','"+src+"','"+completion+"','"+order.date.toString()+"')";
        //alert(src+'\n'+order.date.toString());
       }
       else if(person=='shop')
       {
        quer="INSERT INTO orders (orderid, user , pages ,completion,date)VALUES('"+order._id+"','"+order.user+"','"+src+"','"+completion+"','"+order.date.toString()+"')";
       }
       this.storage.query(quer).then((data)=>{
          fn(1);
       },(error)=>{
          alert(error.err);
       });
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
  convertArraytoString(array)
  {
    var Str='';
    for(var i=0;i<array.length;i++)
    {
      Str=Str+JSON.stringify(array[i]);
    }
    return Str;
  } 
  convertStringtoArray()
  {

  } 
}

