using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.IO;
using Microsoft.AspNetCore.SignalR;
using server.Hubs;

namespace server.Controllers 
{
    [ApiController]
    [Route("[controller]")]
    public class FileUploadController: ControllerBase
    {
        private readonly string _filePath;
        private readonly long _maxFileSize;
        private readonly string[] _allowedExtensions;
        private readonly IHubContext<FilesHub> _hubContext;
        private readonly string _groupName;

        public FileUploadController(IConfiguration config, IHubContext<FilesHub> hubContext) {
            _filePath = Path.Combine(Directory.GetCurrentDirectory(),
                config["StoredFilesPath"]);
            _maxFileSize = Int64.Parse(config["MaxFileSize"]);
            _allowedExtensions = config.GetSection("AllowedFileExtensions")
                .GetChildren()
                .ToArray()
                .Select(s => s.Value)
                .ToArray();
            if (!Directory.Exists(_filePath)) {
                Directory.CreateDirectory(_filePath);
            }
            _hubContext = hubContext;
            _groupName = config["groupName"];
        }

        [HttpPost]
        public async Task<IActionResult> OnPostUploadAsync(List<IFormFile> files)
        {
            long size = files.Sum(f => f.Length);
            var newFiles = false;
            foreach (var formFile in files)
            {
                var extension = Path.GetExtension(formFile.FileName);
                if (formFile.Length > 0 
                    && formFile.Length <= _maxFileSize
                    && _allowedExtensions.Contains(extension))
                {
                    newFiles = true;
                    var randomName = Path.GetRandomFileName();
                    randomName = Path.ChangeExtension(randomName, extension);
                    var filePath = Path.Combine(_filePath, 
                        randomName);

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
            }
            if (newFiles)
            {
                Console.WriteLine(_hubContext);
                Console.WriteLine(_hubContext.Clients.Group(_groupName));
                await _hubContext.Clients.Group(_groupName).SendAsync("updateFiles");
            }

            return Ok(new { count = files.Count, size });
        }

        [HttpDelete("{name}")]
        public ActionResult DeletePicture(string name)
        {
            var fullPath = Path.Combine(_filePath, name);
            if (System.IO.File.Exists(fullPath)) {
                System.IO.File.Delete(fullPath);
                _hubContext.Clients.Group(_groupName).SendAsync("updateFiles");
            }
            return Ok();
        }
    }
}