using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace ECommerceBackEnd.Dtos
{
    public record DepartmentDto
    {
        public int DepartmentId { get; init; }
        public string? DepartmentName { get; init; }
    }
    public record CreateDepartmentDto
    {

        [Required]
        public string? DepartmentName { get; init; }
    }
    public record UpdateDepartmentDto
    {
        [Required]
        public int DepartmentId { get; init; }
        [Required]
        public string? DepartmentName { get; init; }
    }
}
