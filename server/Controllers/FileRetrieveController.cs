using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FileRetrieveController: ControllerBase
    {
        private readonly string _filePath;

        public FileRetrieveController(IConfiguration config)
        {
            _filePath = Path.Combine(Directory.GetCurrentDirectory(),
                config["StoredFilesPath"]);
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetPicture(string name)
        {
            var fullPath = Path.Combine(_filePath, name);
            var extension = Path.GetExtension(name);
            var mime = extension == ".png" ? "image/png" : "image/jpeg";
            if (!System.IO.File.Exists(fullPath)) {
                return NotFound();
            }
            return PhysicalFile(fullPath, mime);
        }

        [HttpGet]
        public ActionResult<List<string>> GetAll()
        {
            List<string> res = new List<string>();
            foreach (string fileName in Directory.EnumerateFiles(_filePath))
            {
                var tempName = fileName.Substring(_filePath.Length);
                res.Add(tempName);
            }
            return res;
        }
    }
}