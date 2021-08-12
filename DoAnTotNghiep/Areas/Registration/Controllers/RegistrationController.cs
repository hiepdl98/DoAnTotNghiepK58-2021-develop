using DoAnTotNghiep.Areas.Registration.Data;
using Entity.EF6;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace DoAnTotNghiep.Areas.Registration.Controllers
{
    public class RegistrationController : Controller
    {
        private readonly DbDoAnContext db = new DbDoAnContext();
        // GET: Registration/Registration
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult getRegistration(string month, string year)
        {
            try
            {
                int id = Convert.ToInt32(Session["ID"]);
                int m = Convert.ToInt32(month);
                int y = Convert.ToInt32(year);
                var result = from regis in db.registrationdetails
                             where regis.userId == id && regis.isdelete == false
                             && regis.registrationDate.Value.Month == m && regis.registrationDate.Value.Year == y
                             select new
                             {
                                 id = regis.id,
                                 isdelete = regis.isdelete,
                                 reason = regis.reason,
                                 reasonForCancel = regis.reasonForCancel,
                                 registrationDate = regis.registrationDate,
                                 statusid = regis.statusid,
                                 timeFinish = regis.timeFinish,
                                 timeStart = regis.timeStart,
                                 userId = regis.userId
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public bool addRegistrationDetail(string NgayDangKy, string TGBatDau, string TGKetThuc, string LyDo)
        {
            try
            {
                //int maxOtId = db.registrationdetails.Max(r => r.id);
                DateTime DateStart = DateTime.Parse(NgayDangKy);
                TimeSpan TimeStart = TimeSpan.Parse(TGBatDau);
                TimeSpan TimeFinish = TimeSpan.Parse(TGKetThuc);
                string nameUser = Session["nameEmp"].ToString();
                int id = Convert.ToInt32(Session["ID"]);

                var regis = new registrationdetail();
                regis.registrationDate = DateStart;
                regis.timeStart = TimeStart;
                regis.timeFinish = TimeFinish;
                regis.reason = LyDo;
                regis.userId = id;
                regis.reasonForCancel = "abc";
                regis.statusid = 3;
                regis.isdelete = false;
                
                db.registrationdetails.Add(regis);
                db.SaveChanges();

                notification noti = new notification();
                noti.nameUser = nameUser;
                noti.content = " Đã đăng ký OverTime";
                noti.iduser = id;
                noti.isChecked = 0;
                noti.url = "/Registration/ConfirmRegistration";

                db.notifications.Add(noti);
                db.SaveChanges();

                var role = db.menumappings.Where(m => m.menuid == 2).ToList();
                var lstId = new List<int>();
                foreach(var item in role)
                {
                    int roleId = item.roleid;
                    var lstEmp = db.employees.Where(e => e.roleId == roleId).ToList();
                    foreach(var emp in lstEmp)
                    {
                        lstId.Add(emp.id);
                    }
                }
                foreach(var item in lstId)
                {
                    notificationUser notificationUser = new notificationUser();
                    notificationUser.id = noti.id;
                    notificationUser.IdUser = item.ToString();
                    db.notificationUsers.Add(notificationUser);
                    db.SaveChanges();
                }

                return true;
            }
            catch (Exception ex)
            {
                string a = ex.Message.ToString();
                Debug.Write(a);
                return false;
            }
        }

        public bool editRegistrationDetail(int OtId, string NgayDangKy, string TGBatDau, string TGKetThuc, string LyDo)
        {
            try
            {
                string nameUser = Session["nameEmp"].ToString();
                int id = Convert.ToInt32(Session["ID"]);
                DateTime DateStart = DateTime.Parse(NgayDangKy);
                TimeSpan TimeStart = TimeSpan.Parse(TGBatDau);
                TimeSpan TimeFinish = TimeSpan.Parse(TGKetThuc);
                var editRegis = db.registrationdetails.Where(r => r.id == OtId).FirstOrDefault();
                editRegis.registrationDate = DateStart;
                editRegis.timeStart = TimeStart;
                editRegis.timeFinish = TimeFinish;
                editRegis.reason = LyDo;
                db.SaveChanges();
                notification noti = new notification();
                noti.nameUser = nameUser;
                noti.content = " Đã chỉnh sửa lịch đăng ký Overtime";
                noti.iduser = id;
                noti.isChecked = 0;
                noti.url = "/Registration/ConfirmRegistration";
                db.notifications.Add(noti);
                db.SaveChanges();
                /*$holidays = array("2020-04-30", "2020-09-02", "2020-01-01", "2020-05-01", "2021-01-01");*/

                var role = db.menumappings.Where(m => m.menuid == 2).ToList();
                var lstId = new List<int>();
                foreach (var item in role)
                {
                    int roleId = item.roleid;
                    var lstEmp = db.employees.Where(e => e.roleId == roleId).ToList();
                    foreach (var emp in lstEmp)
                    {
                        lstId.Add(emp.id);
                    }
                }
                foreach (var item in lstId)
                {
                    notificationUser notificationUser = new notificationUser();
                    notificationUser.id = noti.id;
                    notificationUser.IdUser = item.ToString();
                    db.notificationUsers.Add(notificationUser);
                    db.SaveChanges();
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool deleteRegistration(int otId, string LyDoHuy)
        {
            try
            {
                string nameUser = Session["nameEmp"].ToString();
                int id = Convert.ToInt32(Session["ID"]);

                var deleteRegis = db.registrationdetails.Where(r => r.id == otId).FirstOrDefault();
                deleteRegis.isdelete = true;
                deleteRegis.reasonForCancel = LyDoHuy;
                db.SaveChanges();
                notification noti = new notification();
                noti.nameUser = nameUser;
                noti.content = " Đã hủy lịch đăng ký overtime";
                noti.iduser = id;
                noti.isChecked = 0;
                noti.url = "/Registration/ConfirmRegistration";
                db.notifications.Add(noti);
                db.SaveChanges();

                var role = db.menumappings.Where(m => m.menuid == 2).ToList();
                var lstId = new List<int>();
                foreach (var item in role)
                {
                    int roleId = item.roleid;
                    var lstEmp = db.employees.Where(e => e.roleId == roleId).ToList();
                    foreach (var emp in lstEmp)
                    {
                        lstId.Add(emp.id);
                    }
                }
                foreach (var item in lstId)
                {
                    notificationUser notificationUser = new notificationUser();
                    notificationUser.id = noti.id;
                    notificationUser.IdUser = item.ToString();
                    db.notificationUsers.Add(notificationUser);
                    db.SaveChanges();
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public JsonResult PagingByMonthOverTime(string temp, int month, int year)
        {

            try
            {
                int id = Convert.ToInt32(Session["ID"]);
                int m = Convert.ToInt32(month);
                int y = Convert.ToInt32(year);

                var result = from regis in db.registrationdetails
                             where regis.userId == id && regis.isdelete == false
                             && regis.registrationDate.Value.Month == m && regis.registrationDate.Value.Year == y
                             select new
                             {
                                 id = regis.id,
                                 isdelete = regis.isdelete,
                                 reason = regis.reason,
                                 reasonForCancel = regis.reasonForCancel,
                                 registrationDate = regis.registrationDate,
                                 statusid = regis.statusid,
                                 timeFinish = regis.timeFinish,
                                 timeStart = regis.timeStart,
                                 userId = regis.userId
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public JsonResult SearchOverTime(int statusId, int month, int year)
        {
            try
            {
                int id = Convert.ToInt32(Session["ID"]);
                int m = Convert.ToInt32(month);
                int y = Convert.ToInt32(year);
                if (statusId == 0)
                {
                    var result = from regis in db.registrationdetails
                                 where regis.userId == id && regis.isdelete == false
                                 && regis.registrationDate.Value.Month == m && regis.registrationDate.Value.Year == y
                                 select new
                                 {
                                     id = regis.id,
                                     isdelete = regis.isdelete,
                                     reason = regis.reason,
                                     reasonForCancel = regis.reasonForCancel,
                                     registrationDate = regis.registrationDate,
                                     statusid = regis.statusid,
                                     timeFinish = regis.timeFinish,
                                     timeStart = regis.timeStart,
                                     userId = regis.userId
                                 };

                    var model = result.ToList();
                    return Json(model, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var result = from regis in db.registrationdetails
                                 where regis.userId == id && regis.isdelete == false
                                 && regis.registrationDate.Value.Month == m && regis.registrationDate.Value.Year == y && regis.statusid == statusId
                                 select new
                                 {
                                     id = regis.id,
                                     isdelete = regis.isdelete,
                                     reason = regis.reason,
                                     reasonForCancel = regis.reasonForCancel,
                                     registrationDate = regis.registrationDate,
                                     statusid = regis.statusid,
                                     timeFinish = regis.timeFinish,
                                     timeStart = regis.timeStart,
                                     userId = regis.userId
                                 };

                    var model = result.ToList();
                    return Json(model, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}

