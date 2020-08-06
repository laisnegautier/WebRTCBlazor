/**
 * When a client enters a room:
 *      1/ configure its own media
 *      2/ prepare his peering connection
 *      2/ check all the other clients
 */

interface Room { roomId: string; }

class Client {
    connectionId: string;
    room: Room;
    localVideo: string;
    localStream: MediaStream;

    peeredUsers: Array<Peering>;

    constructor(connectionId: string, room: Room) {
        this.connectionId = connectionId;
        this.room = room;
        this.peeredUsers = new Array<Peering>(0);
    }
    
    getMedia(): void {
    }

    addRemoteVideo(): void {
    }
}

class Peering {
    //only the connection ids are shared
    clientOffering: string;
    clientAnswering: string;

    peerConnectionConfig: RTCConfiguration;
    peerConnection: RTCPeerConnection;

    constructor(clientOffering: string, clientAnswering: string) {
        this.clientOffering = clientOffering;
        this.clientAnswering = clientAnswering;
        this.peerConnectionConfig = { 'iceServers': [{ 'urls': 'stun:stun.services.mozilla.com' }, { 'urls': 'stun:stun.l.google.com:19302' }] };
    }

    //Pairing through signaling
    createOffer(): void {
    }

    sendOffer(): void {
    }

    receiveOffer(): void {
    }

    sendAnswer(): void {
    }
}

let client: Client;

//Invokable functions
function invokable_initClient(connectionId: string, roomId: string) {
    client = new Client(connectionId, { roomId: roomId });

    //when connecting, add himself to every other peer client

}