namespace Entity.EF6
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("department")]
    public partial class department
    {
        public int id { get; set; }

        public int? parentid { get; set; }

        [StringLength(50)]
        public string nameDep { get; set; }
    }
}
