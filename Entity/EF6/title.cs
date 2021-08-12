namespace Entity.EF6
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("title")]
    public partial class title
    {
        [Key]
        public int idTitle { get; set; }

        [Required]
        [StringLength(100)]
        public string nameTitle { get; set; }
    }
}
