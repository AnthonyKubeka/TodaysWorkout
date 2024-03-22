using TodaysWorkoutAPI.Common.Services;
using TodaysWorkoutAPI.Exercises.Domain;
using Microsoft.AspNetCore.Mvc;
using TodaysWorkoutAPI.Workouts.Domain; 
namespace TodaysWorkoutAPI.Workouts.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class WorkoutsController : ControllerBase
    {
        private readonly ICosmosDbService<Workout> _workoutsCosmosDbService; 

        public WorkoutsController(ICosmosDbService<Workout> workoutsCosmosDbService)
        {
            _workoutsCosmosDbService = workoutsCosmosDbService;
        }

        [HttpPost]
        public async Task<IActionResult> AddWorkout() 
        {
            var workout = new Workout()
            {
                Id = Guid.NewGuid().ToString(),
                Exercises = new List<Exercise>() 
                { 
                    new Exercise()
                    {
                        Id = Guid.NewGuid().ToString(),
                        Name = "Pull Ups",
                        ExerciseStaticDetail = new ExerciseStaticDetail()
                        {
                            Id = Guid.NewGuid().ToString(),
                            BodyParts = new List<BodyPartEnum> { BodyPartEnum.Arms },
                            Name = "Pull Ups"
                        },
                        Sets = 1,
                        Reps = 10
                    }
                }
            }; 

            await _workoutsCosmosDbService.AddAsync(workout);
            return Ok(workout);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWorkout(string id)
        {
            var workout = await _workoutsCosmosDbService.GetAsync(id); 
            return Ok(workout);
        }
    }
}