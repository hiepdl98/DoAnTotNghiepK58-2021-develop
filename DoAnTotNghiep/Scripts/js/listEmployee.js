var arrayInfor = new Array();
var numberPagging = 0;
var page;
var maxPage;
var arrayEmp = new Array();
var numberEmp;

function convertDate(data) {
    var getdate = parseInt(data.replace("/Date(", "").replace(")/", ""));
    var ConvDate = new Date(getdate);
    var month = parseInt(ConvDate.getMonth()) + 1;
    if (month < 10) {
        month = "0" + month;
    }
    return ConvDate.getFullYear() + "/" + month + "/" + ConvDate.getDate();
}

function pagging(index) {
    var offset = (index - 1) * 5;
    page = index;
    $("#listEmployee").html("");
    $(".active").removeClass("active");
    $(".page-number").each(function () {
        if ($(this).html() == index) {
            $(this).parent().addClass("active");
        }
    });
    $
        .ajax({
            url: "/Employee/Employee/PaggingNumber",
            type: "POST",
            data: {
                numberpagging: offset,
            },
            success: function (res) {

                var employee = '';
                for (var i = 0; i < res.length; i++) {
                    arrayEmp[i] = {
                        "employeeId": res[i].employeeId,
                        "employeeName": res[i].employeeName,
                        "department": res[i].department
                    };
                }
                for (var i = 0; i < res.length; i++) {
                    employee += "<tr ><td >"
                        + res[i].employeeId
                        + "</td><td class='data-edit regis-date' contenteditable='true'>"
                        + res[i].employeeName
                        + "</td><td>"
                        + res[i].department
                        + "</td><td>"
                        + "<a class='delete1' title='Delete1' data-target='#popupDelete' onclick='getIdEmp()'  class='btn btn-info btn-lg'  data-toggle='modal'><i class=' fas fa-trash' style='color: red;' /></a></td><td>"
                        + "<a  id='update-employee' class='btn btn-lg' onclick='functionEditEmp(" + res[i].employeeId + ")'><i class='fas fa-pencil-alt'></i></a></td></tr><hr>";

                }
                $("#listEmployee").append(employee);
                $('#tableEmp').excelTableFilter();
            },
            error: function () {
            }
        });

}

$(document).on("click", ".page-number", function () {
    $(".dropdown-filter-dropdown").each(function () {
        $(this).remove();
    });
    page = $(this).html();
    pagging(page);
});

$(document).on("click", ".previous", function () {
    if (page - 1 > 0) {
        $(".dropdown-filter-dropdown").each(function () {
            $(this).remove();
        });
        page--;
        pagging(page);
    }
});
$(document).on("click", ".next", function () {
    if (page < maxPage) {
        $(".dropdown-filter-dropdown").each(function () {
            $(this).remove();
        });
        page++;
        pagging(page);
    }
});

// Delete employee
function getIdEmp() {
    var table = document.getElementById('tableEmployee');
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].onclick = function name() {
            var valueID = this.cells[0].innerHTML;
            var valueName = this.cells[1].innerHTML;
            document.getElementById('employeeId').value = valueID.trim();
            $('#titleDelete').html("bạn có muốn xóa " + valueName);

        };
    }

};


// delete row on add button click
function functionDeleteEmp() {
    var employeeId = document.getElementById("employeeId").value;
    var row;
    for (var i = 0; i < arrayEmp.length; i++) {
        if (employeeId == arrayEmp[i]["employeeId"]) {
            row = i;
        }
    }
    document.getElementById("tableEmployee").deleteRow(row + 1);
    arrayEmp.splice(row, 1);
    $.ajax({
        url: "/Employee/Employee/deleteEmployee",
        type: "Get",
        data: {
            id: employeeId,
        },
        success: function (data) {
            if (data) {
                numberEmp--;
                numberPage(numberEmp);
                getAllEmp();
                window.setTimeout(function () {
                    localStorage.setItem("swal", swal({
                        title: "Success!",
                        text: "Message sent",
                        type: "success",
                        timer: 100,
                        showConfirmButton: false
                    }));
                }, 100);
            } else {
                swal("Error", "Delete Employee Faile ??", "error");
            }

        },
        error: function () {
            swal("Error", "Delete Employee Faile ??", "error");
        }
    });
}

function numberPage(res) {
    $("#numberPagging").html("");
    if (Math.floor(res / 5) * 5 == res) {
        numberPagging = Math.floor(res / 5);
    } else
        numberPagging = Math.floor(res / 5) + 1;
    maxPage = numberPagging;
    listNumberPagging = '';
    listNumberPagging += "<li class='page-item previous'><a class='page-link ' >Previous</a></li>";
    for (var i = 1; i <= numberPagging; i++) {
        if (i == 1)
            listNumberPagging += "<li class='page-item '><a class='page-link page-number' >"
                + i + "</a></li>";
        else
            listNumberPagging += "<li class='page-item'><a class='page-link page-number' >"
                + i + "</a></li>";
    }
    listNumberPagging += "<li class='page-item next'><a class='page-link' >Next</a></li>";
    $("#numberPagging").append(listNumberPagging);
    pagging(1);
}

function functionEditEmp(employeeId) {
    $.ajax({
        url: "/Employee/Employee/getEmpForUpdate",
        type: "Get",
        data: {
            id: employeeId
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            var birthDay = convertDate(res[0].birthday).replace("/", "-").replace("/", "-");
            $('#IdEmp').val(res[0].id);
            $('#formTitle').show();
            $('#nameEmp').val(res[0].nameEmp);
            $('#accountEmp').val(res[0].userEmp);
            $('#emailEmp').val(res[0].email);
            $('#dateEmp').val(birthDay);
            if (res[0].sex == 0)
                $('#formSexEmp').val("Nam");
            else
                $('#formSexEmp').val("Nữ");
            $('#addressEmp').val(res[0].address);
            $('#phoneEmp').val(res[0].phone);
            $('#salaryEmp').val(res[0].salary);
            $('#formDepartment').val(res[0].nameDep);
            $('#formTitle').val(res[0].nameTitle);
            $('#formRole').val(res[0].name);

        },
        error: function () {
            swal("Error", "Get Information Employee Faile ??",
                "error");
        }
    });
};

$(document).on("click", "#add-employee", function () {
    $(".for-update").each(function () {
        $(this).addClass("hide");
    });
    $(".for-add").each(function () {
        $(this).removeClass("hide");
    });
    $("#myModal-update").modal("show");
});

$(document).on("click", "#update-employee", function () {
    $(".for-add").each(function () {
        $(this).addClass("hide");
    });
    $(".for-update").each(function () {
        $(this).removeClass("hide");
    });
    $("#myModal-update").modal("show");
});

$(document).on("click", "#add-employee", function () {
    $(".for-update").each(function () {
        $(this).addClass("hide");
    });
    $(".for-add").each(function () {
        $(this).removeClass("hide");
    });
    $("#myModal-update").modal("show");
});


//submit add
$(document).on("click", "#submit-add-btn", function () {
    var employeeName = document.getElementById("nameEmp").value;
    var userEmp = document.getElementById("accountEmp").value;
    var department = $('#lstDepartment').val();
    var title = $('#lstTitle').val();
    var dateOfBirth = document.getElementById("dateEmp").value;
    var sex = parseInt($('#sexEmp').val());

    var addressEmp = document.getElementById("addressEmp").value;
    var emailAddress = document.getElementById("emailEmp").value;
    var phoneNumber = document.getElementById("phoneEmp").value;
    var salary = document.getElementById("salaryEmp").value;
    var optionRoles = parseInt($('#lstRole').val());
    if (employeeName == "") {
        $('#checkNUll').text("Hãy nhập họ tên")
    } else {
        if (userEmp == "") {
            $('#checkNUll').text("Hãy nhập tài khoản");
        } else {
            if (department == null) {
                $('#checkNUll').text("Hãy chọn phòng ban");
            } else {
                if (title == null) {
                    $('#checkNUll').text("Hãy chọn chức danh");
                } else {
                    if (optionRoles == null) {
                        $('#checkNUll').text("chọn phân quyền");
                    } else {
                        $.ajax({
                            url: "/Employee/Employee/addEmployee",
                            type: "Get",
                            data: {
                                employeeName: employeeName,
                                userEmp: userEmp,
                                department: department,
                                title: title,
                                dateOfBirth: dateOfBirth,
                                sex: sex,
                                addressEmp: addressEmp,
                                emailAddress: emailAddress,
                                phoneNumber: phoneNumber,
                                optionRoles: optionRoles,
                                salary: salary,
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
                                    getAllEmp();
                                    $('#checkNUll').text("");
                                }, 800);
                            },
                            error: function () {
                                swal("Error", "Thêm mới thất bại!", "error");
                            }

                        });
                    }
                }
            }
        }
    }
});
//submit update
$(document).on("click", "#submit-update-btn", function () {
    var idEmp = document.getElementById("IdEmp").value;
    var employeeName = document.getElementById("nameEmp").value;
    var userEmp = document.getElementById("accountEmp").value;
    var department = $('#lstDepartment').val();
    var title = $('#lstTitle').val();
    var dateOfBirth = document.getElementById("dateEmp").value;
    var sex = $('#sexEmp').val();

    var addressEmp = document.getElementById("addressEmp").value;
    var emailAddress = document.getElementById("emailEmp").value;
    var phoneNumber = document.getElementById("phoneEmp").value;
    var salary = document.getElementById("salaryEmp").value;
    var optionRoles = $('#lstRole').val();
    if (employeeName == "") {
        $('#checkNUll').text("hãy nhập họ tên");
    } else {
        if (userEmp == "") {
            $('#checkNUll').text("Hãy nhập tài khoản");
        } else {
            if (department == "") {
                $('#checkNUll').text("Hãy chọn phòng ban");
            } else {
                if (title == "") {
                    $('#checkNUll').text("Hãy chọn chức danh");
                } else {
                    if (optionRoles == "") {
                        $('#checkNUll').text("chọn phân quyền");
                    } else {
                        $.ajax({
                            url: "/Employee/Employee/updateEmployee",
                            type: "Get",
                            data: {
                                id: idEmp,
                                employeeName: employeeName,
                                userEmp: userEmp,
                                department: department,
                                title: title,
                                dateOfBirth: dateOfBirth,
                                sex: sex,
                                addressEmp: addressEmp,
                                emailAddress: emailAddress,
                                phoneNumber: phoneNumber,
                                salary: salary,
                                optionRoles: optionRoles,
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
                                    /*location.reload();*/
                                    getAllEmp();
                                    $('#checkNUll').text("");
                                }, 800);
                            },
                            error: function () {
                                swal("Error", "Your imaginary file is safe ??", "error");

                            }

                        });
                    }
                }
            }
        }
    }
});


function convertDate1(data) {
    var getdate = parseInt(data.replace("/Date(", "").replace(")/", ""));
    var ConvDate = new Date(getdate);
    var month = parseInt(ConvDate.getMonth()) + 1;
    return ConvDate.getDate() + "/" + month + "/" + ConvDate.getFullYear();
}

$("#department").change(function () {
    var id = $("#formTitle").val();
    $("#formTitle").show();
    $
        .ajax({
            url: "/Employee/Employee/getTitleById",
            type: "Get",
            data: {
                id: id
            },
            success: function (res) {
                data = "";
                for (var i = 0; i < res.length; i++) {
                    data += "<option value='" + res[i].id + "'>" + res[i].name + " </option>"
                }
                $("#lstRole").html(data);
            },
            error: function () {
                alert("error get Role");
            }
        });
});

function getAllEmp() {
    $.ajax({
        url: "/Employee/Employee/getAllEmployee",
        method: "Get",
        success: function (res) {
            data = "";
            for (var i = 0; i < res.length; i++) {
                data += " <tr><td>"
                    + res[i].id +
                    "</td><td>"
                    + res[i].nameEmp +
                    "</td><td>"
                    + res[i].nameDep +
                    "</td><td>" +
                    "<a title='Delete1' data-target='#popupDelete' onclick='getIdEmp()' class='btn btn-info btn-lg' data-toggle='modal'><i class='delete1 fas fa-trash'  style='color: red;'></i></a>" +
                    "</td><td>" +
                    "<a id='update-employee' class='btn btn-info btn-lg' onclick='functionEditEmp(" + res[i].id + ")'><i class='fas fa-pencil-alt'></i></a>" +
                    "</td></tr>";
            }
            $("#listEmployee").html(data);
        }
    });
}

$(document).ready(function () {
    getAllEmp();

    $
        .ajax({
            url: "/Employee/Employee/getAllRole",
            type: "Get",
            success: function (res) {
                data = "";
                for (var i = 0; i < res.length; i++) {
                    data += "<option value='" + res[i].id + "'>" + res[i].name + " </option>"
                }
                $("#lstRole").html(data);
                $("#lstRole").val("");
            },
            error: function () {
                alert("error get Role");
            }
        });
    

    $
        .ajax({
            url: "/Oganization/Oganization/getAllDepartment",
            type: "Get",
            success: function (res) {
                data = "";
                for (var i = 0; i < res.length; i++) {
                    data += "<option value='" + res[i].id + "'>" + res[i].nameDep + " </option>"
                }
                $("#lstDepartment").html(data);
                $("#lstDepartment").val("");
            },
            error: function () {
                alert("error get department");
            }
        });


    $("#lstDepartment").change(function () {
        var id = $("#lstDepartment").val();
        $('#formTitle').show();
        $
            .ajax({
                url: "/Oganization/Oganization/getTitleById",
                type: "Get",
                data: {
                    id: id
                },
                success: function (res) {
                    data = "";
                    for (var i = 0; i < res.length; i++) {
                        data += "<option value='" + res[i].idTitle + "'>" + res[i].nameTitle + " </option>"
                    }
                    $("#lstTitle").html(data);
                    $("#lstTitle").val("");
                },
                error: function () {
                    alert("error get Title");
                }
            });
    });

    $("#cancle-btn").click(function () {
        $('#formTitle').hide();
    });

});
