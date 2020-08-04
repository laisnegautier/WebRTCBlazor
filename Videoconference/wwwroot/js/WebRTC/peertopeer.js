'use strict';

let roomId = "";
let remoteStream;
let remoteVideo;

const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
const peerConnection = new RTCPeerConnection(configuration);

async function initParameters(id) {
    roomId = id;

    remoteVideo = document.querySelector('video#remoteVideo');
    //remoteVideo.srcObject = remoteStream;
}

//EVENTS
peerConnection.ontrack = (event) => {
    //remoteStream.addTrack(event.track, remoteStream);

    if (event.streams && event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
    } else {
        if (!remoteStream) {
            remoteStream = new MediaStream();
            remoteVideo.srcObject = remoteStream;
        }
        remoteStream.addTrack(event.track);
    }
};

peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
        DotNet.invokeMethodAsync('OnlineEducation', 'ShareIceCandidate', JSON.stringify(event.candidate), roomId);
        console.log("sharing a candidate");
    } else {
    /* there are no more candidates coming during this negotiation */
        console.log("no more candidate");
    }
};

peerConnection.onicegatheringstatechange = (event) => {
    let connection = event.target;

    switch (connection.iceGatheringState) {
        case "gathering":
            console.log("collection of candidate is occurring");
            break;
        case "complete":
            console.log("collection of candidate is finished");
            break;
    }
}

peerConnection.onconnectionstatechange = async (event) => {
    console.log("State: " + peerConnection.connectionState.toString());
    if (peerConnection.connectionState === "connected") {
        // Peers connected!
        console.log("connected");
    }
    else if (peerConnection.connectionState === "connecting") {
        console.log("connecting");
    }
    else {
        console.log("not connected yet");
    }
}

//MEDIA
//play local stream VERY IMPORTANT TO DO BEFORE GETTING ICE CANDIDATES
async function webRTC_playVideoFromCamera() {
    try {
        const constraints = { 'video': true, 'audio': true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.querySelector('video#localVideoPlayback');
        videoElement.srcObject = stream;

        //Adding to the peerconnection
        stream.getTracks().forEach(track => {
            peerConnection.addTrack(track, stream);
        });
    } catch (error) {
        console.error('Error opening video camera.', error);
    }
}

//1. Initializing RTCconfiguration
//2. OnReceivingOffer
//3. OnReceivingAnswer
async function makeCall() {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    return JSON.stringify(offer);
}

async function onReceivingOffer(offer) {
    offer = JSON.parse(offer); //return to object shape

    const remoteDesc = new RTCSessionDescription(offer);
    peerConnection.setRemoteDescription(remoteDesc);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    console.log(peerConnection);

    return JSON.stringify(answer);
}

async function onReceivingAnswer(answer) {
    answer = JSON.parse(answer);

    const remoteDesc = new RTCSessionDescription(answer);
    await peerConnection.setRemoteDescription(remoteDesc);

    console.log(peerConnection);
}

//ICE Candidates
async function onReceivingIceCandidate(iceCandidate) {
    iceCandidate = JSON.parse(iceCandidate);
    console.log("State: " + peerConnection.connectionState.toString());
    try {
        await peerConnection.addIceCandidate(iceCandidate);
    } catch (e) {
        console.error('Error adding received ice candidate', e);
    }
}