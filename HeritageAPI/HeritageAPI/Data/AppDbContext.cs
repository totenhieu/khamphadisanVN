namespace HeritageAPI.Data
{
    using HeritageAPI.Models;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
       
        public DbSet<HeritageItem> HeritageItems { get; set; }
        public DbSet<Comment> Comments { get; set; }

    }
}
