namespace Entity.EF6
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("role")]
    public partial class role
    {
        public int id { get; set; }

        [Required]
        [StringLength(50)]
        public string name { get; set; }
    }
}
