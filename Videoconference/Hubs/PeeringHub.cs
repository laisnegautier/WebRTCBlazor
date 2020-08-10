using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

namespace Videoconference.Hubs
{
    public class UserInRoom
    {
        public string RoomId { get; set; }
        public string ConnectionId { get; set; }
        public string UserName { get; set; }
    }

    public class PeeringHub : Hub
    {
        private static HashSet<UserInRoom> CurrentConnections = new HashSet<UserInRoom>();

        public async Task Connect(string roomId, string userName)
        {
            if (CurrentConnections.Count(x => x.ConnectionId == Context.ConnectionId) == 0)
                CurrentConnections.Add(new UserInRoom { RoomId = roomId, ConnectionId = Context.ConnectionId, UserName = userName });

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            Console.WriteLine("The client " + userName + " has been added to the room " + roomId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // we get the room in which the user was
            UserInRoom userDisconnected = CurrentConnections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);

            // then we send a message to every client of the room for them to act accordingly
            await Clients.OthersInGroup(userDisconnected.RoomId).SendAsync("peerHasLeft", userDisconnected.ConnectionId);
            await Groups.RemoveFromGroupAsync(userDisconnected.ConnectionId, userDisconnected.RoomId);

            if (userDisconnected != null)
                CurrentConnections.Remove(userDisconnected);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendOffer(string offer, string peerUser)
            => await Clients.Client(peerUser).SendAsync("ReceiveOffer", offer, Context.ConnectionId);

        public async Task SendAnswer(string answer, string peerUser)
            => await Clients.Client(peerUser).SendAsync("ReceiveAnswer", answer, Context.ConnectionId);

        public async Task SendIceCandidate(string iceCandidate, string peerUser)
            => await Clients.Client(peerUser).SendAsync("AddIceCandidate", iceCandidate, Context.ConnectionId);

        //public async Task SendIceCandidate(string candidate, string peerUser)
        //    => await Clients.Client(peerUser).SendAsync("ReceiveIceCandidate", candidate, Context.ConnectionId);

        //return list of all active connections
        public string GetAllActiveConnectionsInRoom(string roomId)
            => JsonSerializer.Serialize(CurrentConnections.Where(user => user.RoomId == roomId && user.ConnectionId != Context.ConnectionId).ToList());
    }
}