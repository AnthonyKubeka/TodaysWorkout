using Newtonsoft.Json;

namespace TodaysWorkoutAPI.Exercises.Domain
{
    public class ExerciseStaticDetail
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "bodyParts")]
        public List<BodyPartEnum> BodyParts { get; set; }
    }
}