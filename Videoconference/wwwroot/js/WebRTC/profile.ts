interface Room { roomId: string; }

class Client {
    connectionId: string;
    room: Room;
    localVideo;
    localStream: MediaStream;

    peerings: Array<Peering>;

    constructor(connectionId: string, room: Room) {
        this.connectionId = connectionId;
        this.room = room;
        this.peerings = new Array<Peering>(0);
        this.localVideo = document.querySelector("#localVideo");
    }

    async getUserMedia(): Promise<void> {
        if (navigator.getUserMedia) {
            try {
                const constraints = { 'video': true, 'audio': true };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                this.localStream = stream;
                this.localVideo.srcObject = stream;
            } catch (error) {
                console.error('Error opening video camera.', error);
            }
        }
        else {
            console.log('Your browser does not support getUserMedia API');
        }
    }

    addRemoteVideo(): void {
    }

    getPeeringByOfferingClient(clientOffering: string) {
        return this.peerings.find(x => x.clientOffering === clientOffering);
    }

    getPeeringByAnsweringClient(clientAnswering: string) {
        //console.log("LOOOOOOP");
        //this.peerings.forEach(x => console.log(x));
        return this.peerings.find(x => x.clientAnswering === clientAnswering);
    }
}

class Peering {
    //only the connection ids are shared
    clientOffering: string;
    clientAnswering: string;

    remoteVideo: HTMLMediaElement;

    peerConnectionConfig: RTCConfiguration;
    peerConnection: RTCPeerConnection;

    constructor(clientOffering: string, clientAnswering: string) {
        this.clientOffering = clientOffering;
        this.clientAnswering = clientAnswering;
        this.peerConnectionConfig = { 'iceServers': [{ 'urls': 'stun:stun.services.mozilla.com' }, { 'urls': 'stun:stun.l.google.com:19302' }] };
        this.peerConnection = new RTCPeerConnection(this.peerConnectionConfig);

        this.remoteVideo = document.querySelector("#remoteVideo");
        this.peerConnection.onicecandidate = (event) => this.onDetectIceCandidate(event, this);
        this.peerConnection.ontrack = (event) => this.gotRemoteStream(event, this);
    }

    onDetectIceCandidate(event: any, peeringObj: Peering) {
        if (event.candidate != null) {
            console.log('ice candidate sent');
            let candidate = new RTCIceCandidate(event.candidate);
            (window as any).DotNet.invokeMethodAsync('Videoconference', 'SendIceCandidate', JSON.stringify(candidate), peeringObj.clientOffering, peeringObj.clientAnswering);
        }
    }

    addTracksToPeerConnection(stream: MediaStream): void {
        //Adding to the peerconnection
        stream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, stream);
        });
    }

    gotRemoteStream(event, peeringObj: Peering): void {
        console.log('got remote stream');
        peeringObj.remoteVideo.srcObject = event.streams[0];
    }

    //Pairing through signaling
    async createOffer(): Promise<RTCSessionDescriptionInit> {
        console.log(this.peerConnection);
        try {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            console.log("STEP 1: offer created and inserted as local description.");
            console.log(offer);
            console.log(this.peerConnection);

            console.log("STEP 2: offer sended.");
            return offer;
        } catch (error) {
            console.error('ERROR: creating an offer.', error);
        }
    }

    async createAnswer(): Promise<RTCSessionDescriptionInit> {
        try {
            console.log("dfg");

            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            console.log("STEP 5: answer created and inserted as local description.");
            console.log(answer);

            console.log("STEP 6: answer sended.");
            return answer;
        } catch (error) {
            console.error('ERROR: creating an answer.', error);
        }
    }
}

let client: Client;

//Invokable functions
async function invokable_initClient(connectionId: string, roomId: string): Promise<void> {
    console.log("INVOKABLE: initClient");
    client = new Client(connectionId, { roomId: roomId });
    await client.getUserMedia();
}

//to initialize the peering object with the answering client id in it
async function invokable_createPeeringsForOfferingClient(clientAnswering: string): Promise<void> {
    console.log("INVOKABLE: peering between " + client.connectionId + " and " + clientAnswering);

    let peering: Peering = new Peering(client.connectionId, clientAnswering);
    peering.addTracksToPeerConnection(client.localStream);
    client.peerings.push(peering);
}

async function invokable_createOffer(clientAnswering: string): Promise<string> {
    console.log("INVOKABLE: create offer");

    let peering: Peering = client.getPeeringByAnsweringClient(clientAnswering);
    let offerObj = await peering.createOffer();

    return JSON.stringify(offerObj);
}

async function invokable_createAnswer(offer: string, clientOffering: string): Promise<string> {
    console.log("INVOKABLE: create answer");
    console.log("------ STEP 4: offer inserted as the remote description.");
    console.log("THIS IS CLIENT answer :" + client.connectionId);
    let peering: Peering = new Peering(clientOffering, client.connectionId);
    peering.addTracksToPeerConnection(client.localStream);

    let offerObj = new RTCSessionDescription(JSON.parse(offer));

    await peering.peerConnection.setRemoteDescription(offerObj);

    let answer = await peering.createAnswer();

    client.peerings.push(peering);
    console.log(peering);

    return JSON.stringify(answer);
}

async function invokable_finalizePeering(answer: string, clientAnswering: string): Promise<void> {
    console.log("INVOKABLE: finalizing peering");

    //console.log(JSON.stringify(client));
    let peering: Peering = client.getPeeringByAnsweringClient(clientAnswering);

    console.log("STEP 7: answer received.");
    let answerObj = new RTCSessionDescription(JSON.parse(answer));
    console.log(answerObj);

    await peering.peerConnection.setRemoteDescription(answerObj);

    console.log("FINAL");
    console.log(peering);
}

async function invokable_onReceiveIceCandidate(iceCandidate: string, sender: string): Promise<void> {
    let iceCandidateObj = new RTCIceCandidate(JSON.parse(iceCandidate));
    console.log("Ice candidate received");

    let peering: Peering;
    if (client.getPeeringByAnsweringClient(sender) !== null) {
        peering = client.getPeeringByOfferingClient(sender);
    }
    else {
        peering = client.getPeeringByAnsweringClient(sender);
    }

    console.log(peering);
    peering.peerConnection.addIceCandidate(iceCandidateObj);
}
