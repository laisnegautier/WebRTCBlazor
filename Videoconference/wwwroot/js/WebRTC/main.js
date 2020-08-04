'use strict';

//// 0 : connection builder
//var connection = new signalR.HubConnectionBuilder().withUrl("/WebRtcHub").build();

//// 1 : start connection between the 2 artists
//// .then can be added if we want
//connection.start()
//    .catch(function (err) {
//        return console.error(err.toString());
//    });

//function connectionId() {
//    return connection.Hub
//}

//// 2 : a message is sent
//function startSignalR() {
//    // we get the values needed
//    var senderId = document.getElementById("senderId").value;
//    var receiverId = document.getElementById("receiverId").value;

//    // In MessagesHub
//    connection.invoke("SendMessageHub", senderId, receiverId).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//};

//// 3
//connection.on("ReceiveMessage", function (senderId, receiverId, messageContent) {
//    document.getElementById("getMessages").click();
//});



//let startTime;

//window.webRTC_handlers = () => {
//    const startButton = document.getElementById('startButton');
//    const callButton = document.getElementById('callButton');
//    const upgradeButton = document.getElementById('upgradeButton');
//    const hangupButton = document.getElementById('hangupButton');

//    const localVideo = document.getElementById('localVideo');
//    const remoteVideo = document.getElementById('remoteVideo');

//    callButton.disabled = true;
//    hangupButton.disabled = true;
//    upgradeButton.disabled = true;
//    startButton.onclick = start;
//    callButton.onclick = call;
//    upgradeButton.onclick = upgrade;
//    hangupButton.onclick = hangup;

//    //localVideo.addEventListener('loadedmetadata', function () {
//    //    console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
//    //});

//    //remoteVideo.addEventListener('loadedmetadata', function () {
//    //    console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
//    //});
//};

//// MEDIAS AND MEDIA CHANGES

////1st steps: query media
//function webRTC_queryMedia() {
//    const openMediaDevices = async (constraints) => {
//        return await navigator.mediaDevices.getUserMedia(constraints);
//    }

//    try {
//        const stream = openMediaDevices({ 'video': true, 'audio': true });
//        console.log('webRTC_start(): Got MediaStream:', stream);
//    } catch (error) {
//        console.error('webRTC_start(): Error accessing media devices.', error);
//    }
//}

//function webRTC_getAllMedia() {
//    const audioInputs = getConnectedDevices('audioinput');
//    console.log('Microphones found:', audioInputs);

//    const audioOutputs = getConnectedDevices('audiooutput');
//    console.log('Speakers found:', audioOutputs);

//    const videoCameras = getConnectedDevices('videoinput');
//    console.log('Cameras found:', videoCameras);
//}

////2nd step Play local stream
//async function webRTC_playVideoFromCamera() {
//    try {
//        const constraints = { 'video': true, 'audio': true };
//        const stream = await navigator.mediaDevices.getUserMedia(constraints);
//        const videoElement = document.querySelector('video#localVideoPlayback');
//        videoElement.srcObject = stream;
//    } catch (error) {
//        console.error('Error opening video camera.', error);
//    }
//}

//async function webRTC_playScreen() {
//    try {
//        const constraints = {
//            video: {
//                cursor: 'always' | 'motion' | 'never',
//                displaySurface: 'application' | 'browser' | 'monitor' | 'window'
//            }
//        };
//        const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
//        const videoElement = document.querySelector('video#localStreanPlayback');
//        videoElement.srcObject = stream;
//    } catch (error) {
//        console.error('Error opening screen.', error);
//    }
//}

//async function makeCall() {
//    const configuration { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302'}] }
//    const peerConnection = new RTCPeerConnection(configuration);

//    signalingChannel.addEventListener('message', async message => {
//        if (message.answer) {
//            const remoteDesc = new RTCSessionDescription(message.answer);
//            await peerConnection.setRemoteDescription(remoteDesc);
//        }
//    });

//    const offer = await peerConnection.createOffer();
//    await peerConnection.setLocalDescription(offer);

//    signalingChannel.send({ 'offer': offer });
//}
