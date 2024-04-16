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

        [HttpPost("add-exercise-data")]
        public async Task<IActionResult> AddStaticExerciseData([FromQuery] string exerciseName)
        {
            var cleanedExerciseName = exerciseName.ToUpperInvariant(); 
            await _exercisesCosmosDbService.AddGenericDataAsync(cleanedExerciseName);
            return Ok($"Received exercise name: {exerciseName}");
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