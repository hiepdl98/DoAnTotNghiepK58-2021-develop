namespace Entity.EF6
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class DbDoAnContext : DbContext
    {
        public DbDoAnContext()
            : base("name=DbDoAnContext")
        {
        }

        public virtual DbSet<department> departments { get; set; }
        public virtual DbSet<departmenttitle> departmenttitles { get; set; }
        public virtual DbSet<employee> employees { get; set; }
        public virtual DbSet<menu> menus { get; set; }
        public virtual DbSet<menumapping> menumappings { get; set; }
        public virtual DbSet<notification> notifications { get; set; }
        public virtual DbSet<notificationUser> notificationUsers { get; set; }
        public virtual DbSet<post> posts { get; set; }
        public virtual DbSet<registrationdetail> registrationdetails { get; set; }
        public virtual DbSet<role> roles { get; set; }
        public virtual DbSet<status> status { get; set; }
        public virtual DbSet<timekeeping> timekeepings { get; set; }
        public virtual DbSet<title> titles { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<employee>()
                .Property(e => e.image)
                .IsUnicode(false);

            modelBuilder.Entity<post>()
                .Property(e => e.urlFile)
                .IsUnicode(false);
        }
    }
}
