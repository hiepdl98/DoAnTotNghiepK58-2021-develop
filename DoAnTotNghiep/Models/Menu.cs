using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DoAnTotNghiep.Models
{
    public class Menu
    {
        public int id { get; set; }
        public int parentid { get; set; }
        public string name { get; set; }
        public string url { get; set; }
        public string menuScreen { get; set; }
        public byte deleteflag { get; set; }
        public int menuid { get; set; }
        public int roleid { get; set; }
    }
}