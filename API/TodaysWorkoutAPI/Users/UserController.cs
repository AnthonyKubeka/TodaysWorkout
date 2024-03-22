using TodaysWorkoutAPI.Common.Services;
using Microsoft.AspNetCore.Mvc;
using TodaysWorkoutAPI.Users.Domain; 
namespace TodaysWorkoutAPI.Users.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class UserController : ControllerBase
    {
        private readonly ICosmosDbService<User> _usersCosmosDbService; 

        public UserController(ICosmosDbService<User> usersCosmosDbService)
        {
            _usersCosmosDbService = usersCosmosDbService;
        }

        [HttpPost]
        public async Task<IActionResult> AddUser() 
        {
            var user = new User()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Jim"
            }; 
            await _usersCosmosDbService.AddAsync(user);
            return Ok(user);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _usersCosmosDbService.GetAsync(id); 
            return Ok(user);
        }
    }
}