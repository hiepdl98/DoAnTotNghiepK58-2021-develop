using Entity.EF6;
using Newtonsoft.Json;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace DoAnTotNghiep.Areas.Registration.Controllers
{
    public class SalarytController : Controller
    {
        private readonly DbDoAnContext db = new DbDoAnContext();
        // GET: Registration/Salaryt
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult geDataTimeKeeping(int month, int year)
        {
            try
            {
                int id = Convert.ToInt32(Session["ID"]);
                int m = Convert.ToInt32(month);
                int y = Convert.ToInt32(year);
                var result = from time in db.timekeepings
                             where time.timekeepingDate.Year == year && time.timekeepingDate.Month == month
                             && time.empid == id
                             select new
                             {
                                 id = time.id,
                                 timekeepingDate = time.timekeepingDate,
                                 empid = time.empid,
                                 timeStartAM = time.timeStartAM,
                                 timeStartPM = time.timeStartPM,
                                 timeStartOT = time.timeStartOT,
                                 timeFinishAM = time.timeFinishAM,
                                 timeFinishPM = time.timeFinishPM,
                                 timeFinishOT = time.timeFinishOT,
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public bool updateSalary(string arr)
        {
            try
            {

                string nameUser = Session["nameEmp"].ToString();
                int idUser = Convert.ToInt32(Session["ID"]);
                List<string> result = arr.Split(',').ToList();
                result.RemoveAt(result.Count - 1);
                DateTime date = DateTime.Parse(result[2]);
                int month = date.Month;
                int year = date.Year;
                List<int> lstId = new List<int>();
                for (int i = 0; i < result.Count / 9; i++)
                {
                    lstId.Add(Convert.ToInt32(result[i * 9 + 1]));
                }
                var dlstId =  lstId.Distinct().ToList();
                foreach(var item in dlstId)
                {
                    var getDelete = db.timekeepings.Where(t => t.timekeepingDate.Month == month && t.timekeepingDate.Year == year && t.empid == item).ToList();
                    db.timekeepings.RemoveRange(getDelete);
                    db.SaveChanges();
                }
                var check = 0;
                for (int i = 0; i < result.Count / 9; i++)
                {
                    var empID = Convert.ToInt32(result[i * 9 + 1]);
                    if (empID != check)
                    {

                        notification noti = new notification();
                        noti.nameUser = nameUser;
                        noti.content = " đã cập nhật dữ liệu chấm công";
                        noti.iduser = idUser;
                        noti.isChecked = 0;
                        noti.url = "/Registration/Salaryt/ViewTimekeeping";

                        db.notifications.Add(noti);
                        db.SaveChanges();

                        notificationUser notificationUser = new notificationUser();
                        notificationUser.id = noti.id;
                        notificationUser.IdUser = empID.ToString();
                        db.notificationUsers.Add(notificationUser);
                        db.SaveChanges();
                    }
                    var timek = new timekeeping();
                    timek.empid = Convert.ToInt32(result[i * 9 + 1]);
                    timek.timekeepingDate = Convert.ToDateTime(result[i * 9 + 2]);
                    timek.timeStartAM = TimeSpan.Parse(result[i * 9 + 3]);
                    timek.timeFinishAM = TimeSpan.Parse(result[i * 9 + 4]);
                    timek.timeStartPM = TimeSpan.Parse(result[i * 9 + 5]);
                    timek.timeFinishPM = TimeSpan.Parse(result[i * 9 + 6]);
                    timek.timeStartOT = TimeSpan.Parse(result[i * 9 + 7]);
                    timek.timeFinishOT = TimeSpan.Parse(result[i * 9 + 8]);
                    db.timekeepings.Add(timek);
                    db.SaveChanges();
                }
                return true;
            }
            catch
            {
                return false;
            }
        }


        public JsonResult sumSalary()
        {
            int id = Convert.ToInt32(Session["ID"]);
            int month = DateTime.Now.Month - 1;
            int year = DateTime.Now.Year;
            try
            {
                var result = db.timekeepings.Where(t => t.empid == id && t.timekeepingDate.Month == month && t.timekeepingDate.Year==year).ToList();
                DateTime today = DateTime.Now;
                int numberDay = 0;
                if (today.Month == 2 && today.Year % 4 == 0)
                    numberDay = 29;
                else
                {
                    if (today.Month == 2)
                        numberDay = 28;
                    else
                    {
                        if (today.Month == 11 || today.Month == 9 || today.Month == 6 || today.Month == 4)
                            numberDay = 30;
                        else numberDay = 31;
                    }
                }

                DateTime startDay = DateTime.Parse(today.Year + "-" + today.Month + "-01");
                DateTime endDay = DateTime.Parse(today.Year + "-" + today.Month + "-" + numberDay);

                int numberDayWork = GetWorkingDays(startDay, endDay);
                int numberTimeWorkLT = numberDayWork * 8;
                var numberTimeWorkTT = 0.0;
                var numberTimeOT = 0.0;

                for (int i = 0; i < result.Count; i++)
                {
                    TimeSpan startAM = result[i].timeStartAM;
                    TimeSpan startPM = result[i].timeStartPM;
                    TimeSpan startOT = result[i].timeStartOT;
                    TimeSpan finishAM = result[i].timeFinishAM;
                    TimeSpan finishPM = result[i].timeFinishPM;
                    TimeSpan finishOT = result[i].timeFinishOT;
                    var day = result[i].timekeepingDate.DayOfWeek;
                    if (day.ToString().Equals("Saturday") || day.ToString().Equals("Sunday"))
                    {
                        numberTimeOT += (finishAM.TotalSeconds - startAM.TotalSeconds + finishPM.TotalSeconds - startPM.TotalSeconds + finishOT.TotalSeconds - startOT.TotalSeconds) / 3600;
                    }
                    else
                    {
                        numberTimeOT += (finishOT.TotalSeconds - startOT.TotalSeconds) / 3600;
                        numberTimeWorkTT += (finishAM.TotalSeconds - startAM.TotalSeconds + finishPM.TotalSeconds - startPM.TotalSeconds) / 3600;
                    }
                }
                var salaryEmp = db.employees.Where(e => e.id == id).Select(e => e.salary).FirstOrDefault();
                var bh = db.employees.Where(e => e.id == id).Select(e => e.bh).FirstOrDefault();
                var totalSalary = (salaryEmp/176 * numberTimeWorkTT + numberTimeOT*40000) - bh ;
                object recordSalary = new
                {
                    mon = today.Month,
                    numberDayWork = numberDayWork,
                    numberTimeWorkLT = numberTimeWorkLT,
                    numberTimeWorkTT = numberTimeWorkTT,
                    numberTimeOT = numberTimeOT,
                    bh = Convert.ToInt32(bh),
                    totalSalary = Convert.ToInt32( totalSalary),
                };
                List<object> model = new List<object>();
                model.Add(recordSalary);
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public bool checkHoliday(DateTime date)
        {
            var check = false;
            try
            {
                var holidays = new List<string>()
                    {
                        "2021-04-30", "2021-09-02", "2021-01-01", "2021-05-01"
                    };
                foreach (var item in holidays)
                {
                    DateTime holiday = DateTime.Parse(item);
                    if (date.CompareTo(holiday) == 0 || date.AddDays(-2).CompareTo(holiday) == 0)
                    {
                        check = true;
                        break;
                    }
                }
                return check;
            }
            catch (Exception ex)
            {
                return check;
            }
        }
        public int GetWorkingDays(DateTime from, DateTime to)
        {
            var dayDifference = (int)to.Subtract(from).TotalDays;
            return Enumerable
                .Range(1, dayDifference)
                .Select(x => from.AddDays(x))
                .Count(x => x.DayOfWeek != DayOfWeek.Saturday && x.DayOfWeek != DayOfWeek.Sunday && checkHoliday(x) != true);
        }

        public ActionResult ViewTimekeeping()
        {
            return View();
        }
        public ActionResult UpdateTimekeeping()
        {
            return View();
        }
        public void ToExcel()
        {
            var listSach = new List<timekeeping>();
            var list = db.timekeepings.ToList();
            foreach (var item in list)
            {
                var model = new timekeeping();
                model.id = item.id;
                model.empid = item.empid;
                model.timekeepingDate = item.timekeepingDate;
                model.timeStartAM = item.timeStartAM;
                model.timeFinishAM = item.timeFinishAM;
                model.timeStartPM = item.timeStartPM;
                model.timeFinishPM = item.timeFinishPM;
                model.timeStartOT = item.timeStartOT;
                model.timeFinishOT = item.timeFinishOT;
                listSach.Add(model);
            }


            ExcelPackage pck = new ExcelPackage();
            ExcelWorksheet ws = pck.Workbook.Worksheets.Add("Report");

            ws.Cells["A1"].Value = "Bảng :";
            ws.Cells["B1"].Value = "DỮ LIỆU CHẤM CÔNG";

            ws.Cells["A2"].Value = "Báo Cáo";
            ws.Cells["B2"].Value = "BÁO CÁO VỀ DỮ LIỆU CHẤM CÔNG";

            ws.Cells["A3"].Value = "Date";
            ws.Cells["B3"].Value = string.Format("{0:dd MMMM yyyy} at {0:H: mm tt}", DateTimeOffset.Now);

            ws.Cells["A6"].Value = "ID";
            ws.Cells["B6"].Value = "USER ID";
            ws.Cells["C6"].Value = "NGÀY CHẤM CÔNG";
            ws.Cells["D6"].Value = "GIỜ BẮT ĐẦU SÁNG";
            ws.Cells["E6"].Value = "GIỜ KẾT THÚC SÁNG";
            ws.Cells["F6"].Value = "GIỜ BẮT ĐẦU CHIỀU";
            ws.Cells["G6"].Value = "GIỜ KẾT THÚC CHIỀU";
            ws.Cells["H6"].Value = "GIỜ BẮT ĐẦU LÀM THÊM";
            ws.Cells["I6"].Value = "GIỜ KẾT THÚC LÀM THÊM";


            int rowStart = 7;
            foreach (var item in list)
            {

                ws.Cells[string.Format("A{0}", rowStart)].Value = item.id;
                ws.Cells[string.Format("B{0}", rowStart)].Value = item.empid;
                ws.Cells[string.Format("C{0}", rowStart)].Value = item.timekeepingDate.ToString();
                ws.Cells[string.Format("D{0}", rowStart)].Value = item.timeStartAM.ToString();
                ws.Cells[string.Format("E{0}", rowStart)].Value = item.timeFinishAM.ToString();
                ws.Cells[string.Format("F{0}", rowStart)].Value = item.timeStartPM.ToString();
                ws.Cells[string.Format("G{0}", rowStart)].Value = item.timeFinishPM.ToString();
                ws.Cells[string.Format("H{0}", rowStart)].Value = item.timeStartOT.ToString();
                ws.Cells[string.Format("I{0}", rowStart)].Value = item.timeFinishOT.ToString();

                rowStart++;
            }

            ws.Cells["A:AZ"].AutoFitColumns();
            Response.Clear();
            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            Response.AddHeader("content-disposition", "attachment: filename=" + "ExcelReport.xlsx");
            Response.BinaryWrite(pck.GetAsByteArray());
            Response.End();

        }
    }
}