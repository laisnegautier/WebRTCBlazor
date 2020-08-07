#pragma checksum "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\Videoboard.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "42b7178feaacb7d8a5c4cb7f5a3ada55a99a06c8"
// <auto-generated/>
#pragma warning disable 1591
#pragma warning disable 0414
#pragma warning disable 0649
#pragma warning disable 0169

namespace Videoconference.Pages
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Components;
#nullable restore
#line 1 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using System.Net.Http;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using System.Diagnostics;

#line default
#line hidden
#nullable disable
#nullable restore
#line 3 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Microsoft.AspNetCore.Authorization;

#line default
#line hidden
#nullable disable
#nullable restore
#line 4 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Microsoft.AspNetCore.Components.Authorization;

#line default
#line hidden
#nullable disable
#nullable restore
#line 5 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Microsoft.AspNetCore.Components.Forms;

#line default
#line hidden
#nullable disable
#nullable restore
#line 6 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Microsoft.AspNetCore.Components.Routing;

#line default
#line hidden
#nullable disable
#nullable restore
#line 7 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Microsoft.AspNetCore.Components.Web;

#line default
#line hidden
#nullable disable
#nullable restore
#line 8 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Microsoft.JSInterop;

#line default
#line hidden
#nullable disable
#nullable restore
#line 9 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Videoconference;

#line default
#line hidden
#nullable disable
#nullable restore
#line 10 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Videoconference.Shared;

#line default
#line hidden
#nullable disable
#nullable restore
#line 11 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Videoconference.Pages;

#line default
#line hidden
#nullable disable
#nullable restore
#line 12 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Videoconference.Hubs;

#line default
#line hidden
#nullable disable
#nullable restore
#line 3 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\Videoboard.razor"
using Microsoft.AspNetCore.SignalR.Client;

#line default
#line hidden
#nullable disable
    public partial class Videoboard : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
        }
        #pragma warning restore 1998
#nullable restore
#line 66 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\Videoboard.razor"
       
    [Parameter]
    public string RoomId { get; set; }

    [Parameter]
    public string UserName { get; set; }

    HashSet<ClientIds> ClientsInRoom = new HashSet<ClientIds>();

    bool videoconferenceManuallyClosed = false;

    HubConnection HubConnection;
    List<string> groupMessages = new List<string>();


    protected override async Task OnInitializedAsync()
    {
        SendIceCandidateFunc = SendIceCandidateInvoke;

        await InitializeAndAddToHubAsync();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        // Very important to not load this twice
        if (firstRender)
        {
            //await JSRuntime.InvokeVoidAsync("invokable_initializeGrid");
        }
    }

    async Task InitializeAndAddToHubAsync()
    {
        // Connection creation
        HubConnection = new HubConnectionBuilder()
            .WithUrl(NavigationManager.ToAbsoluteUri("/webRTCHub"))
            .WithAutomaticReconnect()
            .Build();

        ConfigureHubLifeCycle(HubConnection);

        ConfigureHubHandlers(HubConnection);

        await ConnectToHub(HubConnection);

        // Adding the connection id to the group
        await HubConnection.SendAsync("AddToGroup", RoomId, HubConnection.ConnectionId, UserName);
        await HubConnection.SendAsync("NotifyChangeInConnectedClientsInRoom", RoomId);
    }

    async Task ConnectToHub(HubConnection hubConnection)
    {
        // Try to start the connection with automatic reconnection
        System.Threading.CancellationTokenSource cts = new System.Threading.CancellationTokenSource();
        await HubHelpers.ConnectWithRetryAsync(hubConnection, cts.Token);
        cts.Dispose();
    }

    void ConfigureHubHandlers(HubConnection hubConnection)
    {
        HubConnection.On("NotificationChangeInConnectedClientsInRoom", () => UpdateListConnectedClientsInRoom());

        HubConnection.On<string>("SendMessageToGroup", message => UpdateMessageGroup(message));

        HubConnection.On<string, string>("OfferReceived", async (offer, clientOffering) => await OnReceiveOffer(offer, clientOffering));
        HubConnection.On<string, string>("AnswerReceived", async (answer, clientAnswering) => await OnAnswerReceived(answer, clientAnswering));
        //HubConnection.On<string, string>("IceCandidateReceived", async (iceCandidate, sender) => await OnIceCandidateReceived(iceCandidate, sender));
        HubConnection.On<string, string>("IceCandidateReceived", (iceCandidate, sender) => OnIceCandidateReceived(iceCandidate, sender));

    }


    void ConfigureHubLifeCycle(HubConnection hubConnection)
    {
        hubConnection.Reconnecting += error =>
        {
            Debug.Assert(HubConnection.State == HubConnectionState.Reconnecting);

            // Notify users the connection was lost and the client is reconnecting.
            // Start queuing or dropping messages.

            return Task.CompletedTask;
        };

        hubConnection.Reconnected += connectionId =>
        {
            Debug.Assert(HubConnection.State == HubConnectionState.Connected);

            // Notify users the connection was reestablished.
            // Start dequeuing messages queued while reconnecting if any.

            return Task.CompletedTask;
        };

        hubConnection.Closed += async error =>
        {
            Debug.Assert(hubConnection.State == HubConnectionState.Disconnected);

            // Notify users the connection has been closed or manually try to restart the connection.
            // Here should offer a modal to say goodbye with choice to rejoin again
            // NEED TO CLOSE VIDEO AND ALL
            await JSRuntime.InvokeVoidAsync("invoke_closeConnection");

            await Task.CompletedTask;
        };
    }

    async Task LeaveVideoconference()
    {
        videoconferenceManuallyClosed = true;
        await HubConnection.StopAsync();
    }

    async Task ReconnectAfterLeavingVideoconference()
    {
        videoconferenceManuallyClosed = false;
        await ConnectToHub(HubConnection);
    }

    void UpdateListConnectedClientsInRoom()
    {
        ClientsInRoom = HubHelpers.GetConnectedClientsInRoom(RoomId);
        StateHasChanged();
    }

    void UpdateMessageGroup(string message)
    {
        groupMessages.Add(message);
        StateHasChanged();
    }

    async Task CallEveryone()
    {
        string clientOffering;
        string clientAnswering;

        foreach (ClientIds client in ClientsInRoom)
        {
            if (client.ConnectionId != HubConnection.ConnectionId)
            {
                clientOffering = HubConnection.ConnectionId;
                clientAnswering = client.ConnectionId;

                //to initialize the peering object with the answering client id in it
                await JSRuntime.InvokeVoidAsync("invokable_createPeeringsForOfferingClient", clientAnswering);

                string offer = await JSRuntime.InvokeAsync<string>("invokable_createOffer", clientAnswering);
                await HubConnection.SendAsync("SendOffer", offer, clientOffering, clientAnswering);
            }
        }
    }

    async Task OnReceiveOffer(string offer, string clientOffering)
    {
        string answer = await JSRuntime.InvokeAsync<string>("invokable_createAnswer", offer, clientOffering);
        await HubConnection.SendAsync("SendAnswer", answer, clientOffering, HubConnection.ConnectionId);
    }

    async Task OnAnswerReceived(string answer, string clientAnswering)
        => await JSRuntime.InvokeVoidAsync("invokable_finalizePeering", answer, clientAnswering);

    //async Task OnIceCandidateReceived(string iceCandidate, string sender)
    //    => await JSRuntime.InvokeVoidAsync("invokable_onReceiveIceCandidate", iceCandidate, sender);


    async Task OnIceCandidateReceived(string iceCandidate, string sender)
    {
        //Console.WriteLine(iceCandidate + " et " + sender);
        await JSRuntime.InvokeVoidAsync("invokable_onReceiveIceCandidate", iceCandidate, sender);
    }

    [JSInvokable]
    public static void SendIceCandidate(string iceCandidate, string sender, string receiver)
    {
        SendIceCandidateFunc.Invoke(iceCandidate, sender, receiver);
    }

    static Func<string, string, string, Task> SendIceCandidateFunc;
    async Task SendIceCandidateInvoke(string iceCandidate, string sender, string receiver)
    {
        //determining who is the ICE sender
        if (sender == HubConnection.ConnectionId)
            await HubConnection.SendAsync("SendIceCandidate", iceCandidate, sender, receiver);
        else
            await HubConnection.SendAsync("SendIceCandidate", iceCandidate, receiver, sender);
    }





    async Task ShareScreen()
    {
        await JSRuntime.InvokeVoidAsync("invokable_shareScreen");
    }

#line default
#line hidden
#nullable disable
        [global::Microsoft.AspNetCore.Components.InjectAttribute] private NavigationManager NavigationManager { get; set; }
        [global::Microsoft.AspNetCore.Components.InjectAttribute] private IJSRuntime JSRuntime { get; set; }
    }
}
#pragma warning restore 1591
