﻿using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Entities;
using MongoDB.Bson;
using MongoDB.Driver;

namespace ECommerceBackEnd.Repositories
{
    public class OrderDetailRepository: RepositoryBase<OrderDetail>,IOrderDetailRepository
    {
        public OrderDetailRepository (IMongoDatabase database,string collectionName) : base(database,collectionName) { }
        public IEnumerable<OrderDetail> GetDetailsForOrder(int orderId) => GetManyByCondition(c=>c.OrderId.Equals(orderId));
        public IEnumerable<OrderDetail> GetOrderDetailsForProduct(int productId) => GetManyByCondition(c=>c.ProductCardId.Equals(productId));
        public void CreateOrderDetail(OrderDetail orderDetail) => Create(orderDetail);
        public void UpdateOrderDetail(OrderDetail orderDetail) => Update(c=>c.Id.Equals(orderDetail.Id),orderDetail);
        public void DeleteOrderDetail(OrderDetail orderDetail) => Delete(c=>c.Id.Equals(orderDetail.Id));
        public OrderDetail GetOrderDetailById(ObjectId id) => GetByCondition(c => c.Id.Equals(id));
        public OrderDetail GetDetailByProductAndOrder(int oid, int pid) => GetByCondition(c => c.ProductCardId == pid && c.OrderId == oid);
        public void CreateManyOrderDetails(IEnumerable<OrderDetail> orderDetails)=>CreateMany(orderDetails);
    }
}
