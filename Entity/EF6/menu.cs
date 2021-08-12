namespace Entity.EF6
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("menu")]
    public partial class menu
    {
        public int id { get; set; }

        public int parentid { get; set; }

        [Required]
        [StringLength(50)]
        public string name { get; set; }

        [Required]
        [StringLength(100)]
        public string url { get; set; }

        [Required]
        [StringLength(100)]
        public string menuScreen { get; set; }

        public byte deleteflag { get; set; }
    }
}
