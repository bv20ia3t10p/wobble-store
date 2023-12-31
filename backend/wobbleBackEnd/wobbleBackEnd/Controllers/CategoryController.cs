﻿using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Entities;
using ECommerceBackEnd.Repositories;
using ECommerceBackEnd.Service.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ECommerceBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly IServiceManager _service;
        public CategoryController(IServiceManager service) => _service = service;

        // GET: api/<CategoryController>
        [HttpGet]
        public ActionResult<IEnumerable<CategoryDto>> Get()
        {
            return Ok(_service.Category.GetCategories());
        }


        // GET api/<CategoryController>/5
        [HttpGet("{id}")]
        public ActionResult<CategoryDto> Get(int id)
        {
            return Ok(_service.Category.GetCategoryById(id));
        }

        // POST api/<CategoryController>
        [Authorize(Roles = ("ADMINISTRATOR"))]
        [HttpPost]
        public ActionResult<CategoryDto> Post([FromBody] CreateCategoryDto value)
        {

            var category = _service.Category.CreateCategory(value);
            return CreatedAtAction(nameof(Get), new { id = category.CategoryId }, value);
        }
        // PUT api/<CategoryController>/5
        [HttpPut]
        [Authorize(Roles = ("ADMINISTRATOR"))]
        public ActionResult Put(UpdateCategoryDto updateCat)
        {
            _service.Category.UpdateCategory(updateCat);
            return Ok(_service.Category.GetCategoryById(updateCat.CategoryId));
        }

        // DELETE api/<CategoryController>/5
        [HttpDelete("{id}")]
        [Authorize(Roles = ("ADMINISTRATOR"))]
        public ActionResult Delete(int id)
        {
            _service.Category.DeleteCategoryById(id);
            return NoContent();
        }
    }
}
