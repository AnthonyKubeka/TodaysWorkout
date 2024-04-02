using Microsoft.AspNetCore.Mvc;
using TodaysWorkoutAPI.Common.Services;
using TodaysWorkoutAPI.Exercises.Domain;

namespace TodaysWorkoutAPI.Exercises
{
    [ApiController]
    [Route("[controller]")]

    public class ExercisesController : ControllerBase
    {
        private readonly CosmosDbService<Exercise> _exercisesCosmosDbService;

        public ExercisesController(CosmosDbService<Exercise> exercisesCosmosDbService)
        {
            _exercisesCosmosDbService = exercisesCosmosDbService;
        }

        [HttpPost]
        public async Task<IActionResult> AddExercise()
        {
            var exercise = new Exercise()
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
            };
            await _exercisesCosmosDbService.AddAsync(exercise);
            return Ok(exercise);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExercise(string id)
        {
            var exercise = await _exercisesCosmosDbService.GetAsync(id);
            return Ok(exercise);
        }

        [HttpGet("exercise-data")]
        public async Task<IActionResult> GetExerciseData()
        {
            var query = "SELECT * FROM c WHERE c.id = 'exercise-data'";
            var exercises = await _exercisesCosmosDbService.GetGenericData();
            return Ok(exercises); 
        }
    }
}