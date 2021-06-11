    var ctitle = "";
    var sid = "";
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const format = (...args) => args.shift().replace(/%([jsd])/g, x => x === '%j' ? JSON.stringify(args.shift()) : args.shift());
    $(function () {
        console.log("dom CHAT ready!");
        sid = localStorage.getItem("sid");
        // getChannel()
    });

    $("#chat_list").on("click", "li", function () {
        var projIndex = $(this).index();
        chat_name = $(this).text()
        if($(this).attr('id')[0] == "p") { //se il post é di tipo posizione
            let lid = $(this).attr('id').split(',')
            //openMapbox(lid[0].substring(1),lid[1],lid[2]); //prende solo la cifra del pid
            c(lid[0].substring(1));
            showScreen("#viewMapPage");
        } else if ($(this).attr('id')[0] == "i") {
            //impostare immagine grande
            //c($(this).html())
            let imgClicked = $(this).html().split('"')[11].replace(/\s/g, ''); //parse html per prendere stringa dell'immagine profilo
            $("#imgBig").attr('src',imgClicked);
            showScreen("#viewImagePage");
            $("body").css({"background-color":"black"})
            // $("#"+pid).attr('src')

        }
    });

    $("#sendPost").click(function () {
        let textMessage = $("#textPost").val();
        if (textMessage.length == 0) {
            alert("The message can't be empty!")
        } else if(textMessage.length>100) {
            alert("The message can't be longer than 100 characters!")
        } else {
            sendTextPost(textMessage);
        }
    })

    $("#posPost").click(function () {
        showScreen("#sendPositionPage");
    })

    $("#imgPost").click(function() {
        $('.inputImageToLoad').trigger('click');
    })

    $("#sendPosition").click(function () {
        // sendPosPost();
        //openMapboxSend(0,0);
        watchPosition()
    })

    //TODO: chiamata di rete per i messaggi
    function getChannel(chat_name) {
            ctitle = chat_name;
            $('.channel').text("@channel: " + ctitle);
            //console.log("sid " + sid);
            $.ajax({
                type: "POST",
                url: base_url + "getChannel.php",
                data: JSON.stringify({ "sid": sid , "ctitle": ctitle }),
                success: function (data) {
                    json = JSON.parse(data);
                    chat_posts = json.posts;
                    update_posts_list(chat_posts)
                    //console.log(chat_posts);
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            })
    }

    function update_posts_list(posts) {
        for (i = 0; i < posts.length; i++) {
            uid = posts[i].uid;
            name = posts[i].name;
            type = posts[i].type;
            pid = posts[i].pid;
            pversion = posts[i].pversion;

            if (type == "t") {
                content = posts[i].content
                addPostTextToList(pid,name,content);
                // getProfilePic(pid,uid);
                databaseHandler.isProfilePicInDb(uid,pid);
            } else if (type == "i") {
                //c(pid);
                $("#chat_list").append(format('<li class="list-group-item" id="i%s"> <img id="%s" src="src/default_photo_white.png" class="profile-pic" style="width:40px;height:40px;" align="left"></img><b><p>&emsp;%s:</p></b> <img src="src/default_photo_white.png" id="%s" class="post-image" width="100%" height="100%"/> </li>',uid,pid,name,pid));
                //requestMessageImage(pid,name);
                databaseHandler.isPostImageInDb(pid);

                databaseHandler.isProfilePicInDb(uid,pid,pversion);
  
            } else if (type == "l") {
                lat = posts[i].lat
                lon = posts[i].lon
                openMapbox(lat,lon);
                posText = "Lat: " + lat + " Lon: " + lon
                addPostPosToList(pid,name,posText,lat,lon);
                // getProfilePic(pid,uid);
                databaseHandler.isProfilePicInDb(uid,pid);
                //console.log("l")
            }
            
        }
        $("#chat_list").append('<div class="row pt-5"><div class="col-12 pt-5"></div></div>');

        // $("#chat_list").append('<li class="list-group-item" id="END-OF-LIST""> --END OF THE CHAT-- </li>')
        // $("#chat_list").append('<li class="list-group-item" id="END-OF-LIST""> --END OF THE CHAT-- </li>')

    }

    function requestMessageImage(pid) {
         //c("requestMessageImage");
        let imageFinal;
        $.ajax({
                type: "POST",
                url: base_url + "getPostImage.php",
                data: JSON.stringify({ "sid": sid , "pid": pid }),
                success: function (data) {
                    jsonImage = JSON.parse(data);
                    addPostImageToListAndToDb(jsonImage.content,pid);
                },
                error: function (error) {
                    console.error(error.responseText);
                }
        })
    }

    async function getProfilePic(pid,uid,isInDb,pversion) {
            $.ajax({
                type: "POST",
                url: base_url + "getUserPicture.php",
                data: JSON.stringify({ "sid": sid , "uid": uid }),
                success: function (data) {
                    jsonProfilePic = JSON.parse(data);
                    addProfilePictureToList(pid,jsonProfilePic.picture);
                    if (isInDb) {
                        console.log("jsonprofilepic: " + jsonProfilePic)
                        databaseHandler.updateProfileImage(uid,jsonProfilePic.pversion,jsonProfilePic.picture);
                    } else {
                        if (jsonProfilePic.picture == null) {
                            databaseHandler.addPostImage(pid,"R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
                        } else {
                            databaseHandler.addPostImage(pid,jsonProfilePic.picture);
                        }
                        
                    }
                          
                },
                error: function (error) {
                    console.error(error.responseText);
                    reject();
                }
            })
    }

    //SEND FUNZTIONS:
    function sendTextPost(content) {
        $.ajax({
            type: "POST",
            url: base_url + "addPost.php",
            data: JSON.stringify({ "sid": sid ,"ctitle": ctitleGLOBAL ,"type": "t" , "content": content }),
            success: function (data) {
                c("Message TEXT sent successfully: " + content);
                $('#chat_list').empty()
                $("#textPost").val(""); //setta il box del testo come vuoto
                getChannel(ctitle);
            },
            error: function (error) {
                console.error(error.responseText);
            }
        })
    }

    function sendImagePost(content) {
        $.ajax({
            type: "POST",
            url: base_url + "addPost.php",
            data: JSON.stringify({ "sid": sid ,"ctitle": ctitleGLOBAL ,"type": "i" , "content": content }),
            success: function (data) {
                c("Message IMAGE sent successfully: " + content);
                $('#chat_list').empty()
                $("#textPost").val(""); //setta il box del testo come vuoto
                getChannel(ctitle);
            },
            error: function (error) {
                console.error(error.responseText);
            }
        })
    }
    function sendPosPost() {
        //c(latMapbox + " " + lonMapbox);
        $.ajax({
            type: "POST",
            url: base_url + "addPost.php",
            data: JSON.stringify({ "sid": sid ,"ctitle": ctitleGLOBAL ,"type": "l" , "lat": latMapbox , "lon": lonMapbox }),
            success: function (data) {
                c("Message POSITION sent successfully: " + latMapbox + " , " + lonMapbox);
                showScreen("#chatPage");
                $('#chat_list').empty()
                getChannel(ctitle);
            },
            error: function (error) {
                console.error(error.responseText);
            }
        })
    }

    function addPostTextToList(pid,name,content) {
        let textToAppend = format('<li class="list-group-item" id="t%s"><img id="%s" src="src/default_photo_white.png" class="profile-pic" style="width:40px;height:40px;" align="left"></img> <b><p>&emsp;%s:</p></b><br> <p>&emsp;%s</p> </li> ',pid,pid,name,content);
        $("#chat_list").append(textToAppend);
    }

    function addPostPosToList(pid,name,pos,lat,lon) {
        let textToAppend = format('<li class="list-group-item" id="p%s,%s,%s" > <img id="%s" src="src/default_photo_white.png" class="profile-pic" style="width:40px;height:40px;" align="left"></img> <b><p>&emsp;%s:</p></b> <p>&emsp;%s</p> </li> ',pid,lat,lon,pid,name,pos);
        $("#chat_list").append(textToAppend);
    }

    function addPostImageToList(base64Image,pid) {
        let finalStringImageBase64;
        //c("addPostImageToList");
        try {
            window.atob(base64Image);
            finalStringImageBase64 = "data:image/png;base64, " + base64Image;
        } catch (e) {
            //c("image bad formatted")
            finalStringImageBase64 = "src/image_not_formatted_well.jpg"
        }
        
        $("#"+pid+ ".post-image").attr('src',finalStringImageBase64);

    }

    function addPostImageToListAndToDb(base64Image,pid) {
        let finalStringImageBase64;
        //c("addPostImageToList");
        databaseHandler.addPostImage(pid,base64Image);
        try {
            window.atob(base64Image);
            finalStringImageBase64 = "data:image/png;base64, " + base64Image;
        } catch (e) {
            //c("image bad formatted")
            finalStringImageBase64 = "src/image_not_formatted_well.jpg"
        }
        
        $("#"+pid+ ".post-image").attr('src',finalStringImageBase64);

    }

    function addProfilePictureToList(pid,profilePicBase64) {
        let finalStringProfilePicBase64;

        if(profilePicBase64==null) { //se la foto é nulla metti l'immagine di base ed esci dall funzione
            $("#"+pid+ ".profile-pic" ).attr('src',"src/image_not_formatted_well.jpg");
        }
               
        try { //setta l'immagine solo se é una stringa base64 valida
            window.atob(profilePicBase64);
            finalStringProfilePicBase64 = "data:image/png;base64," + profilePicBase64;
        } catch (e) {
            finalStringProfilePicBase64 = "src/image_not_formatted_well.jpg"
        }

        //c(finalStringProfilePicBase64);
        try{ 
            $("#"+pid+ ".profile-pic" ).attr('src',finalStringProfilePicBase64);
        } catch (e) {
            $("#"+pid+ ".profile-pic" ).attr('src',"src/default_photo_white.png");
        }

        //databaseHandler.addProfileImage(uid,pversion,profilePicBase64);
        

    }

    function addProfilePictureToListAndAddToDb(pversion,pid,profilePicBase64,uid) {
        let finalStringProfilePicBase64;

        databaseHandler.addProfileImage(uid,pversion,profilePicBase64);

        if(profilePicBase64==null) { //se la foto é nulla metti l'immagine di base ed esci dall funzione
            $("#"+pid+ ".profile-pic" ).attr('src',"src/image_not_formatted_well.jpg");
            return
        }
               
        try {
            window.atob(profilePicBase64);
            finalStringProfilePicBase64 = "data:image/png;base64," + profilePicBase64;
        } catch (e) {
            //c("image bad formatted")
            finalStringProfilePicBase64 = "src/image_not_formatted_well.jpg"
        }

        //c(finalStringProfilePicBase64);
        try{ 
            $("#"+pid+ ".profile-pic" ).attr('src',finalStringProfilePicBase64);
        } catch (e) {
            $("#"+pid+ ".profile-pic" ).attr('src',"src/default_photo_white.png");
        }

        //databaseHandler.addProfileImage(uid,pversion,profilePicBase64);
        

    }

    function encodeImageToSendFileAsURL() {
        var filesSelected = document.getElementById("inputImageToLoad").files;
        if (filesSelected.length > 0) {
          var fileToLoad = filesSelected[0];
    
          var fileReader = new FileReader();
    
          fileReader.onload = function(fileLoadedEvent) {
            base64ImageString = fileLoadedEvent.target.result.split(",")[1]; // <--- data: base64
            //chiamata di rete per mandare immagine
            sendImagePost(base64ImageString);
            //c(base64ImageString);
            
          }
          fileReader.readAsDataURL(fileToLoad);
        }
    }

