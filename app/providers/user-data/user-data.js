import {Injectable} from 'angular2/core';
import {Storage, SqlStorage} from 'ionic-framework/ionic'; 

/*
  Generated class for the UserData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserData {

  constructor() {

    this.user='yadu';
  }

  initStorage()
  {
    this.storage = new Storage(SqlStorage);
      var quer='CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT)';
            this.storage.query(quer).then((data) => {
                console.log("TABLE CREATED -> " + JSON.stringify(data.res));
          }, (error) => {
                console.log("ERROR -> " + JSON.stringify(error.err));
        });
  }
  addUser()
  {
    
  }  
  
}

