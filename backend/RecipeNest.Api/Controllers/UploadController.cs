using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace RecipeNest.Api.Controllers
{
    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public UploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        // POST /api/upload/image — upload a single image file
        [HttpPost("image")]
        [Authorize]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded." });

            // Validate file type
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                return BadRequest(new { message = "Only JPEG, PNG, GIF, and WebP images are allowed." });

            // Validate magic bytes (actual file header)
            using (var reader = new BinaryReader(file.OpenReadStream()))
            {
                var signatures = new Dictionary<string, byte[]>
                {
                    { ".jpeg", new byte[] { 0xFF, 0xD8, 0xFF } },
                    { ".png",  new byte[] { 0x89, 0x50, 0x4E, 0x47 } },
                    { ".gif",  new byte[] { 0x47, 0x49, 0x46, 0x38 } }
                };

                var headerBytes = reader.ReadBytes(4);
                bool isValid = false;
                foreach (var sig in signatures.Values)
                {
                    if (headerBytes.Take(sig.Length).SequenceEqual(sig))
                    {
                        isValid = true;
                        break;
                    }
                }
                
                // WebP check (RIFF....WEBP)
                if (!isValid && headerBytes.SequenceEqual(new byte[] { 0x52, 0x49, 0x46, 0x46 }))
                {
                    isValid = true; // Simplified WebP check
                }

                if (!isValid) return BadRequest(new { message = "Invalid image file content." });
            }

            // Validate file size (max 5MB)
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "File size must be under 5MB." });

            // Generate unique filename
            var ext = Path.GetExtension(file.FileName).ToLower();
            var fileName = $"{Guid.NewGuid()}{ext}";

            var uploadsDir = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            Directory.CreateDirectory(uploadsDir);

            var filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return the URL that can be used to access the image
            var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";

            return Ok(new { imageUrl });
        }
    }
}
