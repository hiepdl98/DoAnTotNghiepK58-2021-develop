using Entity.EF6;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace DoAnTotNghiep.Controllers
{
    public class LoginController : Controller
    {
        private readonly DbDoAnContext db = new DbDoAnContext();
        // GET: Login
        public ActionResult Index()
        {


            HttpCookie aCookie = Request.Cookies["user"];
            if (aCookie != null)
            {
                var dict = HttpUtility.ParseQueryString(aCookie.Value.ToString());
                var json = new JavaScriptSerializer().Serialize(
                                    dict.AllKeys.ToDictionary(k => k, k => dict[k])
                           );
                dynamic data = JObject.Parse(json);
                string user = data.user.Value.ToString();
                string pass = data.pass.Value.ToString();
                string password = Convert.ToBase64String(Encoding.UTF8.GetBytes(pass));
                var getEmp = db.employees.Where(e => e.userEmp == user && e.password == password).FirstOrDefault();
                if (getEmp != null)
                {
                    HttpCookie cookie = new HttpCookie("user");

                    cookie["user"] = user;
                    cookie["pass"] = pass;
                    cookie.Expires = DateTime.Now.AddHours(1);
                    Response.Cookies.Add(cookie);
                    Session["ID"] = getEmp.id;
                    Session["nameEmp"] = getEmp.nameEmp;
                    Session["role"] = getEmp.roleId;
                    return Redirect("/Oganization/Dashboard");
                }
                else
                {
                    return View();
                }
            }
            else
                return View();
        }
        public ActionResult getFormChange()
        {
            return View();
        }

        [HttpPost]
        public bool CheckLogin(string user, string pw)
        {

            if (Request.Cookies["user"] != null)
            {
                Response.Cookies["user"].Expires = DateTime.Now.AddDays(-1);
            }
            var password = Convert.ToBase64String(Encoding.UTF8.GetBytes(pw));
            var getEmp = db.employees.Where(e => e.userEmp == user && e.password == password).FirstOrDefault();
            if (getEmp != null)
            {
                HttpCookie cookie = new HttpCookie("user");

                cookie["user"] = user;
                cookie["pass"] = pw;
                cookie.Expires = DateTime.Now.AddHours(1);
                Response.Cookies.Add(cookie);
                Session["ID"] = getEmp.id;
                Session["nameEmp"] = getEmp.nameEmp;
                var a = Session["ID"];
                var b = Session["nameEmp"];
                Session["role"] = getEmp.roleId;
                return true;
            }
            else
            {
                return false;
            }

        }
        public ActionResult Logout()
        {
            if (Request.Cookies["user"] != null)
            {
                Response.Cookies["user"].Expires = DateTime.Now.AddDays(-1);
            }
            //return View("~/Views/Login/Index.cshtml");
            return Redirect("/");
        }

        public bool ChangePassword(string currentpw, string psw)
        {
            try
            {
                int id = Convert.ToInt32(Session["ID"]);
                var password = Convert.ToBase64String(Encoding.UTF8.GetBytes(currentpw));
                var passwordNew = Convert.ToBase64String(Encoding.UTF8.GetBytes(psw));
                string inputStr = Encoding.UTF8.GetString(Convert.FromBase64String(passwordNew));
                var check = db.employees.Where(e => e.password == password && e.id == id).ToList();
                if (check.Count > 0)
                {
                    check[0].password = passwordNew;
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
    }
}