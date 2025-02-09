namespace Application.AuthAPI.Models.Dto
{
    public class UserDto
    {
        public string ID { get; set; }
        public string Employeecode { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }   
        public string EmployeeStatus { get; set; }
        public string[] Roles { get; set; }
    }
}
