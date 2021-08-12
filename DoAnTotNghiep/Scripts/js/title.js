var arrayInfor = new Array();


function getIdTitle() {
    var table = document.getElementById('tableTitle');
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].onclick = function name() {
            var valueID = this.cells[0].innerHTML;
            var valueName = this.cells[1].innerHTML;
            document.getElementById('titleId').value = valueID.trim();
            $('#titleDelete').html("bạn có muốn xóa " + valueName);

        };
    }

};


// delete row on add button click
function functionDeleteTitle() {
    var titleId = document.getElementById("titleId").value;
    $.ajax({
        url: "/Oganization/Oganization/deleteTitle",
        type: "Get",
        data: {
            id: titleId,
        },
        success: function (data) {
            if (data != "False") {
                getAllTitle();
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
                swal("Xóa chức danh không thành công", "Chức danh đang được sử dụng", "error");
            }

        },
        error: function () {
            swal("Error", "Xóa chức danh không thành công", "error");
        }
    });
}


function functionEditTitle(titleId) {
    $.ajax({
        url: "/Oganization/Oganization/getTitleForUpdate",
        type: "Get",
        data: {
            id: titleId
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            $('#IdTitle').val(res[0].idTitle);
            $('#IdDepartmentCurrent').val(res[0].idDepartment);
            $('#nameTitle').val(res[0].nameTitle);
            $('#formDepartment').val(res[0].nameDep);

        },
        error: function () {
            swal("Error", "Lấy thông tin thất bại",
                "error");
        }
    });
};

$(document).on("click", "#addTitle", function () {
    $(".for-update").each(function () {
        $(this).addClass("hide");
    });
    $(".for-add").each(function () {
        $(this).removeClass("hide");
    });
    $("#myModal-update").modal("show");
});

$(document).on("click", "#update-title", function () {
    $(".for-add").each(function () {
        $(this).addClass("hide");
    });
    $(".for-update").each(function () {
        $(this).removeClass("hide");
    });
    $("#myModal-update").modal("show");
});

/*$(document).on("click", "#add-title", function () {
    $(".for-update").each(function () {
        $(this).addClass("hide");
    });
    $(".for-add").each(function () {
        $(this).removeClass("hide");
    });
    $("#myModal-update").modal("show");
});
*/

//submit add
$(document).on("click", "#submit-add-btn", function () {
    var nameTitle = document.getElementById("nameTitle").value;
    var idDepartmentNew = $('#lstDepartment').val();
    if (nameTitle == null) {
        $('#checkNUll').text("Hãy nhập tên chức danh");
    } else {
        if (idDepartmentNew == null) {
            $('#checkNUll').text("chọn phòng ban");
        } else {
            $.ajax({
                url: "/Oganization/Oganization/addTitle",
                type: "Get",
                data: {
                    nameTitle: nameTitle,
                    idDepartmentNew: idDepartmentNew,
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
                        getAllTitle();
                    }, 800);
                },
                error: function () {
                    swal("Error", "Thêm mới thất bại!", "error");
                }

            });
        }
    }
});
//submit update
$(document).on("click", "#submit-update-btn", function () {
    var idTitle = document.getElementById("IdTitle").value;
    var nameTitle = document.getElementById("nameTitle").value;
    var IdDepartmentCurrent = document.getElementById("IdDepartmentCurrent").value;
    var idDepartmentNew = $('#lstDepartment').val();


    if (nameTitle == "") {
        $('#checkNUll').text("Hãy nhập tên chức danh");
    } else {
        if (idDepartmentNew == "") {
            $('#checkNUll').text("chọn phòng ban");
        } else {
            $.ajax({
                url: "/Oganization/Oganization/updateTitle",
                type: "Get",
                data: {
                    idTitle: idTitle,
                    nameTitle: nameTitle,
                    IdDepartmentCurrent: IdDepartmentCurrent,
                    idDepartmentNew: idDepartmentNew
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
                        getAllTitle();
                    }, 800);
                },
                error: function () {
                    swal("Error", "Your imaginary file is safe ??", "error");

                }

            });
        }
    }
});


function getAllTitle() {
    $.ajax({
        url: "/Oganization/Oganization/getAllTitle",
        method: "Get",
        success: function (res) {
            data = "";
            for (var i = 0; i < res.length; i++) {
                data += " <tr><td>"
                    + res[i].idTitle +
                    "</td><td>"
                    + res[i].nameTitle +
                    "</td><td>"
                    + res[i].nameDep +
                    "</td><td>" +
                    "<a title='Delete1' data-target='#popupDelete' onclick='getIdTitle()' class='btn btn-info btn-lg' data-toggle='modal'><i class='delete1 fas fa-trash'  style='color: red;'></i></a>" +
                    "</td><td>" +
                    "<a id='update-title' class='btn btn-info btn-lg' onclick='functionEditTitle(" + res[i].idTitle + ")'><i class='fas fa-pencil-alt'></i></a>" +
                    "</td></tr>";
            }
            $("#listTitle").html(data);
        }
    });
}

$(document).ready(function () {
    getAllTitle();

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

    $("#cancle-btn").click(function () {
        $('#formTitle').hide();
    });

});
