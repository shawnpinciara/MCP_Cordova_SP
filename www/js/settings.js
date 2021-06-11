
    let usernameText = "Username";
    let base64ImageString;
    
    
    $(function () {
        console.log("dom SETTINGS ready!");
        usernameText = localStorage.getItem("username");
        if (usernameText==null) {
            usernameText = "Username"
        }
        base64ImageString = localStorage.getItem("profilePicture");
        if (base64ImageString==null) {
            base64ImageString = "src/default_photo_2.jpg"
        }
        $("#usernameText").text(usernameText);
        $("#userImg").attr('src', base64ImageString);
    });

    $(".settingsBack").click(function () {
        showScreen("#homePage");
    });


    $(".channel").click(function () {
        location.replace("index.html")
    });

    $("#userImgDiv").click(function () {
        //cambiare immagine profilo
        $('.inputFileToLoad').trigger('click');

        //inputFileToLoad
        //loadFile();
        c("Userimg click")
    });

    $("#username").click(function () {
        //Cambiare username
    });

    $("#usernameEdit").click(function () {
        usernameText = prompt("New username: ");
        if (usernameText.length == 0) {
            alert("The name can't be empty!")
        } else {
            setProfileName(usernameText);
        }
    })

    $("#usernameText").click(function () {
        usernameText = prompt("New username: ");
        if (usernameText.length == 0) {
            alert("The name can't be empty!")
        } else if(usernameText.length >20) {
            alert("The name can't be lonmger than 20 characters!")
        } else {
            setProfileName(usernameText);
        }
        
    })

    function setProfileName(usernameText) {
        //$('#channels_list').empty()
        c(usernameText);
        sid = localStorage.getItem("sid");
        $.ajax({
            type:"POST",
            url: base_url + "setProfile.php",
            data: JSON.stringify({ "sid": sid, "name": usernameText}),
            success: function() {
                $("#usernameText").text(usernameText);
                localStorage.setItem("username",usernameText);
            } ,
            error: function(error) {
                alert("Something went wrong, try again!");
                console.log(error.responseText);
            }
        })
    }

    function setProfileImage(imgBase64) {
        sid = localStorage.getItem("sid");
        imgBase64 = imgBase64.split(',')[1];
        if (imgBase64.length <= 100000) {
            $.ajax({
                type:"POST",
                url: base_url + "setProfile.php",
                data: JSON.stringify({ "sid": sid, "picture": imgBase64}),
                success: function() {
                    $("#userImg").attr('src', base64ImageString);
                    localStorage.setItem("profilePicture",base64ImageString);
                } ,
                error: function(error) {
                    alert("Something went wrong, try again!");
                    console.log(error.responseText);
                }
            })
        } else {
            alert("The image is too big!");
        }
        
    }


    function encodeImageFileAsURL() {
        var filesSelected = document.getElementById("inputFileToLoad").files;
        if (filesSelected.length > 0) {
          var fileToLoad = filesSelected[0];
    
          var fileReader = new FileReader();
    
          fileReader.onload = function(fileLoadedEvent) {
            base64ImageString = fileLoadedEvent.target.result; // <--- data: base64
            //chiamata di rete per cambiare immagine
            setProfileImage(base64ImageString);
          }
          fileReader.readAsDataURL(fileToLoad);
        }
    }

