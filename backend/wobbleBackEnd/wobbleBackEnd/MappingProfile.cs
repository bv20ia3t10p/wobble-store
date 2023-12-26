using AutoMapper;
using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Entities;
using wobbleBackEnd.Dtos;
using wobbleBackEnd.Entities;

namespace ECommerceBackEnd
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Category, CategoryDto>();
            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<Department, DepartmentDto>();
            CreateMap<Department, DepartmentDto>().ReverseMap();
            CreateMap<CreateDepartmentDto, Department>();
            CreateMap<Product, ProductDto>();
            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();
            CreateMap<CustomerDTO, Customer>();
            CreateMap<CustomerDTO, Customer>().ReverseMap().ForMember(c => c.CustomerFullName, opt => opt.MapFrom(x => x.CustomerFname + " " + x.CustomerLname));
            CreateMap<OrderDto, Order>();
            CreateMap<OrderDto, Order>().ReverseMap().
                ForMember(c => c.ShippingDate, opt => opt.MapFrom(x => x.ShippingDate.ToLocalTime())).
                ForMember(c => c.CustomerFullName, opt => opt.MapFrom(x => x.CustomerFname + " " + x.CustomerLname)).
                ForMember(c => c.OrderDate, opt => opt.MapFrom(x => x.OrderDate.ToLocalTime()));
            CreateMap<CreateOrderDto, Order>().ForMember(c => c.Total, opt => opt.MapFrom(x => 0));
            CreateMap<UpdateOrderStatusDto, Order>();
            CreateMap<Customer, Order>();
            CreateMap<Product, OrderDetail>();
            CreateMap<Order, OrderDetail>();
            CreateMap<Category, OrderDetail>();
            CreateMap<Category, Product>();
            CreateMap<OrderDetailDto, OrderDetail>();
            CreateMap<OrderDetailDto, OrderDetail>().ReverseMap().ForMember(c => c.Id, opt => opt.MapFrom(x => x.Id.ToString()));
            CreateMap<CreateOrderDetailDto, OrderDetail>();
            CreateMap<UpdateOrderDetailDto, OrderDetail>();
            CreateMap<UpdateCustomerDto, Customer>();
            CreateMap<Order, OrderWithDetailsDto>();
            CreateMap<UpdateOrderPaymentDto, Order>();
            CreateMap<UpdateStaffDto, Staff>();
            CreateMap<CreateStaffDto, Staff>();
            CreateMap<OrderDto, OrderDetail>();
        }
    }
}
