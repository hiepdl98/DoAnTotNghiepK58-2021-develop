using Entity.EF6;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace DoAnTotNghiep.Areas.Oganization.Controllers
{
    public class OganizationController : Controller
    {
        private readonly DbDoAnContext db = new DbDoAnContext();
        // GET: Oganization/Oganization
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ViewDepartment()
        {
            return View();
        }
        public ActionResult ViewTitle()
        {
            return View();
        }
        public JsonResult getDepartment()
        {
            try
            {
                var result = from dept in db.departments
                             join dep_Tle in db.departmenttitles on dept.id equals dep_Tle.depId
                             join tle in db.titles on dep_Tle.titleId equals tle.idTitle
                             select new
                             {
                                 id = dept.id,
                                 parentid = dept.parentid,
                                 nameDep = dept.nameDep,
                                 idTitle = tle.idTitle,
                                 nameTitle = tle.nameTitle
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        [HttpGet]
        public int getNumberBoy()
        {
            int count = db.employees.Where(e => e.sex == false && e.isdelete == false).Count();
            return count;
        }
        [HttpGet]
        public int getNumberGirl()
        {
            int count = db.employees.Where(e => e.sex == true && e.isdelete == false).Count();
            return count;
        }

        
        public JsonResult getEmpByReady()
        {
            try
            {
                var model = db.employees.Where(e => e.isdelete == false).ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        //department controller
        public JsonResult getAllDepartment()
        {
            try
            {
                var model = db.departments.Where(e => e.parentid != 0).ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public JsonResult getEmpByDepartment(int depId, int parentid)
        {
            try
            {
                if (parentid == 0)
                {
                    var model = db.employees.Where(e => e.isdelete == false).ToList();
                    return Json(model, JsonRequestBehavior.AllowGet);
                }

                else
                {
                    var model = db.employees.Where(e => e.isdelete == false && e.departmentid == depId).ToList();
                    return Json(model, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

        }

        public JsonResult getDepartmentForUpdate(int id)
        {
            try
            {
                var result = from dept in db.departments
                             where dept.id == id
                             select new
                             {
                                 id = dept.id,
                                 nameDep = dept.nameDep
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public bool deleteDepartment(int id)
        {
            try
            {
                var delete = db.employees.Where(e => e.departmentid == id).ToList();
                if (delete.Count > 0)
                {
                    return false;
                }
                else
                {
                    var deleteDepartment = db.departments.Where(t => t.id == id).FirstOrDefault();
                    db.departments.Remove(deleteDepartment);
                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool updateDepartment(int idDepartment, string nameDepartment)
        {
            try
            {
                var update = db.departments.Where(d => d.id == idDepartment).FirstOrDefault();
                update.nameDep = nameDepartment;
                db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool addDepartment(string nameDepartment)
        {
            try
            {
                department dept = new department();
                dept.nameDep = nameDepartment;
                dept.parentid = 1;
                db.departments.Add(dept);
                db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        //Title Controller
        public JsonResult getTitle()
        {
            try
            {
                var result = from deptle in db.departmenttitles
                             join tle in db.titles on deptle.titleId equals tle.idTitle
                             select new
                             {
                                 idTitle = tle.idTitle,
                                 nameTitle = tle.nameTitle
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public JsonResult getAllTitle()
        {
            try
            {
                var result = from dept in db.departments
                             join deptle in db.departmenttitles on dept.id equals deptle.depId
                             join tle in db.titles on deptle.titleId equals tle.idTitle
                             orderby tle.idTitle ascending
                             select new
                             {
                                 idTitle = tle.idTitle,
                                 nameTitle = tle.nameTitle,
                                 nameDep = dept.nameDep
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public JsonResult getEmpByTitle(int titleId)
        {
            try
            {
                var model = db.employees.Where(e => e.isdelete == false && e.titleId == titleId).ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }

        }

        public JsonResult getTitleForUpdate(int id)
        {
            try
            {
                var result = from dept in db.departments
                             join deptle in db.departmenttitles on dept.id equals deptle.depId
                             join tle in db.titles on deptle.titleId equals tle.idTitle
                             where tle.idTitle == id
                             select new
                             {
                                 idTitle = tle.idTitle,
                                 nameTitle = tle.nameTitle,
                                 idDepartment = dept.id,
                                 nameDep = dept.nameDep
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        
        public bool updateTitle(int idTitle,string nameTitle, int IdDepartmentCurrent, int idDepartmentNew)
        {
            try
            {
                var delete = db.departmenttitles.Where(t => t.titleId == idTitle && t.depId == IdDepartmentCurrent).FirstOrDefault();
                db.departmenttitles.Remove(delete);
                departmenttitle deptTle = new departmenttitle();
                deptTle.titleId = idTitle;
                deptTle.depId = idDepartmentNew;
                db.departmenttitles.Add(deptTle);
                var updateTitle = db.titles.Where(t => t.idTitle == idTitle).FirstOrDefault();
                updateTitle.nameTitle = nameTitle;
                db.SaveChanges();
                return true;
            }
            catch(Exception ex)
            {
                return false;
            }
        }
        
        public bool addTitle(string nameTitle,  int idDepartmentNew)
        {
            try
            {
                title title = new title();
                title.nameTitle = nameTitle;
                db.titles.Add(title);
                db.SaveChanges();
                int idTitle = title.idTitle;
                departmenttitle deptTle = new departmenttitle();
                deptTle.titleId = idTitle;
                deptTle.depId = idDepartmentNew;
                db.departmenttitles.Add(deptTle);
                db.SaveChanges();
                return true;
            }
            catch(Exception ex)
            {
                return false;
            }
        }
        
        public bool deleteTitle(int id)
        {
            try
            {
                var delete = db.employees.Where(e => e.titleId == id).ToList();
                if(delete.Count > 0)
                {
                    return false;
                }
                else
                {
                    var deleteTitle = db.titles.Where(t => t.idTitle == id).FirstOrDefault();
                    db.titles.Remove(deleteTitle);
                    db.SaveChanges();
                    return true;
                }
            }
            catch(Exception ex)
            {
                return false;
            }
        }

        public JsonResult getTitleById(int id)
        {
            try
            {
                var result = from deptle in db.departmenttitles
                             join tle in db.titles on deptle.titleId equals tle.idTitle
                             where deptle.depId == id
                             select new
                             {
                                 idTitle = tle.idTitle,
                                 nameTitle = tle.nameTitle
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public JsonResult getNumberNotification()
        {
            try
            {
                var id = Convert.ToInt32(Session["ID"]).ToString();
                var result = from notification in db.notifications
                             join notificationUser in db.notificationUsers on notification.id equals notificationUser.id
                             where notificationUser.IdUser == id
                             select new
                             {
                                 id = notification.id,
                                 nameUser = notification.nameUser,
                                 content = notification.content,
                                 iduser = notification.iduser,
                                 isChecked = notification.isChecked,
                                 url = notification.url,
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public JsonResult getNotification()
        {
            try
            {
                var id = Session["ID"].ToString();
                var result = from notification in db.notifications
                             join notificationUser in db.notificationUsers on notification.id equals notificationUser.id
                             where notificationUser.IdUser == id orderby notification.id descending
                             select new
                             {
                                 id = notification.id,
                                 nameUser = notification.nameUser,
                                 content = notification.content,
                                 iduser = notification.iduser,
                                 isChecked = notification.isChecked,
                                 url = notification.url,
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public bool setChecked(int id)
        {
            try
            {
                var update = db.notifications.Where(n => n.id == id).FirstOrDefault();
                update.isChecked = 1;
                db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}