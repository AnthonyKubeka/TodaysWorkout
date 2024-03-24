using Microsoft.AspNetCore.Mvc;
using TodaysWorkoutAPI.Common.Services;
using TodaysWorkoutAPI.Exercises.Domain;

namespace TodaysWorkoutAPI.Exercises
{
    [ApiController]
    [Route("[controller]")]

    public class ExercisesController : ControllerBase
    {
        private readonly ICosmosDbService<Exercise> _exercisesCosmosDbService;

        public ExercisesController(ICosmosDbService<Exercise> exercisesCosmosDbService)
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
            var exerciseList = new List<ExerciseStaticDetail>();
            exerciseList.Add(new ExerciseStaticDetail()
            {
                BodyParts = new List<BodyPartEnum> { BodyPartEnum.Legs },
                Id = Guid.NewGuid().ToString(),
                Name = "Squats"
            });

            return Ok(exerciseList); 
        }
    }
}