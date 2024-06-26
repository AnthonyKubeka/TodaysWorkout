﻿using Common;
using Microsoft.AspNetCore.Mvc;
using Exercises.Domain; 
namespace Exercises.Controllers
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
                    BodyParts = new List<BodyPartEnum> {BodyPartEnum.Arms}, 
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
    }
}