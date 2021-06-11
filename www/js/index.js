/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    $(function () {
        console.log("dom INDEX ready!");
        
    });

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    //Inizializza db
    databaseHandler.createDatabase();
    //databaseHandler.deletePostImgsDb(0);
    //databaseHandler.deleteProfileImgsDb(0);

    
    //showMap();
    // document.getElementById('deviceready').classList.add('ready');
    if(localStorage.getItem("firstRun") == null) {
        localStorage.setItem("firstRun",false);
        userImplicitRegistration();
        console.log("First run!")
    } else if(localStorage.getItem("sid")==null) {
        userImplicitRegistration();
    }
    showScreen("#homePage");
    getWall();
}

const base_url = "https://ewserver.di.unimi.it/mobicomp/accordo/";
var ctitleGLOBAL;

    function showscreen(idToShow) {
        $(".screen").hide()
        $(idToShow).show()
    }

    function c(message) {
        console.log(message);
    }

    $(".add-channel").click(function() {
        console.log("add-channel clicked");
        //$(".popup").toggleClass("opacity-0",false)
        //TODO: chiamata di rete per aggiungere il channel
        channel_name = prompt("Add a new channel:", "")
        if(channel_name != "") {
            addChannel(channel_name);
        } else {
            alert("Channel name can't be empty!");
        }
        
    });

    $("#settings-button").click(function() {
        showScreen("#settingsPage");
    });

    $(".settingsBack").click(function () {
        showScreen("#homePage");
        console.log("back")
    });

    $(".list-group-item").click(function(){
        id = $('#list-group-item').attr('id')
        console.log(id);
    });
    
    $(".channels_list li").not('.emptyMessage').click(function () {
            alert('Clicked list. ' + this.id);
    });

    $("#channels_list").on("click", "li", function () {
            var projIndex = $(this).index();
            chat_name = $(this).text()
            ctitleGLOBAL = $(this).text();
            console.log(chat_name)
            localStorage.setItem("ctitle", chat_name);
            getChannel(chat_name);
            showScreen("#chatPage");
            //location.replace("chat.html")
            //TODO: passare il nome del canale alla pagina della chat
            //console.log($("li").get(projIndex))
    });

    function showScreen(id) {
        $(".screen").hide();
        $(id).show();
    }

    $(".settings-back").click(function () {
        $("body").css({"background-color":"white"})
        showscreen("#homePage");
        $('#chat_list').empty();
    });


    $(".imagebig-back").click(function () {
        $("body").css({"background-color":"white"})
        showscreen("#chatPage");
    });

    function userImplicitRegistration() {
        $.ajax({
            type:"POST",
            url: base_url + "register.php",
            success: function(data){
                console.log("User registered successfully");
                json = JSON.parse(data)
                localStorage.setItem("sid", json.sid);
                getWall();
            },
            error: function(error){
                console.log(error.responseText);
                alert("User not registered, try to reload the page!")
            }
        })
    }

    function getWall() {
        sid = localStorage.getItem("sid");
        console.log("sid " +sid);
        $.ajax({
            type:"POST",
            url: base_url + "getWall.php",
            data: JSON.stringify({"sid":sid}),
            success: function(data) {
                json = JSON.parse(data);
                all_channels = json.channels;
                update_channels_list(all_channels)

            },
            error: function(error) {
                console.log(error.responseText);
            }
        })
    }

    function addChannel(channel_name) {
        //$('#channels_list').empty()
        sid = localStorage.getItem("sid");
        $.ajax({
            type:"POST",
            url: base_url + "addChannel.php",
            data: JSON.stringify({ "sid": sid, "ctitle": channel_name}),
            success: function(data) {
                //'<a href="#" id='+ channel_name +'class="item-lista list-group-item list-group-item-action">'+ channel_name +'</a> <hr>'
                //testo_html = '<a href="#" id=' + channel_name + 'class="item-lista list-group-item list-group-item-action">' + channel_name + '</a> <hr>'
                //testo_html = '<li class="list-group-item" id=' + channel_name + '>' + channel_name + '</li> <hr>'
                //$("#channels_list").append(testo_html);
                $('#channels_list').empty()
                getWall();
            } ,
            error: function(error) {
                alert(error.responseText);
                console.log(error.responseText);
            }
        })
    }

    function update_channels_list(channels) {
        for (i=0;i<channels.length;i++) {
            titolo = channels[i].ctitle
            mio = channels[i].mine
            element_id = "c_element_" + i 
            //console.log(i + ": " + channels[i].ctitle)
            testo_html = '<li class="list-group-item" id=' + titolo + '>' + titolo + '</li> <hr>';
            if(i==(channels.length)-1) {
                $("#channels_list").append('<li class="list-group-item pb-2" id="' + titolo + '"">' + titolo + '</li>');
                c('Last element: ' + titolo);
            } else if (mio == "t") {
                $("#channels_list").append('<li class="list-group-item" id="' + titolo + '"">' + titolo + '</li>');
            } else {
                $("#channels_list").append('<li class="list-group-item" id="' + titolo + '"">' + titolo + '</li>');   
            }
        }
        $("#channels_list").append('<div class="row pt-5"><div class="col-12"></div></div>');

        // $("#channels_list").append('<li  id="END-OF-LIST""> --END OF THE CHANNELS-- </li>')
        // $("#channels_list").append('<li  id="END-OF-LIST""> --END OF THE CHANNELS-- </li>')
        // //$("#channels_list").append('<li>New list item</li>')

        //console.log(channels.ctitle)
        //channels_list   
        //all_channels[0].mine
    }

    
