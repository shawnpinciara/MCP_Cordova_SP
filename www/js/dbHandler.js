// var db = null;
// document.addEventListener('deviceready', function() {
//   window.sqlitePlugin.echoTest(function() {
//     console.log('ECHO test OK');
//   });
//   // db = window.sqlitePlugin.openDatabase({
//   //   name: 'my.db',
//   //   location: 'default',
//   // });
// });

var databaseHandler = {
  db: null,

  createDatabase: function () {
    console.log("Creating database...");
    this.db = window.openDatabase(
      "channel_db.db",
      "1.0",
      "db photos",
      1000000);
    this.db.transaction(
      function (tx) {

        // tx.executeSql('CREATE TABLE IF NOT EXISTS Post (uid INTEGER, pid INTEGER PRIMARY KEY, username Text, pversion INTEGER NOT NULL, type TEXT NOT NULL)', [],
        //   function (tx, results) {},
        //   function (tx, error) {
        //     console.log("Error while creating the table 2: " + error.message);
        //   }
        // );

        tx.executeSql('CREATE TABLE IF NOT EXISTS profile_imgs (uid INTEGER PRIMARY KEY, pversion INTEGER NOT NULL, picture TEXT)', [],
          function (tx, results) {},
          function (tx, error) {
            console.log("Error while creating the table 3: " + error.message);
          }
        );

        tx.executeSql('CREATE TABLE IF NOT EXISTS post_imgs (pid INTEGER PRIMARY KEY, content TEXT)', [],
          function (tx, results) {},
          function (tx, error) {
            console.log("Error while creating the table 4: " + error.message);
          }
        );

      },
      function (error) {
        console.log("Transaction error: " + error.message);
      },
      function () {
        console.log("Create DB transaction completed successfully");
      }
    );
  },

  //PROFILE:

  addProfileImage: function (uid,pversion,picture) {
    this.db.transaction(function (transaction) {
      transaction.executeSql('INSERT INTO profile_imgs (uid, pversion, picture) VALUES (?, ?, ?)', [uid, pversion, picture], function (tx, results) {
          console.log("DB: Post " + uid + " content inserted");
        },
        function (error) {
          console.log("DB: ERROR! while inserting profile image " + uid + " error: " + error.message);
        });
    });
  },

  updateProfileImage: function (uid,pversion,picture) {
    this.db.transaction(function (transaction) {
      transaction.executeSql(
        `UPDATE profile_imgs SET pversion = ?,
                              picture = ?
        WHERE uid = ?
      `, [pversion,picture,uid], function (tx, results) {
          console.log("DB: Post " + uid + " content updated with picture: " + picture);
        },
        function (error) {
          console.log("DB: ERROR! while inserting profile image " + uid + " error: " + error.message);
        });
    });
  },

  isProfilePicInDb: function (uid,pid,pversion) {
    this.db.transaction(function (transaction) {
      transaction.executeSql('SELECT * FROM profile_imgs WHERE EXISTS(SELECT 1 FROM profile_imgs WHERE uid=?)', [uid], function (tx, results) {
        console.log("DB: Checking if uid " + uid + " exists in db...");
        for (var k = 0; k < results.rows.length; k++) {
          var row = results.rows.item(k);
          if (row.uid == uid) {
            break
          }
          //console.log(row);
        }
        console.log(row);
        if (row == undefined) {
          c("profilePicIsNOTinDb");
          //prendi foto da internet
          getProfilePic(pid,uid,false,pversion);
        } else {
          c("profilePicIsInDb");
          //se pversion presa da rete é maggiore di quella del db--> update del db
          if (row.picture == null) { //se nel db viene salvata un immagine nulla, impostare un immagine bianca
            databaseHandler.updateProfileImage(uid,0,"R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
            addProfilePictureToList(pid,"R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
          }
          if (pversion > row.pversion) {
            console.log(" Updating picture for pid " + row.uid);
            getProfilePic(pid,uid,true,pversion);
          } else {
            addProfilePictureToList(pid,row.picture);
          }
          
          //databaseHandler.getProfileImage(pid,uid);
        }
      })
    });
  },

  getProfileImage: function (uid,pid) {
      this.db.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM profile_imgs WHERE uid=?', [uid], function (tx, results) { //
              //console.log("DB: Retriving profile of: " + uid);
          if (results != null && results.rows != null) {
            for (var k = 0; k < results.rows.length; k++) {
              var row = results.rows.item(k); //oggetto: row.uid,row.pversion,row.picture
              c(k + ": " + row.uid);
              if (row == undefined) {
                console.error("DB: error while fetching profile picture, results: " + results + ", results.rows: " + results.rows);
                
              } else {
                console.log("DB: resolving for: " + row);
               
                }
              }
            }
        }, function (tx, error) {
            console.error("DB: Error while retrieving profile picture: " + error.message);
        });    
      });
  },

  deleteProfileImgsDb: function (uid) {
    this.db.transaction(function (transaction) {
      transaction.executeSql('DELETE FROM profile_imgs', [uid], function (tx, results) {
          console.error("DB profile_imgs DELETED");
        },
        function (error) {
          console.log("DB: ERROR! while deleting profile_imgs");
        });
    });
  },

  //POST:

  addPostImage: function (pid,content) {
    this.db.transaction(function (transaction) {
      transaction.executeSql('INSERT INTO post_imgs (pid, content) VALUES (?, ?)', [pid, content], function (tx, results) {
          console.log("DB: Post " + pid + " content inserted");
        },
        function (error) {
          console.log("DB: ERROR! while inserting post " + pid + " error: " + error);
        });
    });
  },

  isPostImageInDb: function (pid) {
    this.db.transaction(function (transaction) {
      transaction.executeSql('SELECT * FROM post_imgs WHERE EXISTS(SELECT 1 FROM profile_imgs WHERE pid=?)', [pid], function (tx, results) {
        console.log("DB: Checking if pid " + pid + " exists in db...");
        for (var k = 0; k < results.rows.length; k++) {
          var row = results.rows.item(k);
          if (row.pid == pid) {
            break
          }
          //console.log(row);
        }
        console.log(row);
        if (row == undefined) {
          c("profilePicIsNOTinDb");
          //prendi foto da internet
          requestMessageImage(pid);
        } else {
          c("PostImageIsInDb");
          addPostImageToList(row.content,pid);
          //databaseHandler.getProfileImage(pid,uid);
        }
      })
    });
  },

  deletePostImgsDb: function (uid) {
    this.db.transaction(function (transaction) {
      transaction.executeSql('DELETE FROM post_imgs',[uid], function (tx, results) {
          console.error("DB post_imgs DELETED");
        },
        function (error) {
          console.log("DB: ERROR! while deleting post_imgs");
        });
    });
  },

}