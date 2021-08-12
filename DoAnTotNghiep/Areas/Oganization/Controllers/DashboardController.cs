using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DoAnTotNghiep.Areas.Oganization.Controllers
{
    public class DashboardController : Controller
    {
        // GET: Oganization/Daskboard
        public ActionResult Index()
        {
            return View();
        }
    }
}