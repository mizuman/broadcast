// リファクタ
// その前にwsからsocket.ioに乗換えるのが先かな

var switcher;

(function() {
	
	switcher = function() {
		this.conn2Peer();
	}

	var proto_ = switcher.prototype;

	proto_.conn2Peer = function(){
		// 既にPeerJSオブジェクトがあれば破棄
		if(this.peer) this.peer.disconnect();
		this.peer = new Peer({ key: APIKEY, debug: 3});

		// PeerIDを生成
		this.peer.on('open', function(id){
			$('#my-id').text(peer.id);
			this.myid = id
		});

		// エラーハンドラー
		this.peer.on('error', function(err){
		    alert(err.message);
		    // step2();
		});

		// 相手からのコールを受信したら空のストリームを返答
		this.peer.on('call', function(call){

		    call.answer();
		    call.on('stream', function(stream){
		    	// self.emitとか、triggerとかでやりたいけど、とりあえず
		        $("#speaker-video")
		            .attr({
		                src: URL.createObjectURL(stream)
		            })
		    });
		    window.existingCalls[call.peer] = call;
		    call.on('close', function() {
		        window.existingCalls[call.peer].close();
		        delete window.existingCalls[call.peer];
		    });
		});
	}

	proto_.call = function(peers){
		for (var i = peers.length - 1; i >= 0; i--) {
			var id = peers[i];

		};
	}

}());