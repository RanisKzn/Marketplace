using AuthService.Models;
using Microsoft.AspNetCore.Identity;

namespace AuthService.DataSeeders
{
    public static class DataSeeder
    {
        public static async Task SeedDataAsync(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            // Seed Roles
            await SeedRolesAsync(roleManager);
            // Seed Users
            await SeedUsersAsync(userManager);
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            var roles = new[] { "Admin", "User" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        private static async Task SeedUsersAsync(UserManager<User> userManager)
        {
            var adminEmail = "admin@example.com";
            var adminUser = new User
            {
                UserName = "admin",
                Email = adminEmail,
                EmailConfirmed = true,
                
            };

            if (await userManager.FindByNameAsync(adminUser.UserName) == null)
            {
                await userManager.CreateAsync(adminUser, "Admin@123");
                await userManager.AddToRoleAsync(adminUser, "Admin");
                
            }

            var userEmail = "user@example.com";
            var appUser = new User
            {
                UserName = "user",
                Email = userEmail,
                EmailConfirmed = true,
            };

            if (await userManager.FindByNameAsync(appUser.UserName) == null)
            {
                await userManager.CreateAsync(appUser, "User@123");
                await userManager.AddToRoleAsync(appUser, "User");
            }
        }
    }
}
