using Microsoft.AspNetCore.Mvc;


namespace Users.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class UserController : ControllerBase
    {
        [HttpGet(Name = "GetUserByName/{name}")]
        public ActionResult GetUserByName(string name) 
        {
            return Ok(name); 
        }
    }
}