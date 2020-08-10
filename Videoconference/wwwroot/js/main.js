/**
 * HUB CONNECTION AND CONFIGURATION
 * */
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/peeringHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function start() {
    try {
        await connection.start();
        console.log("Client connected to Hub");
    } catch (err) {
        console.log(err);
        setTimeout(() => start(), 5000);
    }
};

connection.onclose(async () => { await start(); });

// Start the connection.
start();


class LocalClient {
    constructor(roomId, userName) {
        this.roomId = roomId;
        this.userName = userName;

        this.userMedia;
        this.localStream;
        this.localVideo;

        this.peerings = [];

        this.getPeeringByPeerClient;
    }

    async getUserMedia() {
        if (navigator.getUserMedia) {
            try {
                const constraints = { 'video': true, 'audio': true };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                this.localStream = stream;
                this.localVideo = document.getElementById('localVideo');
                this.localVideo.srcObject = stream;
            } catch (err) {
                console.error('Error getting user media.', err);
            }
        }
        else {
            console.log('Your browser does not support getUserMedia API');
        }
    }

    getPeeringByPeerClient = (peerClient) => this.peerings.find(peering => peering.peerClient == peerClient);

    deletePeeringWith(peerClient) {
        let peering = this.getPeeringByPeerClient(peerClient);
        let remoteVideoToDelete = document.getElementById(peering.generatedId);
        remoteVideoToDelete.remove();
        this.peerings = this.peerings.filter(peering => peering.peerClient != peerClient)
    }
}

const peerConnectionConfig = { 'iceServers': [{ 'url': 'stun:stun.services.mozilla.com' }, { 'url': 'stun:stun.l.google.com:19302' }] };
class Peering {
    constructor(peerClient) {
        this.peerClient = peerClient;
        this.peerConnection;

        this.remoteVideo;
        this.remoteStream;
        this.generatedId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(peerConnectionConfig);
        this.addTracksToPeerConnection(localClient.localStream);
        this.peerConnection.onicecandidate = (event) => this.onDetectIceCandidate(event, this.peerClient);
        this.peerConnection.ontrack = (event) => this.gotRemoteStream(event);
    }

    async createOffer() {
        try {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            console.log("STEP 1: offer created and inserted as local description.");

            return offer;
        } catch (error) {
            console.error('ERROR: creating an offer.', error);
        }
    }

    async createAnswer() {
        try {
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            console.log("STEP 4: answer created and inserted as local description.");

            return answer;
        } catch (error) {
            console.error('ERROR: creating an answer.', error);
        }
    }

    onDetectIceCandidate(event, peerClient) {
        if (event.candidate != null) {
            let candidate = new RTCIceCandidate(event.candidate);
            connection.invoke("SendIceCandidate", JSON.stringify(candidate), peerClient);
            console.log("Ice candidate send.");
        }
    }

    addIceCandidate(iceCandidate) {
        this.peerConnection.addIceCandidate(iceCandidate);
    }

    addTracksToPeerConnection(stream) {
        //Adding to the peerconnection
        stream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, stream);
        });
    }

    gotRemoteStream(event) {
        console.log('got remote stream');

        this.remoteVideo = document.getElementById(this.generatedId);
        if (!this.remoteVideo) {
            this.remoteVideo = document.createElement('video');
            this.remoteVideo.classList.add('video');
            this.remoteVideo.setAttribute('id', this.generatedId);
            this.remoteVideo.autoplay = true;
            document.querySelector('.videoboard').appendChild(this.remoteVideo);

            //console.log("Video ID " + this.generatedId + " for displaying: " + peeringObj.clientAnswering + " or " + peeringObj.clientOffering);
        }
        console.log('got track', event.track, event.streams);
        this.remoteStream = event.streams[0]
        this.remoteVideo.srcObject = this.remoteStream;
    }
}


/**
 * SCRIPT
 */
let localClient;
async function invokable_initVideoconference(roomId, userName) {
    // Adding to group
    connection.invoke("Connect", roomId, userName).catch(err => console.error(err));

    // Creating local profil and start to display own video
    localClient = new LocalClient(roomId, userName);
    await localClient.getUserMedia();

    await startPeerings();
}

async function startPeerings() {
    //create a peerConnection for each member of the hub
    try {
        let allCurrentUserInRoom = await connection.invoke("GetAllActiveConnectionsInRoom", localClient.roomId);
        allCurrentUserInRoom = JSON.parse(allCurrentUserInRoom);
        console.log(allCurrentUserInRoom);

        // send offer for each person already in the room
        asyncForEach(allCurrentUserInRoom, async (user) => {
            let peering = new Peering(user["ConnectionId"]);
            peering.createPeerConnection();
            let offer = await peering.createOffer();

            await connection.invoke("SendOffer", JSON.stringify(offer), user["ConnectionId"]);
            console.log("STEP 2: offer sended.");

            localClient.peerings.push(peering);
        })
    }
    catch (err) {
        console.log(err);
    }
}

connection.on("ReceiveOffer", async (offer, peerUser) => {
    console.log("STEP 3: offer received");
    offer = new RTCSessionDescription(JSON.parse(offer));
    console.log(offer);

    let peering = new Peering(peerUser);
    peering.createPeerConnection();

    // insert the offer as the remote description
    await peering.peerConnection.setRemoteDescription(offer);

    // ONLY THEN we create answer
    let answer = await peering.createAnswer();

    await connection.invoke("SendAnswer", JSON.stringify(answer), peerUser);
    console.log("STEP 5: answer sended.");

    localClient.peerings.push(peering);
});

connection.on("ReceiveAnswer", async (answer, peerUser) => {
    let peering = localClient.getPeeringByPeerClient(peerUser);

    // insert the answer as the remote description
    answer = new RTCSessionDescription(JSON.parse(answer));
    await peering.peerConnection.setRemoteDescription(answer);

    console.log("PEERING ACHIEVED");
});

connection.on("AddIceCandidate", async (iceCandidate, peer) => {
    iceCandidate = JSON.parse(iceCandidate);
    iceCandidate = new RTCIceCandidate(iceCandidate);

    let peering = localClient.getPeeringByPeerClient(peer);
    //console.log(peering);
    //console.log(peering.peerConnection);

    try {
        await peering.peerConnection.addIceCandidate(iceCandidate);
    }
    catch (err) {

    }
});

connection.on("PeerHasLeft", (peerClient) => {
    console.warn(peerClient + " left the room");
    localClient.deletePeeringWith(peerClient);
});

//helper to do foreach with async
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
