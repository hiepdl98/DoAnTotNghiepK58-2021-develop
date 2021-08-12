namespace Entity.EF6
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("registrationdetail")]
    public partial class registrationdetail
    {
        public int id { get; set; }

        [Column(TypeName = "date")]
        public DateTime? registrationDate { get; set; }

        public TimeSpan? timeStart { get; set; }

        public TimeSpan? timeFinish { get; set; }

        [Required]
        [StringLength(500)]
        public string reason { get; set; }

        [Required]
        [StringLength(500)]
        public string reasonForCancel { get; set; }

        public int statusid { get; set; }

        public bool? isdelete { get; set; }

        public int userId { get; set; }
    }
}
