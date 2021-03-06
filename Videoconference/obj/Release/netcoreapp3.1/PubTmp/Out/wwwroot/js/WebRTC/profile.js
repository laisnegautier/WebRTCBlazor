class Client {
    constructor(connectionId, room) {
        this.connectionId = connectionId;
        this.room = room;
        this.peerings = new Array(0);
        this.localVideo = document.querySelector("#localVideo");
    }
    async getUserMedia() {
        if (navigator.getUserMedia) {
            try {
                const constraints = { 'video': true, 'audio': true };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                this.localStream = stream;
                this.localVideo.srcObject = stream;
            }
            catch (error) {
                console.error('Error sharing screen.', error);
            }
        }
        else {
            console.log('Your browser does not support getUserMedia API');
        }
    }
    async getDisplayMedia() {
        const mediaDevices = navigator.mediaDevices;
        if (mediaDevices.getDisplayMedia) {
            try {
                let constraints = {
                    video: {
                        //cursor: 'always' | 'motion' | 'never',
                        //displaySurface: 'application' | 'browser' | 'monitor' | 'window'
                        cursor: 1 | 2 | 3,
                        displaySurface: 1 | 2 | 3 | 4
                    }
                };
                const screenStream = await mediaDevices.getDisplayMedia(constraints);
                this.localStream = screenStream;
                this.localVideo.srcObject = screenStream;
                let videoTrack = screenStream.getVideoTracks()[0];
                this.peerings.forEach(peering => {
                    var sender = peering.peerConnection.getSenders().find(function (s) {
                        return s.track.kind == videoTrack.kind;
                    });
                    console.log('found sender:', sender);
                    sender.replaceTrack(videoTrack);
                });
                videoTrack.onended = this.screenSharingStop;
            }
            catch (error) {
                console.error('Error opening video camera.', error);
            }
        }
        else {
            alert('Your browser does not support sharing screen.');
            console.log('Your browser does not support sharing screen.');
        }
    }
    async screenSharingStop(event) {
        if (navigator.getUserMedia) {
            try {
                const constraints = { 'video': true, 'audio': true };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                this.localStream = stream;
                this.localVideo.srcObject = stream;
                let videoTrack = stream.getVideoTracks()[0];
                this.peerings.forEach(peering => {
                    var sender = peering.peerConnection.getSenders().find(function (s) {
                        return s.track.kind == videoTrack.kind;
                    });
                    console.log('found sender:', sender);
                    sender.replaceTrack(videoTrack);
                });
            }
            catch (error) {
                console.error('Error sharing screen.', error);
            }
        }
        else {
            console.log('Your browser does not support getUserMedia API');
        }
    }
    addRemoteVideo(stream) {
    }
    getPeeringByOfferingClient(clientOffering) {
        return this.peerings.find(x => x.clientOffering === clientOffering);
    }
    getPeeringByAnsweringClient(clientAnswering) {
        //console.log("LOOOOOOP");
        //this.peerings.forEach(x => console.log(x));
        return this.peerings.find(x => x.clientAnswering === clientAnswering);
    }
}
class Peering {
    constructor(clientOffering, clientAnswering) {
        this.generatedId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        console.log("PEERING CONSTRUCTOR");
        this.clientOffering = clientOffering;
        this.clientAnswering = clientAnswering;
        this.peerConnectionConfig = { 'iceServers': [{ 'urls': 'stun:stun.services.mozilla.com' }, { 'urls': 'stun:stun.l.google.com:19302' }] };
        this.peerConnection = new RTCPeerConnection(this.peerConnectionConfig);
        this.peerConnection.onicecandidate = (event) => this.onDetectIceCandidate(event, this);
        this.peerConnection.ontrack = (event) => this.gotRemoteStream(event, this);
    }
    onDetectIceCandidate(event, peeringObj) {
        if (event.candidate != null) {
            console.log('ice candidate sent');
            let candidate = new RTCIceCandidate(event.candidate);
            window.DotNet.invokeMethodAsync('Videoconference', 'SendIceCandidate', JSON.stringify(candidate), peeringObj.clientOffering, peeringObj.clientAnswering);
        }
    }
    addTracksToPeerConnection(stream) {
        //Adding to the peerconnection
        stream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, stream);
        });
    }
    gotRemoteStream(event, peeringObj) {
        console.log('got remote stream');
        this.remoteVideo = document.getElementById(this.generatedId);
        if (!this.remoteVideo) {
            this.remoteVideo = document.createElement('video');
            this.remoteVideo.classList.add('video');
            this.remoteVideo.setAttribute('id', this.generatedId);
            this.remoteVideo.autoplay = true;
            document.querySelector('.videoboard').appendChild(this.remoteVideo);
            console.log("Video ID " + this.generatedId + " for displaying: " + peeringObj.clientAnswering + " or " + peeringObj.clientOffering);
        }
        peeringObj.remoteVideo.srcObject = event.streams[0];
        //adaptVideos();
    }
    //Pairing through signaling
    async createOffer() {
        console.log(this.peerConnection);
        try {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            console.log("STEP 1: offer created and inserted as local description.");
            console.log(offer);
            console.log(this.peerConnection);
            console.log("STEP 2: offer sended.");
            return offer;
        }
        catch (error) {
            console.error('ERROR: creating an offer.', error);
        }
    }
    async createAnswer() {
        try {
            console.log("dfg");
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            console.log("STEP 5: answer created and inserted as local description.");
            console.log(answer);
            console.log("STEP 6: answer sended.");
            return answer;
        }
        catch (error) {
            console.error('ERROR: creating an answer.', error);
        }
    }
}
let client;
//Invokable functions
async function invokable_initClient(connectionId, roomId) {
    console.log("INVOKABLE: initClient");
    client = new Client(connectionId, { roomId: roomId });
    await client.getUserMedia();
    window.DotNet.invokeMethodAsync('Videoconference', 'ClientHasBeenFixed');
    window.DotNet.invokeMethodAsync('Videoconference', 'StartCall');
}
async function invokable_peeringAlreadyExists(clientAnswering) {
    let peering = client.getPeeringByAnsweringClient(clientAnswering) || client.getPeeringByOfferingClient(clientAnswering);
    if (peering) {
        return true;
    }
    else {
        return false;
    }
}
//to initialize the peering object with the answering client id in it
async function invokable_createPeeringsForOfferingClient(clientAnswering) {
    console.log("INVOKABLE: peering between " + client.connectionId + " and " + clientAnswering);
    let peering = new Peering(client.connectionId, clientAnswering);
    peering.addTracksToPeerConnection(client.localStream);
    client.peerings.push(peering);
}
async function invokable_createOffer(clientAnswering) {
    console.log("INVOKABLE: create offer");
    let peering = client.getPeeringByAnsweringClient(clientAnswering);
    let offerObj = await peering.createOffer();
    return JSON.stringify(offerObj);
}
async function invokable_createAnswer(offer, clientOffering) {
    console.log("INVOKABLE: create answer");
    console.log("------ STEP 4: offer inserted as the remote description.");
    console.log("THIS IS CLIENT answer :" + client.connectionId);
    let peering = new Peering(clientOffering, client.connectionId);
    peering.addTracksToPeerConnection(client.localStream);
    let offerObj = new RTCSessionDescription(JSON.parse(offer));
    await peering.peerConnection.setRemoteDescription(offerObj);
    let answer = await peering.createAnswer();
    client.peerings.push(peering);
    console.log(peering);
    return JSON.stringify(answer);
}
async function invokable_finalizePeering(answer, clientAnswering) {
    console.log("INVOKABLE: finalizing peering");
    //console.log(JSON.stringify(client));
    let peering = client.getPeeringByAnsweringClient(clientAnswering);
    console.log("STEP 7: answer received.");
    let answerObj = new RTCSessionDescription(JSON.parse(answer));
    console.log(answerObj);
    await peering.peerConnection.setRemoteDescription(answerObj);
    console.log("FINAL");
    console.log(peering);
}
async function invokable_onReceiveIceCandidate(iceCandidate, sender) {
    let iceCandidateObj = new RTCIceCandidate(JSON.parse(iceCandidate));
    console.log("Ice candidate received");
    let peering;
    if (client.getPeeringByAnsweringClient(sender) !== null) {
        peering = client.getPeeringByOfferingClient(sender);
    }
    else {
        peering = client.getPeeringByAnsweringClient(sender);
    }
    console.log(peering);
    peering.peerConnection.addIceCandidate(iceCandidateObj);
}
let nbVideos = 1;
let vpWidth = window.innerWidth;
let vpHeight = window.innerHeight;
console.log(vpWidth);
console.log(vpHeight);
//function invokable_initializeGrid() {
//    window.addEventListener('resize', () => {
//        vpWidth = window.innerWidth;
//        vpHeight = window.innerHeight;
//        adaptVideos();
//    });
//    if (client) {
//        nbVideos = client.numberOfVideoDivs;
//    }
//    //let i = 0;
//    //for (i = 0; i < nbVideos - 2; i++) {
//    //    var d = document.createElement('div')
//    //    d.classList.add('video')
//    //    document.querySelector('.videoboard').appendChild(d)
//    //}
//    adaptVideos();
//};
function adaptVideos() {
    let listVideo = document.querySelectorAll('.video');
    let optimalVideoWidth = getVideoWidth(nbVideos, vpWidth, vpHeight);
    let optimalVideoHeight = ~~((3 / 4) * optimalVideoWidth); //int version
    listVideo.forEach((video, index, array) => {
        video.style.width = optimalVideoWidth + "px";
        video.style.height = optimalVideoHeight + "px";
        video.style.animation = "colorchange 3s ease-in-out " + index / 10 + "s infinite alternate";
    });
}
function getVideoWidth(nbVideos, vpWidth, vpHeight) {
    let nbVideosPerCol = 0;
    let videoWidth = 0;
    let videoHeight = 0;
    let nbRows = 0;
    let heightAllLines = 0;
    while (nbVideosPerCol <= nbVideos) {
        console.log("NEW LOOP: nbVideosPerCol: " + nbVideosPerCol);
        videoWidth = ~~(vpWidth / nbVideosPerCol);
        console.log("videoWidth: " + videoWidth);
        nbRows = Math.floor(nbVideos / nbVideosPerCol) + ((nbVideos % nbVideosPerCol == 0) ? 0 : 1);
        console.log("nbRows: " + nbRows);
        videoHeight = ~~((3 / 4) * videoWidth);
        console.log("videoHeight: " + videoHeight);
        heightAllLines = nbRows * videoHeight;
        console.log("heightAllLines: " + heightAllLines);
        if (heightAllLines <= vpHeight) {
            console.log(videoWidth);
            return videoWidth;
        }
        //Exception to avoid the videos to disappear when they are on one line
        if (nbRows == 1) {
            return videoWidth;
        }
        nbVideosPerCol += 1;
    }
}
//OTHERS
async function invokable_shareScreen() {
    await client.getDisplayMedia();
}
async function invokable_stopSharingScreen() {
    await client.getUserMedia();
}
//# sourceMappingURL=profile.js.map