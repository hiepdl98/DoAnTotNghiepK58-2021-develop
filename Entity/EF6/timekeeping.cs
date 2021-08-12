namespace Entity.EF6
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("timekeeping")]
    public partial class timekeeping
    {
        public int id { get; set; }

        public int empid { get; set; }

        [Column(TypeName = "date")]
        public DateTime timekeepingDate { get; set; }

        public TimeSpan timeStartAM { get; set; }

        public TimeSpan timeFinishAM { get; set; }

        public TimeSpan timeStartPM { get; set; }

        public TimeSpan timeFinishPM { get; set; }

        public TimeSpan timeStartOT { get; set; }

        public TimeSpan timeFinishOT { get; set; }
    }
}
