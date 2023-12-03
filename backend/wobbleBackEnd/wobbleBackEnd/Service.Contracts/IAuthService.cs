using ECommerceBackEnd.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceBackEnd.Service.Contracts
{ 
    public interface IAuthService 
    {
        //Task<IdentityResult> Register(CustomerAuthDto user);
        Task<bool> ValidateUser(CustomerAuthDto user, string GoogleToken);
        Task<string> CreateToken();
    }
}
