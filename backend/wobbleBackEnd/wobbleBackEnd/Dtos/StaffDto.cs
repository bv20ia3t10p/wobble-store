using System.ComponentModel.DataAnnotations;

namespace wobbleBackEnd.Dtos
{
    public record UpdateStaffDto
    {
        [Required]
        public string CustomerEmail { get; init; }
        [Required]
        public string Role { get; init; }
    }
    public record CreateStaffDto
    {
        public string? CustomerEmail { get; init; }
        public int? CustomerId { get; init; }
        public string Role { get; init; }
    }
}

