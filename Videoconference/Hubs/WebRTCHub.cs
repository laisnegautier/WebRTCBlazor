using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Videoconference.Hubs
{
    public class ClientIds
    {
        public string RoomId;
        public string ConnectionId;
        public string UserName;

        public ClientIds(string roomId, string connectionId, string userName)
        {
            RoomId = roomId;
            ConnectionId = connectionId;
            UserName = userName;
        }
    }

    public static class HubHelpers
    {
        //Hashset of <roomId, connectionId, userName>
        public static HashSet<ClientIds> ConnectedClients = new HashSet<ClientIds>();
        
        public static HashSet<ClientIds> GetConnectedClientsInRoom(string roomId)
            => ConnectedClients.Where(x => x.RoomId == roomId).ToHashSet();

        public static async Task<bool> ConnectWithRetryAsync(HubConnection hubConnection, CancellationToken token)
        {
            // Keep trying to until we can start
            while (true)
            {
                try
                {
                    await hubConnection.StartAsync(token);
                    Debug.Assert(hubConnection.State == HubConnectionState.Connected);
                    return true;
                }
                catch when (token.IsCancellationRequested)
                {
                    return false;
                }
                catch
                {
                    // Failed to connect, trying again in 5000 ms.
                    Debug.Assert(hubConnection.State == HubConnectionState.Disconnected);
                    await Task.Delay(5000);
                }
            }
        }
    }

    public class WebRTCHub : Hub
    {
        //LIFE CYCLE
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            //doesnt work
            //HubHelpers.ConnectedClients.Remove(currentClient);
            await base.OnDisconnectedAsync(exception);
        }

        //1
        public async Task AddToGroup(string roomId, string connectionId, string userName)
        {
            await Groups.AddToGroupAsync(connectionId, roomId);
            Console.WriteLine("connectionId +" + connectionId + " in room " + roomId);

            ClientIds clientIds = new ClientIds(roomId, connectionId, userName);
            HubHelpers.ConnectedClients.Add(clientIds);
        }

        //To use when adding, removing or else with the list of clients
        public async Task NotifyChangeInConnectedClientsInRoom(string roomId)
            => await Clients.Group(roomId).SendAsync("NotificationChangeInConnectedClientsInRoom");

        public async Task SendOffer(string offer, string clientOffering, string clientAnswering)
            => await Clients.Client(clientAnswering).SendAsync("OfferReceived", offer, clientOffering, clientAnswering);

        public async Task SendAnswer(string answer, string clientOffering, string clientAnswering)
            => await Clients.Client(clientOffering).SendAsync("AnswerReceived", answer, clientOffering, clientAnswering);

        //public async Task NotifyGroupOfNewClient(string connectionId)
        //3
        public async Task MessageToGroup(string message, string groupName)
            => await Clients.Group(groupName).SendAsync("SendMessageToGroup", message);
        
        //public async Task SendOffer(string offer, string groupName)
        //    => await Clients.OthersInGroup(groupName).SendAsync("OfferReceived", offer);

        //public async Task SendAnswer(string answer, string groupName)
        //    => await Clients.OthersInGroup(groupName).SendAsync("AnswerReceived", answer);

        public async Task SendIceCandidate(string iceCandidate, string groupName)
            => await Clients.OthersInGroup(groupName).SendAsync("IceCandidateReceived", iceCandidate);
    }
}
