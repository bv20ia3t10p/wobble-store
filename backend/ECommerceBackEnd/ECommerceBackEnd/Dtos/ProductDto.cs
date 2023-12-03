using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace ECommerceBackEnd.Dtos
{
    public record CreateProductDto
    {
        public int DepartmentId { get; set; }
        public int CategoryId { get; set; }
        public string ProductName { get; set; }
        public double ProductPrice { get; set; }
        public bool ProductStatus { get; set; }
        public string ProductDescription { get; set; }
    }
    public record ProductDto
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        [Key]
        public int ProductCardId { get; set; }
        public string ProductName { get; set; }
        public double ProductPrice { get; set; }
        public bool ProductStatus { get; set; }
        public string ProductDescription { get; set; }
        public int ProductSoldQuantity { get; set; }

    }
    public record UpdateProductDto
    {
        public int DepartmentId { get; set; }
        public int CategoryId { get; set; }
        public string ProductName { get; set; }
        public double ProductPrice { get; set; }
        public bool ProductStatus { get; set; }
        public string ProductDescription { get; set; }

    }
}
