using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mango.AuthAPI.Migrations
{
    /// <inheritdoc />
    public partial class INSERT_USER : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
        table: "AspNetUsers",
        columns: new[]
        {
            "Id", "EmployeeCode", "EmployeeStatus", "UserName", "NormalizedUserName",
            "Email", "NormalizedEmail", "EmailConfirmed",  "SecurityStamp",
            "ConcurrencyStamp", "PhoneNumber", "PhoneNumberConfirmed", "TwoFactorEnabled",
            "LockoutEnd", "LockoutEnabled", "AccessFailedCount"
        },
        values: new object[]
        {
            Guid.NewGuid().ToString(),  // Generates a unique ID
            "PUVI",
            "Active",
            "Puviyarasan.J",
            "PUVIYARASAN.J",
            "puviyarasan.j@outlook.com",
            "PUVIYARASAN.J@OUTLOOK.COM",
            true,            
            "RANDOMSECURITYSTAMP",
            "CONCURRENCYSTAMP",
            "1234567890",
            false,
            false,
            null,
            true,
            0
        }
    );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
