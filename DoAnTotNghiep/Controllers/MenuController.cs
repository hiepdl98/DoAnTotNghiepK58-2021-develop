using DoAnTotNghiep.Models;
using Entity.EF6;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace DoAnTotNghiep.Controllers
{
    public class MenuController : Controller
    {
        DbDoAnContext db = new DbDoAnContext();
        // GET: Menu
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetListMenu()
        {
            int roleId = Convert.ToInt32(Session["role"]);
            try
            {
                var result = from menu in db.menus
                             join menumap in db.menumappings on menu.id equals menumap.menuid
                             where menumap.roleid == roleId
                             select new Menu
                             {
                                 id = menu.id,
                                 parentid = menu.parentid,
                                 name = menu.name,
                                 url = menu.url,
                                 menuScreen = menu.menuScreen,
                                 deleteflag = menu.deleteflag,
                                 menuid = menumap.menuid,
                                 roleid = menumap.roleid
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return null;
            }
        }
    }
}