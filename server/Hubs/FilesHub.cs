using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace server.Hubs
{
    public class FilesHub : Hub
    {
        private readonly string _groupName;

        public FilesHub(IConfiguration config)
        {
            _groupName = config["groupName"];
        }

        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, _groupName);
            await base.OnConnectedAsync();
        }
    }
}