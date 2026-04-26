using System.ComponentModel.DataAnnotations;

namespace RecipeNest.Api.DTOs.Reviews
{
    public class ReviewDto
    {
        public string Id { get; set; }
        public string RecipeId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateReviewDto
    {
        [Required, Range(1, 5)]
        public int Rating { get; set; } // 1-5
        [Required]
        public string Comment { get; set; }
    }
}
