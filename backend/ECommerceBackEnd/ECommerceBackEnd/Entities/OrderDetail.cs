using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceBackEnd.Entities
{
    public class OrderDetail
    {
        // Example JSON
        /* 
           "_id": {
            "$oid": "6554a28f23fd8696d934bf8a"
          },
          "CategoryId": 73,
          "CategoryName": "Sporting Goods",
          "DepartmentId": 2,
          "DepartmentName": "Fitness",
          "OrderId": 77202,
          "orderdate(DateOrders)": "1/31/2018 22:56",
          "OrderItemCardprodId": 1360,
          "OrderItemDiscount": 13.10999966,
          "OrderItemDiscountRate": 0.039999999,
          "OrderItemId": 180517,
          "OrderItemProductPrice": 327.75,
          "OrderItemProfitRatio": 0.289999992,
          "OrderItemQuantity": 1,
          "Sales": 327.75,
          "OrderItemTotal": 314.6400146,
          "ProductCardId": 1360,
          "ProductCategoryId": 73,
          "ProductName": "Smart watch ",
          "ProductPrice": 327.75
         */
        public ObjectId Id { get; set; }
        // From Products
        public int CategoryId { get; set; }
        public string CategoryName { get;set; }
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int ProductCardId { get; set; }
        public string? ProductName { get; set; }
        public double? ProductPrice { get; set; }
        // From Order
        public int OrderId { get; set; }
        [BsonSerializer(typeof(CustomDateTimeSerializer))]
        [BsonElement("orderdate(DateOrders)")]
        public DateTime OrderDate { get; set; }
        // Exclusives
        public double OrderItemDiscount { get; set; }
        public double OrderItemDiscountRate { get; set; }
        public int OrderItemId { get; set; }
        public double OrderItemProfitRatio { get; set; }
        public int OrderItemQuantity { get; set; }
        public double Sales { get; set; }
        public double OrderItemTotal { get; set; }
        public int CustomerId { get; set; }

    }
}
