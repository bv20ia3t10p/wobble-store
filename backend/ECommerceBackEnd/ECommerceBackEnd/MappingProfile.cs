using AutoMapper;
using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Entities;

namespace ECommerceBackEnd
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Category, CategoryDto>();
            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<Product, ProductDto>();
            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();
            CreateMap<CustomerDTO, Customer>();
            CreateMap<CustomerDTO, Customer>().ReverseMap();
            CreateMap<OrderDto, Order>();
            CreateMap<OrderDto, Order>().ReverseMap().
                ForMember(c => c.ShippingDate, opt => opt.MapFrom(x => x.ShippingDate.ToLocalTime())).
                ForMember(c => c.OrderDate, opt => opt.MapFrom(x => x.OrderDate.ToLocalTime()));
            CreateMap<CreateOrderDto, Order>();
            CreateMap<UpdateOrderStatusDto, Order>();
            CreateMap<Customer, Order>();
            CreateMap<Product, OrderDetail>();
            CreateMap<Order, OrderDetail>();
            CreateMap<Category, OrderDetail>();
            CreateMap<Category, Product>();
            CreateMap<OrderDetailDto, OrderDetail>();
            CreateMap<OrderDetailDto, OrderDetail>().ReverseMap();
            CreateMap<CreateOrderDetailDto, OrderDetail>();
            CreateMap<UpdateOrderDetailDto, OrderDetail>();
            CreateMap<UpdateCustomerDto, Customer>();
            CreateMap<Order, OrderWithDetailsDto>();
        }
    }
}
