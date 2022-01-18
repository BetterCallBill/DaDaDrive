namespace API.Helpers
{
    public class LikesPaginationParams : PaginationParams
    {
        public int UserId { get; set; }
        public string Predicate { get; set; }
    }
}