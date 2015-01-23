// webRTC

//APIキー
var APIKEY = 'fd91b82a-a13d-11e4-aa18-c1fd09219403';

//ユーザーリスト
var userList = [];

//Callオブジェクト
var existingCall;

// Compatibility
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// window.AudioContext = window.AudioContext || window.webkitAudioContext;

// Audio contextを生成
// var audioContext = new webkitAudioContext();
// var gainNode = audioContext.createGain();

// PeerJSオブジェクトを生成
var peer = new Peer({ key: APIKEY, debug: 3});

// PeerIDを生成
peer.on('open', function(){
    $('#my-id').text(peer.id);
});

// // 相手からのコールを受信したら自身のメディアストリームをセットして返答
// peer.on('call', function(call){
//     call.answer(window.localStream);
//     step3(call);
// });

// // エラーハンドラー
// peer.on('error', function(err){
//     alert(err.message);
//     step2();
// });

// // イベントハンドラー
// $(function(){

//     // 相手に接続
//     $('#make-call').click(function(){
//         var call = peer.call($('#contactlist').val(), window.localStream);
//         step3(call);

//     });

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

//     //ユーザリス取得開始
//     setInterval(getUserList, 2000);

// });

// function step1 () {
//     // メディアストリームを取得する
//     navigator.getUserMedia({audio: true, video: true}, function(stream){
//         $('#my-video').prop('src', URL.createObjectURL(stream));
//         window.localStream = stream;

//         // 自分の音声のボリュームをコントロールする    
//         // var mediaStreamSource = audioContext.createMediaStreamSource(stream);
//         // gainNode.gain.value = document.getElementById("gain").value;
//         // mediaStreamSource.connect(gainNode);
//         // gainNode.connect(audioContext.destination);

//         step2();
//     }, function(){ $('#step1-error').show(); });
// }

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

// function getUserList () {
//     //ユーザリストを取得
//     $.get('https://skyway.io/active/list/'+APIKEY,
//         function(list){
//             for(var cnt = 0;cnt < list.length;cnt++){
//                 if($.inArray(list[cnt],userList)<0 && list[cnt] != peer.id){
//                     userList.push(list[cnt]);
//                     $('#contactlist').append($('<option>', {"value":list[cnt],"text":list[cnt]}));
//                 }
//             }
//         }
//     );
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
});

addMember = function (event) {
    var $item = $("<div>")
                    .prop("class", "element-item")
                    .append(
                        $("<img>").prop("src", "http://placehold.it/160x120&text=Speaker")
                    )
                    .on( 'click', function() {
                        $(this).toggleClass('spot');
                        $container.isotope('layout');
                    })
    $container.append($item)
        .isotope( 'appended', $item);
}

// websocket

var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

ws.onmessage = function (event) {
	var li = document.createElement('li');
	li.innerHTML = JSON.parse(event.data);
	document.querySelector('#pings').appendChild(li);

    addMember();
};
