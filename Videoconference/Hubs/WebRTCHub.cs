using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Videoconference.Hubs
{
    public class WebRTCHub : Hub
    {
        public async Task AddToGroup(string connectionId, string groupName)
            => await Groups.AddToGroupAsync(connectionId, groupName);

        public async Task MessageToGroup(string message, string groupName)
            => await Clients.Group(groupName).SendAsync("SendMessageToGroup", message);
        
        public async Task SendOffer(string offer, string groupName)
            => await Clients.OthersInGroup(groupName).SendAsync("OfferReceived", offer);

        public async Task SendAnswer(string answer, string groupName)
            => await Clients.OthersInGroup(groupName).SendAsync("AnswerReceived", answer);

        public async Task SendIceCandidate(string iceCandidate, string groupName)
            => await Clients.OthersInGroup(groupName).SendAsync("IceCandidateReceived", iceCandidate);
    }
}
