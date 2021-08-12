namespace Entity.EF6
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("employee")]
    public partial class employee
    {
        public int id { get; set; }

        [Required]
        [StringLength(100)]
        public string userEmp { get; set; }

        [Required]
        [StringLength(50)]
        public string nameEmp { get; set; }

        public int? departmentid { get; set; }

        [Column(TypeName = "date")]
        public DateTime? birthday { get; set; }

        public bool sex { get; set; }

        [Column(TypeName = "text")]
        public string image { get; set; }

        [Required]
        [StringLength(50)]
        public string address { get; set; }

        [StringLength(50)]
        public string email { get; set; }

        [StringLength(50)]
        public string phone { get; set; }

        public bool isdelete { get; set; }

        [Required]
        [StringLength(50)]
        public string password { get; set; }

        public int roleId { get; set; }

        public int titleId { get; set; }

        [Column(TypeName = "date")]
        public DateTime dateStartWork { get; set; }

        public double salary { get; set; }

        public bool Status { get; set; }

        public double bh { get; set; }
    }
}
