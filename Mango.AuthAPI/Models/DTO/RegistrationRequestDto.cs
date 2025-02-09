using System.ComponentModel.DataAnnotations;

namespace Application.AuthAPI.Model.Dto
{
    public class RegistrationRequestDto
    {
        [Required]
        public string? ID { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public string Email { get; set; }
        public string EmployeeStatus { get; set; }       
        public string RoleName { get; set; }
    }
}
