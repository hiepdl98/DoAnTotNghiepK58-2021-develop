namespace Entity.EF6
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("post")]
    public partial class post
    {
        public int id { get; set; }

        [Required]
        [StringLength(200)]
        public string theme { get; set; }

        [Required]
        [StringLength(100)]
        public string content { get; set; }

        [Column(TypeName = "text")]
        public string urlFile { get; set; }

        public int empId { get; set; }

        public byte isdelete { get; set; }
    }
}
