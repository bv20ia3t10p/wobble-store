﻿using AutoMapper;
using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Entities;
using ECommerceBackEnd.Service.Contracts;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace ECommerceBackEnd.Service
{
    public class OrderDetailService : IOrderDetailService
    {
        private readonly IMapper _mapper;
        private readonly IRepositoryManager _repository;
        public OrderDetailService(IMapper mapper, IRepositoryManager repository)
        {
            _mapper = mapper;
            _repository = repository;
        }
        public OrderDetailDto GetById(ObjectId id) => _mapper.Map<OrderDetailDto>(_repository.OrderDetail.GetOrderDetailById(id));
        public IEnumerable<OrderDetailDto> GetByOrder(int orderId) => _mapper.Map<IEnumerable<OrderDetailDto>>(_repository.OrderDetail.GetDetailsForOrder(orderId));
        public IEnumerable<OrderDetailDto> GetByProduct(int productId) => _mapper.Map<IEnumerable<OrderDetailDto>>(_repository.OrderDetail.GetOrderDetailsForProduct(productId));
        public OrderDetailDto GetByOrderAndProduct(int oid, int pid) => _mapper.Map<OrderDetailDto>(_repository.OrderDetail.GetDetailByProductAndOrder(oid, pid));
        public OrderDetailDto CreateOrderDetail(CreateOrderDetailDto orderDetailDto)
        {

            var odEntity = _mapper.Map<OrderDetail>(orderDetailDto);
            var productInDb = _repository.Product.GetProduct(orderDetailDto.ProductCardId) ?? throw new Exception("Product not found");
            var orderInDb = _repository.Order.GetOrderById(orderDetailDto.OrderId) ?? throw new Exception("Order not found");
            _mapper.Map(productInDb, odEntity);
            _mapper.Map(orderInDb, odEntity);
            odEntity.Id = new MongoDB.Bson.ObjectId();
            odEntity.OrderItemDiscount = 0;
            odEntity.OrderItemDiscountRate = 0;
            odEntity.OrderItemProfitRatio = 0.2;
            odEntity.OrderItemTotal = (double)(productInDb.ProductPrice * odEntity.OrderItemQuantity);
            odEntity.Sales = odEntity.OrderItemTotal;
            //Update product sales
            productInDb.ProductSoldQuantity += odEntity.OrderItemQuantity;
            _repository.Product.UpdateProduct(productInDb);
            _repository.OrderDetail.CreateOrderDetail(odEntity);
            orderInDb.Total += odEntity.OrderItemTotal;
            _repository.Order.UpdateOrder(orderInDb);
            return _mapper.Map<OrderDetailDto>(odEntity);
        }
        public void CreateOrderDetailWithOrder(CreateOrderDetailDto orderDetailDto, OrderDto order)
        {
            var odEntity = _mapper.Map<OrderDetail>(orderDetailDto);
            var productInDb = _repository.Product.GetProduct(orderDetailDto.ProductCardId) ?? throw new Exception("Product not found");
            _mapper.Map(productInDb, odEntity);
            _mapper.Map(order, odEntity);
            odEntity.Id = new ObjectId();
            odEntity.OrderItemDiscount = 0;
            odEntity.OrderItemDiscountRate = 0;
            odEntity.OrderItemProfitRatio = 0.2;
            odEntity.OrderItemTotal = (double)(productInDb.ProductPrice * odEntity.OrderItemQuantity);
            odEntity.Sales = odEntity.OrderItemTotal;
            //Update product sales
            productInDb.ProductSoldQuantity += odEntity.OrderItemQuantity;
            _repository.Product.UpdateProduct(productInDb);
            var orderInDb = _repository.Order.GetOrderById(order.OrderId);
            orderInDb.Total += odEntity.OrderItemTotal;
            _repository.Order.UpdateOrder(orderInDb);
            _repository.OrderDetail.CreateOrderDetail(odEntity);
        }
        public IEnumerable<OrderDetailDto> CreateMultipleOrderDetails(IEnumerable<CreateOrderDetailDto> orderDetails)
        {
            var CreatedOrderList = new List<OrderDetailDto>();
            foreach (var cod in orderDetails)
            {
                CreatedOrderList.Add(CreateOrderDetail(cod));
            }
            return CreatedOrderList;
        }
        public OrderDetailDto UpdateOrderDetail(UpdateOrderDetailDto orderDetail)
        {
            var odEntity = _repository.OrderDetail.GetOrderDetailById(orderDetail.Id) ?? throw new Exception("Order detail not found");
            var oldProduct = _repository.Product.GetProduct(odEntity.ProductCardId);
            var oldProductPrice = oldProduct.ProductPrice;
            int oldQuant = odEntity.OrderItemQuantity;
            oldProduct.ProductSoldQuantity -= odEntity.OrderItemQuantity;
            var odEntityId = odEntity.Id;
            _mapper.Map(orderDetail, odEntity);
            var productInDb = _repository.Product.GetProduct(orderDetail.ProductCardId) ?? throw new Exception("Product not found");
            _repository.Product.UpdateProduct(oldProduct);
            _mapper.Map(productInDb, odEntity);
            odEntity.OrderItemTotal = (double)(productInDb.ProductPrice * odEntity.OrderItemQuantity);
            odEntity.Sales = odEntity.OrderItemTotal;
            odEntity.Id = odEntityId;
            // Update Product Sales
            productInDb.ProductSoldQuantity += orderDetail.OrderItemQuantity;
            _repository.Product.UpdateProduct(productInDb);
            _repository.OrderDetail.UpdateOrderDetail(odEntity);
            var orderInDb = _repository.Order.GetOrderById(odEntity.OrderId);
            orderInDb.Total += (productInDb.ProductPrice * odEntity.OrderItemQuantity - oldProductPrice* oldQuant);
            _repository.Order.UpdateOrder(orderInDb);
            return _mapper.Map<OrderDetailDto>(odEntity);
        }
        public void DeleteOrderDetail(string id)
        {
            var odEntity = _repository.OrderDetail.GetOrderDetailById(new ObjectId(id)) ?? throw new Exception("Order detail not found");
            var productInDb = _repository.Product.GetProduct(odEntity.ProductCardId) ?? throw new Exception("Product not found");
            productInDb.ProductSoldQuantity -= odEntity.OrderItemQuantity;
            _repository.Product.UpdateProduct(productInDb);
            _repository.OrderDetail.DeleteOrderDetail(odEntity);
            var orderInDb = _repository.Order.GetOrderById(odEntity.OrderId);
            orderInDb.Total -= odEntity.OrderItemTotal;
            _repository.Order.UpdateOrder(orderInDb);
        }
    }
}
