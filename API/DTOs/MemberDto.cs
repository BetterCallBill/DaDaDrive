namespace API.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PhotoUrl { get; set; }
        
        // public byte[] PasswordHash { get; set; }
        // public byte[] PasswordSalt { get; set; }
        public int Age { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Gender { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Suburb { get; set; }
        public string Street { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
    }
}