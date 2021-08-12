namespace Entity.EF6
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("notification")]
    public partial class notification
    {
        public int id { get; set; }

        [Required]
        [StringLength(100)]
        public string nameUser { get; set; }

        [Required]
        [StringLength(200)]
        public string content { get; set; }

        public int iduser { get; set; }

        public int? isChecked { get; set; }

        [StringLength(200)]
        public string url { get; set; }
    }
}
