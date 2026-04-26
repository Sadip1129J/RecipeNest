using BCrypt.Net;

namespace RecipeNest.Api.Helpers
{
    // PasswordHelper: wraps BCrypt hashing for passwords.
    public class PasswordHelper
    {
        // Hash a plain-text password using BCrypt
        public string Hash(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Verify a plain-text password against a BCrypt hash
        public bool Verify(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}
