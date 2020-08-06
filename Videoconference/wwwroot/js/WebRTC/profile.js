/**
 * When a client enters a room:
 *      1/ configure its own media
 *      2/ prepare his peering connection
 *      2/ check all the other clients
 */
var Client = /** @class */ (function () {
    function Client(connectionId, room) {
        this.connectionId = connectionId;
        this.room = room;
        this.peeredUsers = new Array(0);
    }
    Client.prototype.getMedia = function () {
    };
    Client.prototype.addRemoteVideo = function () {
    };
    return Client;
}());
var Peering = /** @class */ (function () {
    function Peering(clientOffering, clientAnswering) {
        this.clientOffering = clientOffering;
        this.clientAnswering = clientAnswering;
        this.peerConnectionConfig = { 'iceServers': [{ 'urls': 'stun:stun.services.mozilla.com' }, { 'urls': 'stun:stun.l.google.com:19302' }] };
    }
    //Pairing through signaling
    Peering.prototype.createOffer = function () {
    };
    Peering.prototype.sendOffer = function () {
    };
    Peering.prototype.receiveOffer = function () {
    };
    Peering.prototype.sendAnswer = function () {
    };
    return Peering;
}());
var client;
//Invokable functions
function invokable_initClient(connectionId, roomId) {
    client = new Client(connectionId, { roomId: roomId });
    //when connecting, add himself to every other peer client
}
//# sourceMappingURL=profile.js.map