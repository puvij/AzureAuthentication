using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mango.AuthAPI.Migrations
{
    /// <inheritdoc />
    public partial class mapRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            string userId = "a16ded2c-c34d-41fb-8eeb-c33dcb7e30cd"; // Replace with actual user ID from AspNetUsers
            string adminRoleId = "68868dac-52d2-4195-ae7f-2379867641dc"; // Replace with actual Admin Role ID from AspNetRoles

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "UserId", "RoleId" },
                values: new object[] { userId, adminRoleId }
                 );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
