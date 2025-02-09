using Application.AuthAPI.Model.Dto;
using Application.AuthAPI.Models.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;    

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);
        var token = GenerateJwtToken(user, roles);
        return Ok(new { Token = token });
    }

    [HttpGet("validate")]
    public async Task<IActionResult> ValidateUser()
    {
        var authorizationHeader = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
        {
            return Unauthorized(new ResponseDto<string>
            {
                IsSuccess = false,
                Message = "Missing or invalid token"
            });
        }

        var token = authorizationHeader.Substring("Bearer ".Length);
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadToken(token) as JwtSecurityToken;

        if (jwtToken == null)
        {
            return Unauthorized(new ResponseDto<string>
            {
                IsSuccess = false,
                Message = "Invalid token"
            });
        }



        var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new ResponseDto<string>
            {
                IsSuccess = false,
                Message = "Invalid token claims"
            });
        }

        var user = await _userManager.FindByEmailAsync(userId.ToUpper());
        if (user == null)
        {
            return Unauthorized(new ResponseDto<string>
            {
                IsSuccess = false,
                Message = "User not found"
            });
        }

        var roles = await _userManager.GetRolesAsync(user);

        var userDto = new UserDto
        {
            ID = user.Id,
            Email = user.Email,
            UserName = user.UserName,
            Employeecode = user.EmployeeCode,
            EmployeeStatus = user.EmployeeStatus,
            Roles = roles.ToArray()
        };

        return Ok(new ResponseDto<UserDto>
        {
            Result = userDto,
            IsSuccess = true,
            Message = "User validated successfully"
        });
    }

    private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("Username", user.UserName)
        };
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds,
            claims: claims);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}