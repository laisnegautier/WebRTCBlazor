#pragma checksum "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\CreateRoom.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "114cd5ce086c9e993bc21231e60040e50d8b7ea4"
// <auto-generated/>
#pragma warning disable 1591
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
using Microsoft.AspNetCore.Authorization;

#line default
#line hidden
#nullable disable
#nullable restore
#line 3 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Microsoft.AspNetCore.Components.Authorization;

#line default
#line hidden
#nullable disable
#nullable restore
#line 4 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Microsoft.AspNetCore.Components.Forms;

#line default
#line hidden
#nullable disable
#nullable restore
#line 5 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Microsoft.AspNetCore.Components.Routing;

#line default
#line hidden
#nullable disable
#nullable restore
#line 6 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Microsoft.AspNetCore.Components.Web;

#line default
#line hidden
#nullable disable
#nullable restore
#line 7 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Microsoft.JSInterop;

#line default
#line hidden
#nullable disable
#nullable restore
#line 8 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Videoconference;

#line default
#line hidden
#nullable disable
#nullable restore
#line 9 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Videoconference.Shared;

#line default
#line hidden
#nullable disable
#nullable restore
#line 10 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Videoconference.Pages;

#line default
#line hidden
#nullable disable
#nullable restore
#line 11 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\_Imports.razor"
using Videoconference.Hubs;

#line default
#line hidden
#nullable disable
    public partial class CreateRoom : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
            __builder.OpenElement(0, "div");
            __builder.AddAttribute(1, "class", "centered-div");
            __builder.AddMarkupContent(2, "\r\n    ");
            __builder.AddMarkupContent(3, "<h1>Start a Videoconference</h1>\r\n\r\n    ");
            __builder.AddMarkupContent(4, "<label for=\"basic-url\">Create a room by writing a name</label>\r\n    ");
            __builder.OpenElement(5, "div");
            __builder.AddAttribute(6, "class", "input-group mb-3");
            __builder.AddMarkupContent(7, "\r\n        ");
            __builder.OpenElement(8, "div");
            __builder.AddAttribute(9, "class", "input-group-prepend");
            __builder.AddMarkupContent(10, "\r\n            ");
            __builder.OpenElement(11, "span");
            __builder.AddAttribute(12, "class", "input-group-text");
            __builder.AddAttribute(13, "id", "basic-addon3");
            __builder.AddContent(14, 
#nullable restore
#line 9 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\CreateRoom.razor"
                                                              NavigationManager.BaseUri

#line default
#line hidden
#nullable disable
            );
            __builder.CloseElement();
            __builder.AddMarkupContent(15, "\r\n        ");
            __builder.CloseElement();
            __builder.AddMarkupContent(16, "\r\n        ");
            __builder.OpenElement(17, "input");
            __builder.AddAttribute(18, "value", 
#nullable restore
#line 11 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\CreateRoom.razor"
                       createdRoomId

#line default
#line hidden
#nullable disable
            );
            __builder.AddAttribute(19, "oninput", Microsoft.AspNetCore.Components.EventCallback.Factory.Create<Microsoft.AspNetCore.Components.ChangeEventArgs>(this, 
#nullable restore
#line 11 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\CreateRoom.razor"
                                                FormatingRoomSlug

#line default
#line hidden
#nullable disable
            ));
            __builder.AddAttribute(20, "type", "text");
            __builder.AddAttribute(21, "class", "form-control");
            __builder.AddAttribute(22, "id", "basic-url");
            __builder.AddAttribute(23, "aria-describedby", "basic-addon3");
            __builder.CloseElement();
            __builder.AddMarkupContent(24, "\r\n    ");
            __builder.CloseElement();
            __builder.AddMarkupContent(25, "\r\n");
#nullable restore
#line 13 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\CreateRoom.razor"
     if (!roomInputIsValid)
    {

#line default
#line hidden
#nullable disable
            __builder.AddContent(26, "        ");
            __builder.AddMarkupContent(27, "<strong>Some characters are not allowed</strong>\r\n");
#nullable restore
#line 16 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\CreateRoom.razor"
    }

#line default
#line hidden
#nullable disable
            __builder.AddContent(28, "    ");
            __builder.OpenElement(29, "button");
            __builder.AddAttribute(30, "class", "btn");
            __builder.AddAttribute(31, "disabled", 
#nullable restore
#line 17 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\CreateRoom.razor"
                                    !roomInputIsValid

#line default
#line hidden
#nullable disable
            );
            __builder.AddAttribute(32, "onclick", Microsoft.AspNetCore.Components.EventCallback.Factory.Create<Microsoft.AspNetCore.Components.Web.MouseEventArgs>(this, 
#nullable restore
#line 17 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\CreateRoom.razor"
                                                                  CreateAndStartVideoconference

#line default
#line hidden
#nullable disable
            ));
            __builder.AddContent(33, "Launch the videoconference");
            __builder.CloseElement();
            __builder.AddMarkupContent(34, "\r\n\r\n");
            __builder.CloseElement();
        }
        #pragma warning restore 1998
#nullable restore
#line 21 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\CreateRoom.razor"
       
    string createdRoomId = "";
    bool roomInputIsValid = true;

    void FormatingRoomSlug(ChangeEventArgs e)
    {
        createdRoomId = (e.Value.ToString()).ToUpper();
        roomInputIsValid = Uri.IsWellFormedUriString(NavigationManager.BaseUri + createdRoomId, UriKind.RelativeOrAbsolute);
    }

    void CreateAndStartVideoconference()
        => NavigationManager.NavigateTo(NavigationManager.BaseUri + createdRoomId);

#line default
#line hidden
#nullable disable
        [global::Microsoft.AspNetCore.Components.InjectAttribute] private NavigationManager NavigationManager { get; set; }
    }
}
#pragma warning restore 1591