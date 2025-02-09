using Microsoft.AspNetCore.Identity;

namespace Application.AuthAPI.Model.Dto
{
    public class ApplicationUser : IdentityUser
    {       
        public string EmployeeCode { get; set; }        
        public string EmployeeStatus { get; set; }
    }
}
