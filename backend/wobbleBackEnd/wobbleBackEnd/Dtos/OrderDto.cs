using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceBackEnd.Dtos
{
    public record OrderDto
    {
        [Key]
        public int OrderId { get; set; }
        public string Type { get; set; }
        public int DayForShippingReal { get; set; }
        public int DayForShipmentScheduled { get; set; }
        public string DeliveryStatus { get; set; }
        public int LateDeliveryRisk { get; set; }
        public string CustomerCity { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerFname { get; set; }
        public int CustomerId { get; set; }
        public string CustomerLname { get; set; }
        public string CustomerSegment { get; set; }
        public string CustomerState { get; set; }
        public int CustomerZipcode { get; set; }
        public string OrderStatus { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime ShippingDate { get; set; }
        public string ShippingMode { get; set; }
        public double Total { get; set; }
    }
    public record CreateOrderDto
    {
        public string Type { get; set; }
        public int CustomerId { get; set; }
        public double Total { get; set; }
        public virtual IEnumerable<CreateOrderDetailDto> OrderDetails { get; set; }
    }
    public record UpdateOrderStatusDto
    {
        public int OrderId { get; set; }
        public string Type { get; set; }
        public int DayForShippingReal { get; set; }
        public int DayForShipmentScheduled { get; set; }
        public string DeliveryStatus { get; set; }
        public int LateDeliveryRisk { get; set; }
        public string OrderStatus { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime ShippingDate { get; set; }
        public string ShippingMode { get; set; }
        public double Total { get; set; }
    }
    public record OrderWithDetailsDto
    {
        [Key]
        public int OrderId { get; set; }
        public string Type { get; set; }
        public int DayForShippingReal { get; set; }
        public int DayForShipmentScheduled { get; set; }
        public string DeliveryStatus { get; set; }
        public int LateDeliveryRisk { get; set; }
        public string CustomerCity { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerFname { get; set; }
        public int CustomerId { get; set; }
        public string CustomerLname { get; set; }
        public string CustomerSegment { get; set; }
        public string CustomerState { get; set; }
        public int CustomerZipcode { get; set; }
        public string OrderStatus { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime ShippingDate { get; set; }
        public string ShippingMode { get; set; }
        public double Total { get; set; }
        public virtual IEnumerable<OrderDetailDto> Details { get; set; }
    }
    public record UpdateOrderPaymentDto
    {
        public int OrderId { get; set; }
        public string? Type { get; set; }
        public string? OrderStatus { get; set; }
    }
}
