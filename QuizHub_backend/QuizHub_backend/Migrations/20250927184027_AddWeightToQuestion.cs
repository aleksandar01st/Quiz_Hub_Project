using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizHub_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddWeightToQuestion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Weight",
                table: "Questions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Questions");
        }
    }
}
