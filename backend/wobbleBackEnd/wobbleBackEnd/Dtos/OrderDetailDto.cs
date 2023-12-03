using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace ECommerceBackEnd.Dtos
{
    public record OrderDetailDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int ProductCardId { get; set; }
        public string? ProductName { get; set; }
        public double? ProductPrice { get; set; }
        public int OrderId { get; set; }
        public double OrderItemDiscount { get; set; }
        public double OrderItemDiscountRate { get; set; }
        [Key]

        public int OrderItemId { get; set; }
        public double OrderItemProfitRatio { get; set; }
        public int OrderItemQuantity { get; set; }
        public double Sales { get; set; }
        public double OrderItemTotal { get; set; }
        public int CustomerId { get; set; }

    }
    public record CreateOrderDetailDto
    {
        public int ProductCardId { get; set; }
        public int OrderId { get; set; }
        //public double OrderItemDiscount { get; set; }
        //public double OrderItemDiscountRate { get; set; }
        //public double OrderItemProductPrice { get; set; }
        //public double OrderItemProfitRatio { get; set; }
        public int OrderItemQuantity { get; set; }
        //public double Sales { get; set; }
        //public double OrderItemTotal { get; set; }
        public int CustomerId { get; set; }
    }
    public record UpdateOrderDetailDto
    {

        public int OrderItemId { get; set; }
        public int ProductCardId { get; set; }
        public double OrderItemDiscount { get; set; }
        public double OrderItemDiscountRate { get; set; }
        public double OrderItemProductPrice { get; set; }
        public double OrderItemProfitRatio { get; set; }
        public int OrderItemQuantity { get; set; }
        public double Sales { get; set; }
        public double OrderItemTotal { get; set; }
    }

}
