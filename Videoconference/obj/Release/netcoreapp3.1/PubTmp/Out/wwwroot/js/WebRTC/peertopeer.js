'use strict';

let roomId = "";

let localVideo;
let remoteVideo;
let localStream;
let peerConnection;
let peerConnectionConfig = { 'iceServers': [{ 'url': 'stun:stun.services.mozilla.com' }, { 'url': 'stun:stun.l.google.com:19302' }] };
peerConnection = new RTCPeerConnection(peerConnectionConfig);
peerConnection.onicecandidate = onDetectIceCandidate;
peerConnection.onaddstream = gotRemoteStream;

// Cross-platform compatibility
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

async function invoke_initWebRTC(id) {
    roomId = id;

    localVideo = document.querySelector('video#localVideo');
    remoteVideo = document.querySelector('video#remoteVideo');

    await getUserMedia();
}

async function getUserMedia() {
    if (navigator.getUserMedia) {
        try {
            const constraints = { 'video': true, 'audio': true };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            localStream = stream;
            localVideo.srcObject = stream;

            //Adding to the peerconnection
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        } catch (error) {
            console.error('Error opening video camera.', error);
        }
    }
    else {
        console.log('Your browser does not support getUserMedia API');
    }
}

//PAIRING
async function invoke_createOffer() {
    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log("STEP 1: offer created and inserted as local description.");
        console.log(offer);
        console.log(peerConnection);

        console.log("STEP 2: offer sended.");
        return JSON.stringify(offer);
    } catch (error) {
        console.error('ERROR: creating an offer.', error);
    }
}

async function invoke_onReceiveOffer(offerString) {
    let offer = new RTCSessionDescription(JSON.parse(offerString));
    console.log("STEP 3: offer received.");
    console.log(offer);

    try {
        await peerConnection.setRemoteDescription(offer);
        console.log("STEP 4: offer inserted as the remote description.");
        console.log(peerConnection);

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log("STEP 5: answer created and inserted as local description.");
        console.log(answer);

        console.log("STEP 6: answer sended.");
        return JSON.stringify(answer);
    } catch (error) {
        console.error('ERROR: creating an answer.', error);
    }
}

async function invoke_onReceiveAnswer(answerString) {
    let answer = new RTCSessionDescription(JSON.parse(answerString));
    console.log("STEP 7: answer received.");
    console.log(answer);

    try {
        await peerConnection.setRemoteDescription(answer);
        console.log("STEP 8: answer inserted as the remote description.");
    } catch (error) {
        console.error('ERROR: setting the answer.', error);
    }
}

//ICE
function onDetectIceCandidate(event) {
    if (event.candidate != null) {
        console.log('Sending new candidate');
        let candidate = new RTCIceCandidate(event.candidate);
        DotNet.invokeMethodAsync('Videoconference', 'SendIceCandidate', JSON.stringify(candidate), roomId)
    }
}

function invoke_onReceiveIceCandidate(iceCandidateString) {
    let iceCandidate = new RTCIceCandidate(JSON.parse(iceCandidateString));
    console.log("Ice candidate received");

    peerConnection.addIceCandidate(iceCandidate);
}

function gotRemoteStream(event) {
    console.log('got remote stream');
    remoteVideo.srcObject = event.stream;
}





//OKKKKKKKKKKKKKKKK
//function gotMessageFromServer(message) {
//    if (!peerConnection) start(false);

//    var signal = JSON.parse(message.data);
//    if (signal.sdp) {
//        peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function () {
//            if (signal.sdp.type == 'offer') {
//                peerConnection.createAnswer(gotDescription, createAnswerError);
//            }
//        });
//    } else if (signal.ice) {
//        peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
//    }
//}

//let remoteStream;
//let remoteVideo;

//const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
//const peerConnection = new RTCPeerConnection(configuration);

//async function initParameters(id) {
//    roomId = id;

//    remoteVideo = document.querySelector('video#remoteVideo');
//    //remoteVideo.srcObject = remoteStream;
//}

////EVENTS
//peerConnection.ontrack = (event) => {
//    //remoteStream.addTrack(event.track, remoteStream);

//    if (event.streams && event.streams[0]) {
//        remoteVideo.srcObject = event.streams[0];
//    } else {
//        if (!remoteStream) {
//            remoteStream = new MediaStream();
//            remoteVideo.srcObject = remoteStream;
//        }
//        remoteStream.addTrack(event.track);
//    }
//};

//peerConnection.onicecandidate = (event) => {
//    if (event.candidate) {
//        DotNet.invokeMethodAsync('OnlineEducation', 'ShareIceCandidate', JSON.stringify(event.candidate), roomId);
//        console.log("sharing a candidate");
//    } else {
//    /* there are no more candidates coming during this negotiation */
//        console.log("no more candidate");
//    }
//};

//peerConnection.onicegatheringstatechange = (event) => {
//    let connection = event.target;

//    switch (connection.iceGatheringState) {
//        case "gathering":
//            console.log("collection of candidate is occurring");
//            break;
//        case "complete":
//            console.log("collection of candidate is finished");
//            break;
//    }
//}

//peerConnection.onconnectionstatechange = async (event) => {
//    console.log("State: " + peerConnection.connectionState.toString());
//    if (peerConnection.connectionState === "connected") {
//        // Peers connected!
//        console.log("connected");
//    }
//    else if (peerConnection.connectionState === "connecting") {
//        console.log("connecting");
//    }
//    else {
//        console.log("not connected yet");
//    }
//}

////MEDIA
////play local stream VERY IMPORTANT TO DO BEFORE GETTING ICE CANDIDATES
//async function webRTC_playVideoFromCamera() {
//    try {
//        const constraints = { 'video': true, 'audio': true };
//        const stream = await navigator.mediaDevices.getUserMedia(constraints);
//        const videoElement = document.querySelector('video#localVideoPlayback');
//        videoElement.srcObject = stream;

//        //Adding to the peerconnection
//        stream.getTracks().forEach(track => {
//            peerConnection.addTrack(track, stream);
//        });
//    } catch (error) {
//        console.error('Error opening video camera.', error);
//    }
//}

////1. Initializing RTCconfiguration
////2. OnReceivingOffer
////3. OnReceivingAnswer
//async function makeCall() {
//    const offer = await peerConnection.createOffer();
//    await peerConnection.setLocalDescription(offer);

//    return JSON.stringify(offer);
//}

//async function onReceivingOffer(offer) {
//    offer = JSON.parse(offer); //return to object shape

//    const remoteDesc = new RTCSessionDescription(offer);
//    peerConnection.setRemoteDescription(remoteDesc);

//    const answer = await peerConnection.createAnswer();
//    await peerConnection.setLocalDescription(answer);
//    console.log(peerConnection);

//    return JSON.stringify(answer);
//}

//async function onReceivingAnswer(answer) {
//    answer = JSON.parse(answer);

//    const remoteDesc = new RTCSessionDescription(answer);
//    await peerConnection.setRemoteDescription(remoteDesc);

//    console.log(peerConnection);
//}

////ICE Candidates
//async function onReceivingIceCandidate(iceCandidate) {
//    iceCandidate = JSON.parse(iceCandidate);
//    console.log("State: " + peerConnection.connectionState.toString());
//    try {
//        await peerConnection.addIceCandidate(iceCandidate);
//    } catch (e) {
//        console.error('Error adding received ice candidate', e);
//    }
//}