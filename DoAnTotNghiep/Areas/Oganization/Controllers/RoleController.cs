using Entity.EF6;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DoAnTotNghiep.Areas.Oganization.Controllers
{
    public class RoleController : Controller
    {
        private readonly DbDoAnContext db = new DbDoAnContext();
        // GET: Oganization/Role
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult getAllMenu()
        {
            try
            {
                var result = from m1 in db.menus
                             join m2 in db.menus on m1.id equals m2.parentid
                             select new
                             {
                                 id = m1.id,
                                 parentid = m2.parentid,
                                 nameParent = m1.name,
                                 idChild = m2.id,
                                 nameChild = m2.name
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
                             orderby role.id ascending
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


        public JsonResult getRoleForUpdate(int id)
        {
            try
            {
                var result = from role in db.roles
                             orderby role.id ascending
                             where role.id == id
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

        public bool updateRole(int idRole, string nameRole,string arrId)
        {
            try
            {
                var result = arrId.Split(',').ToList();
                result.RemoveAt(result.Count - 1);
                var deleteRole = db.menumappings.Where(r => r.roleid == idRole).ToList();
                if(deleteRole.Count > 0)
                {
                    db.menumappings.RemoveRange(deleteRole);
                }
                var lstAdd = new List<menumapping>();
                var lstParentId = new List<int>();
                foreach(var item in result)
                {
                    var menuid = Convert.ToInt32(item);
                    var parentId = db.menus.Where(e => e.id == menuid).Select(e => e.parentid).FirstOrDefault();
                    if(parentId > 0)
                    {
                        if (lstParentId.Count == 0)
                        {
                            lstParentId.Add(parentId);
                        }
                        else
                        {
                            if (lstParentId.Contains(parentId) == false)
                            {
                                lstParentId.Add(parentId);
                            }
                        }
                    }
                }
                foreach (var item in lstParentId)
                {
                    menumapping menu = new menumapping();
                    menu.roleid = idRole;
                    menu.menuid = item;
                    lstAdd.Add(menu);
                }
                foreach (var item in result)
                {
                    int id = Int32.Parse(item);
                    menumapping menu = new menumapping();
                    menu.roleid = idRole;
                    menu.menuid = id;
                    lstAdd.Add(menu);
                }
                db.menumappings.AddRange(lstAdd);
                var update = db.roles.Where(r => r.id == idRole).FirstOrDefault();
                update.name = nameRole;
                db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public JsonResult GetRoleForId(int idRole)
        {
            try
            {
                var result = from menu in db.menumappings
                             where menu.roleid == idRole
                             select new
                             {
                                 id = menu.menuid
                             };
                var model = result.ToList();
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public bool addRole(string nameRole,string arrId)
        {
            try
            {

                role role = new role();
                role.name = nameRole;
                db.roles.Add(role);
                db.SaveChanges();
                var result = arrId.Split(',').ToList();
                result.RemoveAt(result.Count - 1);
                var lstAdd = new List<menumapping>();
                var lstParentId = new List<int>();
                foreach (var item in result)
                {
                    var menuid = Convert.ToInt32(item);
                    var parentId = db.menus.Where(e => e.id == menuid).Select(e => e.parentid).FirstOrDefault();
                    if (parentId > 0)
                    {
                        if (lstParentId.Count == 0)
                        {
                            lstParentId.Add(parentId);
                        }
                        else
                        {
                            if (lstParentId.Contains(parentId) == false)
                            {
                                lstParentId.Add(parentId);
                            }
                        }
                    }
                }
                foreach (var item in lstParentId)
                {
                    menumapping menu = new menumapping();
                    menu.roleid = role.id;
                    menu.menuid = item;
                    lstAdd.Add(menu);
                }
                foreach (var item in result)
                {
                    int id = Int32.Parse(item);
                    menumapping menu = new menumapping();
                    menu.roleid = role.id;
                    menu.menuid = id;
                    lstAdd.Add(menu);
                }
                db.menumappings.AddRange(lstAdd);
                db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool deleteRole(int id)
        {
            try
            {
                var delete = db.employees.Where(e => e.roleId == id).ToList();
                if (delete.Count > 0)
                {
                    return false;
                }
                else
                {
                    var deleteMenuMapping = db.menumappings.Where(r => r.roleid == id).ToList();
                    if (deleteMenuMapping.Count > 0)
                    {
                        db.menumappings.RemoveRange(deleteMenuMapping);
                    }
                    var deleteRole = db.roles.Where(t => t.id == id).FirstOrDefault();
                    db.roles.Remove(deleteRole);
                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}