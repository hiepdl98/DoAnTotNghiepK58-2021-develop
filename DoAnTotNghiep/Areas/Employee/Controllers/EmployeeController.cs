using Entity.EF6;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace DoAnTotNghiep.Areas.Employee.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly DbDoAnContext db = new DbDoAnContext();
        // GET: Employee/Employee
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult InforEmployee()
        {
            return View();
        }
        public ActionResult ListEmployee()
        {
            return View();
        }
        public JsonResult getInformation()
        {
            try
            {
                int id = Convert.ToInt32(Session["ID"]);
                var result = from employee in db.employees
                             join dept in db.departments on employee.departmentid equals dept.id
                             join title in db.titles on employee.titleId equals title.idTitle
                             where employee.isdelete == false && employee.id == id
                             select new
                             {
                                 id = employee.id,
                                 userEmp = employee.userEmp,
                                 email = employee.email,
                                 image = employee.image,
                                 nameEmp = employee.nameEmp,
                                 birthday = employee.birthday,
                                 sex = employee.sex,
                                 salary = employee.salary,
                                 address = employee.address,
                                 phone = employee.phone,
                                 nameDep = dept.nameDep,
                                 nameTitle = title.nameTitle
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public JsonResult getAllEmployee()
        {
            try
            {
                var result = from employee in db.employees
                             join dept in db.departments on employee.departmentid equals dept.id
                             where employee.isdelete == false
                             select new
                             {
                                 id = employee.id,
                                 nameEmp = employee.nameEmp,
                                 nameDep = dept.nameDep,
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public JsonResult getAllRole()
        {
            try
            {
                var result = from role in db.roles
                             select new
                             {
                                 id = role.id,
                                 name = role.name

                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public bool changeInformation(string employeeName, string userEmp, string emailAddress, string dateOfBirth, int sex, string addressEmp, string phoneNumber)
        {
            try
            {
                int id = Convert.ToInt32(Session["ID"]);
                DateTime birthDay = DateTime.Parse(dateOfBirth);
                bool gioitinh = false;
                if (sex == 1)
                {
                    gioitinh = true;
                }
                var result = db.employees.Where(e => e.id == id).FirstOrDefault();
                if (result != null)
                {
                    result.nameEmp = employeeName;
                    result.userEmp = userEmp;
                    result.email = emailAddress;
                    result.birthday = birthDay;
                    result.sex = gioitinh;
                    result.address = addressEmp;
                    result.phone = phoneNumber;
                    db.SaveChanges();
                    return true;
                }
                else
                    return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public JsonResult getEmpForUpdate(int id)
        {
            try
            {
                var result = from employee in db.employees
                             join dept in db.departments on employee.departmentid equals dept.id
                             join title in db.titles on employee.titleId equals title.idTitle
                             join role in db.roles on employee.roleId equals role.id
                             where employee.isdelete == false && employee.id == id
                             select new
                             {
                                 id = employee.id,
                                 userEmp = employee.userEmp,
                                 email = employee.email,
                                 name = role.name,
                                 nameEmp = employee.nameEmp,
                                 birthday = employee.birthday,
                                 sex = employee.sex,
                                 salary = employee.salary,
                                 address = employee.address,
                                 phone = employee.phone,
                                 nameDep = dept.nameDep,
                                 nameTitle = title.nameTitle
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public bool deleteEmployee(int id)
        {
            var result = db.employees.Where(e => e.id == id).FirstOrDefault();
            result.isdelete = true;
            db.SaveChanges();
            var check = db.employees.Where(e => e.id == id && e.isdelete == true).ToList();
            if (check.Count > 0)
                return true;
            else return false;
        }
        [HttpGet]
        public bool addEmployee(string employeeName, string userEmp, int department, int title,
            string dateOfBirth, int sex, string emailAddress, string addressEmp, int optionRoles, string phoneNumber, double salary = 0) 
        {
            try
            {
                DateTime birthDay;
                if (dateOfBirth != "")
                {
                    birthDay = DateTime.Parse(dateOfBirth);
                }
                else
                {
                    birthDay = DateTime.Parse("1970-01-01");
                }
                var password = Convert.ToBase64String(Encoding.UTF8.GetBytes("123456789Aabc"));
                /*string inputStr = Encoding.UTF8.GetString(Convert.FromBase64String(encodedStr));*/
                bool gioitinh = false;
                if (sex == 1)
                {
                    gioitinh = true;
                }
                employee employee = new employee();
                employee.nameEmp = employeeName;
                employee.userEmp = userEmp;
                employee.departmentid = department;
                employee.titleId = title;
                employee.birthday = birthDay;
                employee.sex = gioitinh;
                employee.salary = salary;
                employee.email = emailAddress;
                employee.address = addressEmp;
                employee.roleId = optionRoles;
                employee.phone = phoneNumber;
                employee.password = password;
                db.employees.Add(employee);
                db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool updateEmployee(int id, string employeeName, string userEmp, int department, int title,
            string emailAddress, string dateOfBirth, int sex, string addressEmp, int optionRoles, string phoneNumber, double salary)
        {
            try
            {
                DateTime birthDay;
                if (dateOfBirth != "")
                {
                    birthDay = DateTime.Parse(dateOfBirth);
                }
                else
                {
                    birthDay = DateTime.Parse("1970-01-01");
                }
                /*string inputStr = Encoding.UTF8.GetString(Convert.FromBase64String(encodedStr));*/
                bool gioitinh = false;
                if (sex == 1)
                {
                    gioitinh = true;
                }
                var result = db.employees.Where(e => e.id == id).FirstOrDefault();
                if (result != null)
                {
                    result.nameEmp = employeeName;
                    result.userEmp = userEmp;
                    result.departmentid = department;
                    result.titleId = title;
                    result.birthday = birthDay;
                    result.sex = gioitinh;
                    result.salary = salary;
                    result.email = emailAddress;
                    result.address = addressEmp;
                    result.roleId = optionRoles;
                    result.phone = phoneNumber;
                    db.SaveChanges();
                    return true;
                }
                else
                    return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public void ToExcel()
        {
            var listSach = new List<employee>();
            var list = db.employees.ToList();
            foreach (var item in list)
            {
                var model = new employee();
                model.id = item.id;
                model.nameEmp = item.nameEmp;
                model.departmentid = item.departmentid;
                model.birthday = item.birthday;
                model.address = item.address;
                model.email = item.email;
                model.phone = item.phone;
                model.salary = item.salary;
                listSach.Add(model);
            }


            ExcelPackage pck = new ExcelPackage();
            ExcelWorksheet ws = pck.Workbook.Worksheets.Add("Report");

            ws.Cells["A1"].Value = "Bảng :";
            ws.Cells["B1"].Value = "DANH SÁCH NHÂN VIÊN";

            ws.Cells["A2"].Value = "Báo Cáo";
            ws.Cells["B2"].Value = "BÁO CÁO VỀ DANH SÁCH NHÂN VIÊN";

            ws.Cells["A3"].Value = "Date";
            ws.Cells["B3"].Value = string.Format("{0:dd MMMM yyyy} at {0:H: mm tt}", DateTimeOffset.Now);

            ws.Cells["A6"].Value = "ID";
            ws.Cells["B6"].Value = "TÊN NHÂN VIÊN";
            ws.Cells["C6"].Value = "MÃ PHÒNG BAN";
            ws.Cells["D6"].Value = "ĐỊA CHỈ";
            ws.Cells["E6"].Value = "EMAIL";
            ws.Cells["F6"].Value = "SỐ ĐIỆN THOẠI";
            ws.Cells["G6"].Value = "LƯƠNG ";


            int rowStart = 7;
            foreach (var item in list)
            {

                ws.Cells[string.Format("A{0}", rowStart)].Value = item.id;
                ws.Cells[string.Format("B{0}", rowStart)].Value = item.nameEmp;
                ws.Cells[string.Format("C{0}", rowStart)].Value = item.departmentid;
                ws.Cells[string.Format("D{0}", rowStart)].Value = item.address.ToString();
                ws.Cells[string.Format("E{0}", rowStart)].Value = item.email.ToString();
                ws.Cells[string.Format("F{0}", rowStart)].Value = item.phone.ToString();
                ws.Cells[string.Format("G{0}", rowStart)].Value = item.salary.ToString();

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