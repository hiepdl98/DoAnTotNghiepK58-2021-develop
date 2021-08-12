using Entity.EF6;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace DoAnTotNghiep.Areas.Registration.Controllers
{
    public class ConfirmRegistrationController : Controller
    {
        private readonly DbDoAnContext db = new DbDoAnContext();
        // GET: Registration/ConfirmRegistration
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult getAllRegistration(int month, int year)
        {
            try
            {
                var result = from regis in db.registrationdetails
                             join emp in db.employees on regis.userId equals emp.id
                             where regis.isdelete == false && regis.isdelete == false
                             && regis.registrationDate.Value.Month == month && regis.registrationDate.Value.Year == year
                             select new
                             {
                                 id = regis.id,
                                 nameEmp = emp.nameEmp,
                                 reason = regis.reason,
                                 reasonForCancel = regis.reasonForCancel,
                                 registrationDate = regis.registrationDate,
                                 statusid = regis.statusid,
                                 timeFinish = regis.timeFinish,
                                 timeStart = regis.timeStart
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public bool RefuseRegistration(int otId, string reasonForCancel)
        {
            try
            {
                var update = db.registrationdetails.Where(r => r.id == otId).FirstOrDefault();
                update.statusid = 2;
                update.reasonForCancel = reasonForCancel;
                db.SaveChanges();

                string nameUser = Session["nameEmp"].ToString();
                int idUser = Convert.ToInt32(Session["ID"]);

                notification noti = new notification();
                noti.nameUser = nameUser;
                noti.content = " đã hủy bỏ OverTime";
                noti.iduser = idUser;
                noti.isChecked = 0;
                noti.url = "/Registration/Registration";

                db.notifications.Add(noti);
                db.SaveChanges();

                var emp = db.registrationdetails.Where(r => r.id == otId).FirstOrDefault();

                notificationUser notificationUser = new notificationUser();
                notificationUser.id = noti.id;
                notificationUser.IdUser = emp.userId.ToString();
                db.notificationUsers.Add(notificationUser);
                db.SaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SubmitRegistration(string arrId)
        {
            string[] lst = arrId.Split(',');
            for(int i = 0;i<lst.Count()-1;i++)
            {
                int otId = Convert.ToInt32(lst[i]);
                var update = db.registrationdetails.Where(r => r.id == otId).FirstOrDefault();
                update.statusid = 1;
                db.SaveChanges();
                var regis = db.registrationdetails.Where(r => r.id == otId).FirstOrDefault();
                var registrationDate = regis.registrationDate;
                var timeStart = regis.timeStart;
                var timeFinish = regis.timeFinish;
                var id = regis.userId;

                var timekeeping = db.timekeepings.Where(t => t.timekeepingDate == registrationDate && t.empid == id).FirstOrDefault();
                if (timekeeping == null)
                {
                    timekeeping timek = new timekeeping();
                    timek.empid = id;
                    timek.timekeepingDate = DateTime.Parse(registrationDate.ToString());
                    timek.timeStartOT = TimeSpan.Parse(timeStart.ToString());
                    timek.timeFinishOT = TimeSpan.Parse(timeFinish.ToString());
                    timek.timeStartAM = TimeSpan.Parse("00:00:00");
                    timek.timeFinishAM = TimeSpan.Parse("00:00:00");
                    timek.timeStartPM = TimeSpan.Parse("00:00:00");
                    timek.timeFinishPM = TimeSpan.Parse("00:00:00");
                    db.timekeepings.Add(timek);
                    db.SaveChanges();
                }
                else
                {
                    timekeeping.timeStartOT = TimeSpan.Parse(timeStart.ToString());
                    timekeeping.timeFinishOT = TimeSpan.Parse(timeFinish.ToString());
                    db.SaveChanges();
                }

                string nameUser = Session["nameEmp"].ToString();
                int idUser = Convert.ToInt32(Session["ID"]);

                notification noti = new notification();
                noti.nameUser = nameUser;
                noti.content = " đã phê duyệt OverTime";
                noti.iduser = idUser;
                noti.isChecked = 0;
                noti.url = "/Registration/Registration";

                db.notifications.Add(noti);
                db.SaveChanges();

                var emp = db.registrationdetails.Where(r => r.id == otId).FirstOrDefault();

                notificationUser notificationUser = new notificationUser();
                notificationUser.id = noti.id;
                notificationUser.IdUser = emp.userId.ToString();
                db.notificationUsers.Add(notificationUser);
                db.SaveChanges();
            }
            return true;
        }

        public JsonResult SearchConfirm(int statusId, int month, int year)
        {
            try
            {
                var result = from regis in db.registrationdetails
                             join emp in db.employees on regis.userId equals emp.id
                             where regis.isdelete == false && regis.statusid == statusId 
                             && regis.registrationDate.Value.Month == month && regis.registrationDate.Value.Year == year
                             select new
                             {
                                 id = regis.id,
                                 nameEmp = emp.nameEmp,
                                 reason = regis.reason,
                                 reasonForCancel = regis.reasonForCancel,
                                 registrationDate = regis.registrationDate,
                                 statusid = regis.statusid,
                                 timeFinish = regis.timeFinish,
                                 timeStart = regis.timeStart
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public JsonResult PagingByMonthConfirm(int temp, int month, int year)
        {

            try
            {
                var result = from regis in db.registrationdetails
                             join emp in db.employees on regis.userId equals emp.id
                             where regis.isdelete == false && regis.isdelete == false
                             && regis.registrationDate.Value.Month == month && regis.registrationDate.Value.Year == year
                             select new
                             {
                                 id = regis.id,
                                 nameEmp = emp.nameEmp,
                                 reason = regis.reason,
                                 reasonForCancel = regis.reasonForCancel,
                                 registrationDate = regis.registrationDate,
                                 statusid = regis.statusid,
                                 timeFinish = regis.timeFinish,
                                 timeStart = regis.timeStart
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}