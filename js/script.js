// webRTC

//APIキー
var APIKEY = 'fd91b82a-a13d-11e4-aa18-c1fd09219403';

//ユーザーリスト
// var userList = [];
var faceList = [];

//Callオブジェクト
var existingCall; // receiveList
// var existingCalls = {};
var sendList = [];

// Compatibility
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// window.AudioContext = window.AudioContext || window.webkitAudioContext;

// Audio contextを生成
// var audioContext = new webkitAudioContext();
// var gainNode = audioContext.createGain();

// canvas context
var ctx = null;
var $canvas;

// PeerJSオブジェクトを生成
var peer = new Peer({ key: APIKEY, debug: 3});

// PeerIDを生成
peer.on('open', function(){
    $('#my-id').text(peer.id);
});

var mediaConnections;
// var hoge;

// 相手からのコールを受信したら空のストリームを返答
peer.on('call', function(call){

    if(existingCall) { 
        existingCall.close();
    }

    if(sendList[0]) {
        for (var i = sendList.length - 1; i >= 0; i--) {
            sendList[i].close();
            sendList.splice(i,1);
        };
    }

    existingCall = call;

    call.answer();
    call.on('stream', function(stream){
        $("#speaker-video")
            .attr({
                src: URL.createObjectURL(stream)
            })
            .show()
        if(window.localStream) {
            $("#get-cam").prop('disabled', false);
            $("#off-cam").prop('disabled', true);
        }
    });
        call.on('close', function() {
        existingCall.close();
        $("#speaker-video").prop("src", false);
    });
});

// エラーハンドラー
peer.on('error', function(err){
    alert(err.message);
    // step2();
});

var call = function(peers) {

    if(existingCall) {
        existingCall.close();
    }

    for (var i = peers.length - 1; i >= 0; i--) {
        var id = peers[i];
        if(id !== peer.id) {
            call_(id);
        }
    };
}
var call_ = function(peerid) {
    var call = peer.call(peerid, window.localStream);
    sendList.push(call);
}

// イベントハンドラー
$(function(){

    // 全員に接続
    $('#get-cam').click(function(){
        call(faceList);
        $("#speaker-video")
            .attr({
                src: URL.createObjectURL(window.localStream)
            })
            .show()
        $(this).prop('disabled', true);
        $("#off-cam").prop('disabled', false);
        // var call = peer.call($('#contactlist').val(), window.localStream);
        // step3(call);
    });

    $("#off-cam").click(function(){
        $("#speaker-video")
            .attr({
                src: false
            })
        if(window.sendList[0]) {
            for (var i = window.sendList.length - 1; i >= 0; i--) {
                window.sendList[i].close();
                window.sendList.splice(i,1);
            };
        }
            $("#get-cam").prop('disabled', false);
            $("#off-cam").prop('disabled', true);
        })

    document.querySelector("#textbox").addEventListener("keypress", function(e){
        var key = e.which || e.keyCode;
        if (key == 13) {
            var text = $("#textbox").val();
            ws.send(JSON.stringify({type: 'msg', id: peer.id, text: text}));
            $("#textbox").val("");
        }
    })
    // 個々に接続


//     // 切断
//     $('#end-call').click(function(){
//         existingCall.close();
//         step2();
//     });

//     // メディアストリームを再取得
//     $('#step1-retry').click(function(){
//         $('#step1-error').hide();
//         step1();
//     });

//     // ステップ１実行
//     step1();

    //ユーザリス取得開始
    // setInterval(getUserList, 2000);

});

function step1 () {
    // apply video format
    if(location.hash==="#hd" || checkBrowser() != "chrome") {
        console.log("高画質モード。chrome以外は自動的に高画質モードになります。負荷高め")
        var videoOpt = {"optional":[{"maxWidth":"1280"},{"maxHeight":"720"}, {"maxFrameRate": "60"}],"mandatory":{}}
    } else {
        var videoOpt = {
            mandatory: {
                maxWidth: 320,
                maxHeight: 240
            },
            optional: [{ maxFrameRate: 15}]
        }
    }
    // メディアストリームを取得する
    navigator.getUserMedia({audio: true, video: true}, function(stream){
        $('#my-video').prop('src', URL.createObjectURL(stream));
        $('#get-cam').prop('disabled', false);
        window.localStream = stream;

        setInterval(capture,2000);        

    }, function(){ $('#step1-error').show(); });
}

function capture () {
    $video = $('#my-video')[0];
    ctx.drawImage($video, 0,0,160,120);
    var base64 = $("#capture-video")[0].toDataURL('image/webp');

    ws.send(JSON.stringify({type: 'capture', id: peer.id, img: base64}));
    
}

function checkBrowser() {
    var userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('opera') != -1) {
      return 'opera';
    } else if (userAgent.indexOf('msie') != -1) {
      return 'ie';
    } else if (userAgent.indexOf('chrome') != -1) {
      return 'chrome';
    } else if (userAgent.indexOf('safari') != -1) {
      return 'safari';
    } else if (userAgent.indexOf('gecko') != -1) {
      return 'gecko';
    } else {
      return false;
    }
}

// function step2 () {
//     //UIコントロール
//     $('#step1, #step3').hide();
//     $('#step2').show();
// }

// function step3 (call) {
//     // すでに接続中の場合はクローズする
//     if (existingCall) {
//         existingCall.close();
//     }

//     // 相手からのメディアストリームを待ち受ける
//     call.on('stream', function(stream){
//         $('#their-video').prop('src', URL.createObjectURL(stream));

//         // 相手の音声のボリュームをコントロールする     
//         var mediaStreamSource = audioContext.createMediaStreamSource(stream);
//         // gainNode.gain.value = document.getElementById("gain").value;
//         // mediaStreamSource.connect(gainNode);
//         // gainNode.connect(audioContext.destination);
//         mediaStreamSource.connect(audioContext.destination);
//     });

//     // 相手がクローズした場合
//     call.on('close', step2);

//     // Callオブジェクトを保存
//     existingCall = call;

//     // UIコントロール
//     $('#their-id').text(call.peer);
//     $('#step1, #step2').hide();
//     $('#step3').show();

// }


// function getUserList() {
//     peer.listAllPeers(function(list){
//         for(var i=0; i<list.length; i++){
//             userList.push(list[i]);
//         }
//     })
// }

// function showValue () {
//     var gain = document.getElementById("gain").value;
//     document.getElementById("showRangeArea").innerHTML = gain;
//     gainNode.gain.value = gain;
// }

// video area
var $container;

$( function() {
    $container = $('#isotope').isotope({
        itemSelector: '.element-item',
        masonry: {
        columnWidth: 160
    }
    });
    $container.imagesLoaded( function() {
        $container.isotope('layout');
    });

    $canvas = $("#capture-video")[0];
    ctx = $canvas.getContext("2d");

    step1();
});

addMember = function (msg) {
    var $item = $("<div>")
                    .prop("class", "element-item")
                    .prop("id", "face_"+msg.id)
                    .append(
                        $("<img>").prop("src", "http://placehold.it/160x120&text=Guest")
                    )
                    // .on( 'click', function() {
                    //     $(this).toggleClass('spot');
                    //     $container.isotope('layout');
                    // })
    $container.append($item)
        .isotope('appended', $item)
        .isotope('layout');
}

refreshMember = function(msg) {
    // console.log($("face_"+msg.id+""));

    $("#face_"+msg.id+" img").prop("src", msg.img)
}

removeMember = function(msg) {
    $container.isotope('remove', $("#face_"+msg.id+""))
            .isotope('layout');
}

sendHello = function(msg) {
    if(peer.id) {
        ws.send(JSON.stringify({type: 'hello', id: peer.id}));
    }
    else {
        setTimeout(sendHello, 2000);
    }
}

// websocket

var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

ws.onopen = function (event) {
    sendHello();
}

ws.onmessage = function (event) {
	// var li = document.createElement('li');
	// li.innerHTML = JSON.parse(event.data);
	// document.querySelector('#pings').appendChild(li);

    var msg = JSON.parse(event.data);
    // addMember();

    if(msg.type=="msg"){

        var item = $('<li/>').append(
                $("<div>").append(msg.text)
                        .append(
                            $("<i/>").text("(" + msg.id + ")")
                            )
            )





        $("#chat-history").prepend(item);
    }
    else if(msg.type=="bye") {
        removeMember(msg);
        faceList = faceList.filter(function(id){
            return id !== msg.id;
        })
    }
    else if(msg.type=="hello"){
        if(msg.id!=peer.id && faceList.indexOf(msg.id)==-1) {
            addMember(msg);
            faceList.push(msg.id);
            ws.send(JSON.stringify({type: 'hello', id: peer.id}));
            if(window.sendList[0]) {
                call_(msg.id);
            }
        }
    }
    else if(msg.type=="capture"){
        if(msg.id!=peer.id) refreshMember(msg);
    }

};


// ブラウザ終了イベント
window.onbeforeunload = function () {
  ws.send(JSON.stringify({
    type: 'bye',
    id: peer.id
  }));
};