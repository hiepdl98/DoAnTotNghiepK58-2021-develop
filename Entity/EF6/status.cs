namespace Entity.EF6
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class status
    {
        public int id { get; set; }

        [Required]
        [StringLength(50)]
        public string statusname { get; set; }
    }
}
