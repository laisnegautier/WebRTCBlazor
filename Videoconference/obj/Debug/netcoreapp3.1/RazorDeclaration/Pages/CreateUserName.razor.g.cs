#pragma checksum "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\CreateUserName.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "ae9c76e79defe145ec58b0e3149f658c7f4a6554"
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
#line 1 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\CreateUserName.razor"
using System.ComponentModel.DataAnnotations;

#line default
#line hidden
#nullable disable
    public partial class CreateUserName : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
        }
        #pragma warning restore 1998
#nullable restore
#line 20 "C:\Users\Gautier\source\repos\KarmaFlights\Videoconference\Videoconference\Pages\CreateUserName.razor"
       
        [Parameter]
        public EventCallback<string> OnUserNameSet { get; set; }
        string userNameCookie;

        Model model = new Model();
    class Model
    {
        [Required(ErrorMessage = "Insert a user name.")]
        [MinLength(2, ErrorMessage = "At least 2 characters must be inserted.")]
        [MaxLength(20, ErrorMessage = "Insert less than 20 characters.")]
        [RegularExpression(@"^[a-zA-Z0-9-_+\u00C0-\u017F]{0,}$", ErrorMessage = "Only letters (no accent), numbers and -+_ symbols are allowed.")]
        public string UserName { get; set; }
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            userNameCookie = await JSRuntime.InvokeAsync<string>("getCookie", "userNameVideoconference");
            if (!String.IsNullOrEmpty(userNameCookie))
                model.UserName = userNameCookie;

            StateHasChanged();
        }
    }

    async Task SetUserName()
    {
        var test = await JSRuntime.InvokeAsync<string>("setCookie", "userNameVideoconference", model.UserName, 1);
        await OnUserNameSet.InvokeAsync(model.UserName);
    }

#line default
#line hidden
#nullable disable
        [global::Microsoft.AspNetCore.Components.InjectAttribute] private IJSRuntime JSRuntime { get; set; }
    }
}
#pragma warning restore 1591
