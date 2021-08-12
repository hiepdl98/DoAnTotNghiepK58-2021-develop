function removeElement(array, elem) {
    var index = array.indexOf(elem);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}

function checkId(arr, id) {
    var check = 0;
    for (var i = 0; i < arr.length; i++) {
        if (id == arr[i]) {
            check = 1;
            break;
        } else {
            check = 0;
        }
    }
    return check;
}
//danh sách nhân viên theo mã phòng ban
function getEmpByDepartment(depId, parentid) {
    $.ajax({
        type: 'GET',
        url: '/Oganization/Oganization/getEmpByDepartment',
        data: {
            depId: depId,
            parentid: parentid
        },
        success: function (data) {
            var db = "";
            for (var i = 0; i < data.length; i++) {
                db += "<tr ><td >"
                    + data[i].id
                    + "</td><td class='data-edit regis-date' contenteditable='true'>"
                    + data[i].nameEmp
                    + "</td><td>"
                    + data[i].email
                    + "</td></tr><hr>";
            }
            $('#getEmpByDepartment').html(db);
        }
    });
}
// danh sách nhân viên theo mã chức danh
function getEmpByTitle(titleId) {
    $.ajax({
        type: 'GET',
        url: '/Oganization/Oganization/getEmpByTitle',
        data: {
            titleId: titleId
        },
        success: function (data) {
            var db = "";
            for (var i = 0; i < data.length; i++) {
                db += "<tr ><td >"
                    + data[i].id
                    + "</td><td class='data-edit regis-date' contenteditable='true'>"
                    + data[i].nameEmp
                    + "</td><td>"
                    + data[i].email
                    + "</td></tr><hr>";
            }
            $('#getEmpByDepartment').html(db);
        }
    });
}
//lấy danh sách phòng ban
function getAllDepartment() {
    $.ajax({
        url: "/Oganization/Oganization/getAllDepartment",
        method: "Get",
        success: function (res) {
            data = "";
            for (var i = 0; i < res.length; i++) {
                data += " <tr><td>"
                    + res[i].id +
                    "</td><td>"
                    + res[i].nameDep +
                    "</td><td>" +
                    "<a title='Delete1' data-target='#popupDelete' onclick='getIdDepartment()' class='btn btn-info btn-lg' data-toggle='modal'><i class='delete1 fas fa-trash'  style='color: red;'></i></a>" +
                    "</td><td>" +
                    "<a id='updateDepartment' class='btn btn-info btn-lg' onclick='functionEditDepartment(" + res[i].id + ")'><i class='fas fa-pencil-alt'></i></a>" +
                    "</td></tr>";
            }
            $("#listDepartment").html(data);
        }
    });
}
//get id
function getIdDepartment() {
    var table = document.getElementById('tableDepartment');
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].onclick = function name() {
            var valueID = this.cells[0].innerHTML;
            var valueName = this.cells[1].innerHTML;
            document.getElementById('DepartmentId').value = valueID.trim();
            $('#DepartmentDelete').html("bạn có muốn xóa " + valueName);

        };
    }

};
//show popup add
$(document).on("click", "#addDepartment", function () {
    $(".for-update").each(function () {
        $(this).addClass("hide");
    });
    $(".for-add").each(function () {
        $(this).removeClass("hide");
    });
    $("#myModal-update").modal("show");
});

//show popup update
$(document).on("click", "#updateDepartment", function () {
    $(".for-add").each(function () {
        $(this).addClass("hide");
    });
    $(".for-update").each(function () {
        $(this).removeClass("hide");
    });
    $("#myModal-update").modal("show");
});

// delete department
function functionDeleteDepartment(id) {
    var DepartmentId = document.getElementById("DepartmentId").value;
    $.ajax({
        url: "/Oganization/Oganization/deleteDepartment",
        type: "Get",
        data: {
            id: DepartmentId,
        },
        success: function (data) {
            if (data != "False") {
                getAllDepartment();
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
                swal("Xóa phòng ban không thành công", "Phòng ban đang được sử dụng", "error");
            }

        },
        error: function () {
            swal("Error", "Xóa phòng ban không thành công", "error");
        }
    });
}

// lấy thông tin -> update
function functionEditDepartment(DepartmentId) {
    $.ajax({
        url: "/Oganization/Oganization/getDepartmentForUpdate",
        type: "Get",
        data: {
            id: DepartmentId
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            $('#IdDepartment').val(res[0].id);
            $('#nameDepartment').val(res[0].nameDep);

        },
        error: function () {
            swal("Error", "Lấy thông tin thất bại",
                "error");
        }
    });
};

//submit add
$(document).on("click", "#submit-add-btn", function () {
    var nameDepartment = document.getElementById("nameDepartment").value;
    if (nameDepartment == null) {
        $('#checkNUll').text("Hãy nhập tên phòng ban");
    } else {

        $.ajax({
            url: "/Oganization/Oganization/addDepartment",
            type: "Get",
            data: {
                nameDepartment: nameDepartment
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
                    getAllDepartment();
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
    var idDepartment = document.getElementById("IdDepartment").value;
    var nameDepartment = document.getElementById("nameDepartment").value;


    if (nameDepartment == "") {
        $('#checkNUll').text("Hãy nhập tên phòng ban");
    } else {
        $.ajax({
            url: "/Oganization/Oganization/updateDepartment",
            type: "Get",
            data: {
                idDepartment: idDepartment,
                nameDepartment: nameDepartment,
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
                    getAllDepartment();
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
    getAllDepartment();
    $.ajax({
        type: 'GET',
        url: '/Oganization/Oganization/getEmpByReady',
        success: function (data) {
            var db = "";
            for (var i = 0; i < data.length; i++) {
                db += "<tr ><td >"
                    + data[i].id
                    + "</td><td class='data-edit regis-date' contenteditable='true'>"
                    + data[i].nameEmp
                    + "</td><td>"
                    + data[i].email
                    + "</td></tr><hr>";
            }
            $('#getEmpByDepartment').html(db);
        }
    });

    $.ajax({
        type: 'GET',
        url: '/Oganization/Oganization/getDepartment',
        success: function (data) {
            var db = "";
            var lstFarent = new Array();
            for (var i = 0; i < data.length; i++) {
                lstFarent.push(data[i].id);
            }
            var setLst = Array.from(new Set(lstFarent));
            var lstParentSort = removeElement(setLst, 0).sort(function (a, b) {
                return a - b;
            });
            db += "<ul ><li><a onclick='getEmpByDepartment(1,0)'  class='caret1'>Công ty Kdas</a>\n" +
                "    <ul>";
            for (var i = 0; i < lstParentSort.length; i++) {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].id == lstParentSort[i]) {
                        db += "<li class='myLi'><a onclick='getEmpByDepartment(" + data[j].id + "," + data[j].parentid + ")'> " + data[j].nameDep + " </a></li>";
                        for (var cursor = 0; cursor < data.length; cursor++) {
                            if (data[cursor].id == data[j].id) {
                                db += "<li style='margin-left: 60px; font-size: 16px'><a onclick='getEmpByTitle(" + data[cursor].idTitle + ")'> " + data[cursor].nameTitle + " </a></li>";
                            }
                        }
                        break;
                    }
                }
            }
            db += "</ul></li></ul>";
            $('#dataOganization').html(db);
        }
    });
});


