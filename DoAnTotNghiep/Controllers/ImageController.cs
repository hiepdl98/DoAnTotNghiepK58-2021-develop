using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DoAnTotNghiep.Controllers
{
    public class ImageController : Controller
    {
        // GET: Image
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult editImage(HttpPostedFileBase prodFile)
        {
            return Json(true);
        }
    }
}