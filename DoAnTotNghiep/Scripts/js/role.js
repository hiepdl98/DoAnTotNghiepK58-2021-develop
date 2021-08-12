var lstParentSort = new Array();
//lấy danh sách phòng ban
function getAllRole() {
    $.ajax({
        url: "/Oganization/Role/getAllRole",
        method: "Get",
        success: function (res) {
            data = "";
            for (var i = 0; i < res.length; i++) {
                data += " <tr><td>"
                    + res[i].id +
                    "</td><td>"
                    + res[i].name +
                    "</td><td>" +
                    "<a title='Delete1' data-target='#popupDelete' onclick='getIdRole()' class='btn btn-info btn-lg' data-toggle='modal'><i class='delete1 fas fa-trash'  style='color: red;'></i></a>" +
                    "</td><td>" +
                    "<a id='updateRole' class='btn btn-info btn-lg' onclick='functionEditRole(" + res[i].id + ")'><i class='fas fa-pencil-alt'></i></a>" +
                    "</td></tr>";
            }
            $("#listRole").html(data);
        }
    });
}
//get id
function getIdRole() {
    var table = document.getElementById('tableRole');
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].onclick = function name() {
            var valueID = this.cells[0].innerHTML;
            var valueName = this.cells[1].innerHTML;
            document.getElementById('RoleId').value = valueID.trim();
            $('#RoleDelete').html("bạn có muốn xóa " + valueName);

        };
    }

};

function unique(arr) {
    return Array.from(new Set(arr))
}

function getRole() {
    $.ajax({
        type: 'POST',
        url: '/Oganization/Role/getAllMenu',
        success: function (data) {
            var db = "";
            var lstFarent = new Array();
            for (var i = 0; i < data.length; i++) {
                lstFarent.push(data[i].id);
            }
            var setLst = Array.from(new Set(lstFarent));
            lstParentSort = [];
            lstParentSort = removeElement(setLst, 0).sort(function (a, b) {
                return a - b;
            });
            var lstData = new Array();
            db += "<ul ><li><h3 style='margin-left: 40px;'>Công ty Kdas</h3>\n" +
                "    <ul>";
            for (let i = 0; i < lstParentSort.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    if (data[j].id == lstParentSort[i]) {
                        db += "<li ><div class = 'row'><div class= 'col-sm-1' style='margin-left: 75px;'><input type = 'checkbox' id = 'checkAll" + data[j].id + "'></div><div class= 'col-sm-6'><p style='font-size: 16px'> " + data[j].nameParent + " </p></div></div></li>";
                        for (let cursor = 0; cursor < data.length; cursor++) {
                            if (data[cursor].id == data[j].id) {
                                lstData.push(data[cursor]);
                                db += "<li style='margin-left: 100px; font-size: 14px'><div class = 'row'><div class= 'col-sm-1'><input type = 'checkbox' class='checkbox check_id" + data[cursor].id + "' data-id='" + data[cursor].idChild + "'></div><div class= 'col-sm-6'><p > " + data[cursor].nameChild + " </p></div></div></li>";
                            }
                        }
                        break;
                    }
                }
            }
            db += "</ul></li></ul>";
            $('#dataRole').html(db);

            for (let i of lstParentSort) {
                $("#checkAll" + i).change(function () {
                    $(".check_id" + i).each(function () {
                        if ($("#checkAll" + i).is(':checked') == false) {
                            $(".check_id" + i).prop('checked', false);
                        } else {
                            $(".check_id" + i).prop('checked', true);
                        }
                    });
                });
                $(".check_id" + i).change(function () {
                    if ($(this).is(':checked') == false) {
                        $("#checkAll" + i).prop('checked', false);
                    }
                });
            }
        }
    });
};

//show popup add
$(document).on("click", "#addRole", function () {
    $(".for-update").each(function () {
        $(this).addClass("hide");
    });
    $(".for-add").each(function () {
        $(this).removeClass("hide");
    });
    $(".checkbox").prop('checked', false);
    $("#myModal-update").modal("show");
});

//show popup update
$(document).on("click", "#updateRole", function () {
    $(".checkbox").prop('checked', false);
    $(".for-add").each(function () {
        $(this).addClass("hide");
    });
    $(".for-update").each(function () {
        $(this).removeClass("hide");
    });
    $("#myModal-update").modal("show");
});

// delete Role
function functionDeleteRole(id) {
    var RoleId = document.getElementById("RoleId").value;
    $.ajax({
        url: "/Oganization/Role/deleteRole",
        type: "Get",
        data: {
            id: RoleId,
        },
        success: function (data) {
            if (data != "False") {
                getAllRole();
                window.setTimeout(function () {
                    localStorage.setItem("swal", swal({
                        title: "Success!",
                        text: "Message sent",
                        type: "success",
                        timer: 800,
                        showConfirmButton: false
                    }));
                }, 100);
            } else {
                swal("Xóa phân quyền không thành công", "Phân quyền đang được sử dụng", "error");
            }

        },
        error: function () {
            swal("Error", "Xóa phòng ban không thành công", "error");
        }
    });
}

// lấy thông tin -> update
function functionEditRole(RoleId) {
    $.ajax({
        url: "/Oganization/Role/getRoleForUpdate",
        type: "Get",
        data: {
            id: RoleId
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            $('#IdRole').val(res[0].id);
            $('#nameRole').val(res[0].name);

        },
        error: function () {
            swal("Error", "Lấy thông tin thất bại",
                "error");
        }
    });

    $.ajax({
        url: "/Oganization/Role/GetRoleForId",
        type: "Get",
        data: {
            idRole: RoleId,
        },
        success: function (data) {
            for (let item of lstParentSort) {
                $(".check_id" + item).each(function () {
                    for (let i in data) {
                        if ($(this).attr("data-id") == data[i].id) {
                            $(this).prop('checked', true);
                        }
                    }
                });
            }
        },
        error: function () {
            swal("Error", "Thêm mới thất bại!", "error");
        }

    });

};

//submit add
$(document).on("click", "#submit-add-btn", function () {
    let arrId = "";
    for (let item of lstParentSort) {
        $(".check_id" + item).each(function () {
            if ($(this).is(':checked') == true) {
                arrId += $(this).attr("data-id") + ",";
            }
        });
    }
    var nameRole = document.getElementById("nameRole").value;
    if (nameRole == "") {
        $('#checkNUll').text("Hãy nhập tên phân quyền");
    } else {

        $.ajax({
            url: "/Oganization/Role/addRole",
            type: "Get",
            data: {
                nameRole: nameRole,
                arrId: arrId
            },
            success: function (data) {
                localStorage.setItem("swal",
                    swal({
                        title: "Success!",
                        text: "Message sent",
                        type: "success",
                        timer: 800,
                        showConfirmButton: false
                    })
                );
                window.setTimeout(function () {
                    getAllRole();
                    $('#checkNUll').text("");
                }, 800);
            },
            error: function () {
                swal("Error", "Thêm mới thất bại!", "error");
            }

        });
    }
});
//submit update
$(document).on("click", "#submit-update-btn", function () {

    var idRole = document.getElementById("IdRole").value;
    var nameRole = document.getElementById("nameRole").value;


    let arrId = "";
    for (let item of lstParentSort) {
        $(".check_id" + item).each(function () {
            if ($(this).is(':checked') == true) {
                arrId += $(this).attr("data-id") + ",";
            }
        });
    }

    if (nameRole == "") {
        $('#checkNUll').text("Hãy nhập tên phân quyền");
    } else {
        $.ajax({
            url: "/Oganization/Role/updateRole",
            type: "Get",
            data: {
                idRole: idRole,
                nameRole: nameRole,
                arrId: arrId
            },
            success: function (data) {
                localStorage.setItem("swal",
                    swal({
                        title: "Success!",
                        text: "Message sent",
                        type: "success",
                        timer: 800,
                        showConfirmButton: false
                    })
                );
                window.setTimeout(function () {
                    getAllRole();
                    $('#checkNUll').text("");
                }, 800);
            },
            error: function () {
                swal("Error", "Sửa thông tin không thành công", "error");

            }

        });
    }
});

$(document).ready(function () {
    getAllRole();
    getRole();
});


