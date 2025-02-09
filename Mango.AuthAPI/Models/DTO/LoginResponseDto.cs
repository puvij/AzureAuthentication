using Application.AuthAPI.Models.Dto;

namespace Application.AuthAPI.Model.Dto
{
    public class LoginResponseDto
    {
        public UserDto User { get; set; }
        public string Token {  get; set; }

    }
}
