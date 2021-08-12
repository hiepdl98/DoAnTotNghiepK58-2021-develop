var current = new Date();
var month = current.getMonth() + 1;
var year = current.getFullYear();

// thay dô?i thông tin li?ch dang ky´ OT
const $tableID = $('#table');
const $BTN = $('#export-btn');
const $EXPORT = $('#export');


// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.on('click', () => {

    const $rows = $tableID.find('tr:not(:hidden)');
    const headers = [];
    const data = [];

    // Get the headers (add special header logic here)
    $($rows.shift()).find('th:not(:empty)').each(function () {
        headers.push($(this).text().toLowerCase());
    });

    // Turn all existing rows into a loopable array
    $rows.each(function () {
        const $td = $(this).find('td');
        const h = {};

        // Use the headers from earlier to name our hash keys
        headers.forEach((header, i) => {

            h[header] = $td.eq(i).text();
        });

        data.push(h);
    });

    // Output the result
    $EXPORT.text(JSON.stringify(data));
});

// dang ky´ li?ch la`m viê?c OT
var checkClick = 0;
$(document).ready(function () {
    var counter = 0;
    // thêm cô?t khi click add new
    $("#addrow").on("click", function () {
        checkClick = 1;
        $(this)
            .attr("disabled",
                "disabled");
        var newRow = $("<tr data-index='" + 0 + "'>");
        var cols = "";

        cols += '<td ><input class="regis-date1" type="date" style="width: 130px;" class="form-control" id="NgayDangKy" name="name' + counter + '"/></td>';
        cols += '<td ><input class="time-start1" type="time" class="form-control" id="TGBatDau" name="mail' + counter + '"/></td>';
        cols += '<td ><input class="time-finish1" type="time"  class="form-control" id="TGKetThuc" name="phone' + counter + '"/></td>';
        cols += '<td ><input class="reason1" type="text"    class="form-control" id="LyDo" name="phone' + counter + '"/></td>';
        cols += '<td></td>';
        cols += '<td></td>';
        cols += '<td><a class="delete" title="Delete" style="background-color: #F4FCEB;"><i class="ibtnDel fas fa-trash" style="color: red;" /i></a></td>';

        newRow.append(cols);
        $("table.order-list").append(newRow);
        counter++;
    });

    $("table.order-list").on("click", ".ibtnDel", function (event) {
        $(this).closest("tr").remove();
        $(".addrow").removeAttr("disabled");
        checkClick = 0;
        counter -= 1
    });


});

function calculateRow(row) {
    var price = +row.find('input[name^="price"]').val();

}

function calculateGrandTotal() {
    var grandTotal = 0;
    $("table.order-list").find('input[name^="price"]').each(function () {
        grandTotal += +$(this).val();
    });
    $("#grandtotal").text(grandTotal.toFixed(2));
}

function convertDate(data) {
    var getdate = parseInt(data.replace("/Date(", "").replace(")/", ""));
    var ConvDate = new Date(getdate);
    var month = parseInt(ConvDate.getMonth()) + 1;
    return ConvDate.getFullYear() + "/" + month + "/" + ConvDate.getDate();
}

// Hiê?n thi? ba?ng dang ky´ li?ch la`m viê?c OT
var arrayData = new Array();
$(document)
    .ready(
        function () {
            var arrAddr = new Array();
            $
                .ajax({
                    url: "/Registration/Registration/getRegistration",
                    type: "Get",
                    data: {
                        month: month,
                        year: year
                    },
                    success: function (res) {

                        var data = "";
                        for (var i = 0; i < res.length; i++) {
                            let minutes = res[i].timeStart.Minutes;
                            if (res[i].timeStart.Minutes < 10) {
                                minutes = "0" + res[i].timeStart.Minutes;
                            }
                            let minutesF = res[i].timeFinish.Minutes;
                            if (res[i].timeFinish.Minutes < 10) {
                                minutesF = "0" + res[i].timeFinish.Minutes;
                            }
                            arrayData[i] = {
                                "otId": res[i].id,
                                "registrationDate": convertDate(res[i].registrationDate),
                                "timeStart": res[i].timeStart.Hours + ":" + minutes + ":00",
                                "timeFinish": res[i].timeFinish.Hours + ":" + minutesF + ":00",
                                "reason": res[i].reason
                            };
                        }
                        for (var i = 0; i < res.length; i++) {
                            let minutes = res[i].timeStart.Minutes;
                            if (res[i].timeStart.Minutes < 10) {
                                minutes = "0" + res[i].timeStart.Minutes;
                            }
                            let minutesF = res[i].timeFinish.Minutes;
                            if (res[i].timeFinish.Minutes < 10) {
                                minutesF = "0" + res[i].timeFinish.Minutes;
                            }
                            if (res[i].statusid == 3) {
                                data += "<tr data-index='" + i + "'><td hidden>"
                                    + res[i].id
                                    + "</td><td class='data-edit regis-date' contenteditable='true'>"
                                    + convertDate( res[i].registrationDate)
                                    + "</td><td class='data-edit time-start' contenteditable='true'>"
                                    + res[i].timeStart.Hours + ":" + minutes + ":00"
                                    + "</td><td class='data-edit time-finish' contenteditable='true'>"
                                    + res[i].timeFinish.Hours + ":" + minutesF + ":00"
                                    + "</td><td class='data-edit reason' contenteditable='true'>"
                                    + res[i].reason
                                    + "</td><td class='not-edit'> "
                                    + "</td><td class='not-edit'>Chờ Duyệt "
                                    + "</td><td class='not-edit'>"
                                    + "<a class='delete1' title='Delete1' data-target='#myModalAdd2' onclick='functionDeleteTime()'  class='btn btn-info btn-lg'  data-toggle='modal'><i class=' fas fa-trash' style='color: red;'></i></a></td></tr>";
                                $('#tableRegistration').html(data);

                            } else {
                                var status;
                                if (res[i].statusid == 1) {
                                    status = "Đã duyệt";
                                } else status = "Bị hủy";
                                data += "<tr data-index='" + i + "'><td hidden>"
                                    + res[i].id
                                    + "</td><td >"
                                    + convertDate(res[i].registrationDate)
                                    + "</td><td>"
                                    + res[i].timeStart.Hours + ":" + minutes + ":00"
                                    + "</td><td>"
                                    + res[i].timeFinish.Hours + ":" + minutesF + ":00"
                                    + "</td><td>"
                                    + res[i].reason
                                    + "</td><td>"
                                    + res[i].reasonForCancel
                                    + "</td><td>"
                                    + status
                                    + "</td><td></td></tr>";
                                $('#tableRegistration').html(data);
                            }
                        }
                    },
                    error: function () {
                        alert("error get table");
                    }
                });
        });


// check date, time
var check;
var checkAdd = 1;
var checkEdit = 1;

function checkDateTime(i, NgayDangKy, TGBatDau, TGKetThuc, LyDo, now, dateNow, dateInput2, arrTimeStart, arrTimeFinish, arrAddr, checkClick) {
    if (NgayDangKy == "") {
        if (arrAddr.length != 0) {
            arrAddr[i][0].css("color", "red");
            arrAddr[i][1].css("color", "black");
            arrAddr[i][2].css("color", "black");
            arrAddr[i][3].css("color", "black");
        }
        check = 0;
        status = "hãy nhập ngày!";
        notification(status);
        return false;
    } else {
        if (TGBatDau == "") {
            status = "hãy nhập thời gian bắt đầu!";
            notification(status);
            if (arrAddr.length != 0) {
                arrAddr[i][1].css("color", "red");
                arrAddr[i][2].css("color", "black");
                arrAddr[i][3].css("color", "black");
                arrAddr[i][0].css("color", "black");
            }
            check = 0;
            return false;
        } else {
            if (TGKetThuc == "") {
                status = "hãy nhập thời gian kết thúc!";
                notification(status);
                if (arrAddr.length != 0) {
                    arrAddr[i][3].css("color", "black");
                    arrAddr[i][0].css("color", "black");
                    arrAddr[i][1].css("color", "black");
                    arrAddr[i][2].css("color", "red");
                }
                check = 0;
                return false;
            } else {
                if (LyDo == "") {
                    status = "hãy nhập lý do!";
                    notification(status);
                    if (arrAddr.length != 0) {
                        arrAddr[i][0].css("color", "black");
                        arrAddr[i][1].css("color", "black");
                        arrAddr[i][2].css("color", "black");
                        arrAddr[i][3].css("color", "red");
                    }
                    check = 0;
                    return false;
                } else {
                    var day = dateInput2.getDay();
                    if (day == 0 || day == 6 || checkHoliday(dateInput2) == 1) {
                        checkDateTime2(i, NgayDangKy, TGBatDau, TGKetThuc, LyDo, now, dateNow, dateInput2, arrTimeStart, arrTimeFinish, arrAddr, checkClick);
                    } else {
                        if ((arrTimeStart[0] == 17 && arrTimeStart[1] >= 30) ||  arrTimeStart[0] > 17) {
                            checkDateTime2(i, NgayDangKy, TGBatDau, TGKetThuc, LyDo, now, dateNow, dateInput2, arrTimeStart, arrTimeFinish, arrAddr, checkClick);
                        } else {
                            status = "Thời gian bắt đầu phải sau 17h30!";
                            notification(status);
                            if (arrAddr.length != 0) {
                                arrAddr[i][0].css("color", "black");
                                arrAddr[i][1].css("color", "red");
                                arrAddr[i][2].css("color", "black");
                                arrAddr[i][3].css("color", "black");
                            }
                        }
                    }
                }
            }
        }
    }
}

function checkDateTime2(i, NgayDangKy, TGBatDau, TGKetThuc, LyDo, now, dateNow, dateInput2, arrTimeStart, arrTimeFinish, arrAddr, checkClick) {
    // check nga`y hiê?n ta?i
    if (dateInput2.getMonth() == dateNow.getMonth() && dateInput2.getFullYear() == dateNow.getFullYear() && dateInput2.getDate() == dateNow.getDate()) {
        if (arrTimeStart[0] < now.getHours()) {
            status = "Thời gian bắt đầu không hợp lệ!\n Thời gian bắt đầu nhỏ hơn thời gian hiện tại";
            notification(status);

            if (arrAddr.length != 0) {
                arrAddr[i][0].css("color", "black");
                arrAddr[i][2].css("color", "black");
                arrAddr[i][3].css("color", "black");
                arrAddr[i][1].css("color", "red");
            }
            check = 0;
            return false;
        } else {
            if (arrTimeStart[0] == now.getHours() && arrTimeStart[1] > now.getMinutes() && arrTimeStart[0] < arrTimeFinish[0]) {
                check = 1;
                if (checkClick == 1) {
                    for (var j = 0; j < arrayData.length; j++) {
                        if (NgayDangKy == arrayData[j]["registrationDate"]) {
                            check = 0;
                            status = "Dữ liệu đã tồn tại!";
                            notification(status);
                            break;
                        } else {
                            check = 1;
                            status = " ";
                            notification(status);
                        }
                    }
                }
                var a = check;
                if (arrAddr.length != 0) {
                    arrAddr[i][1].css("color", "black");
                    arrAddr[i][2].css("color", "black");
                    arrAddr[i][3].css("color", "black");
                    arrAddr[i][0].css("color", "black");
                }

            } else {
                if (arrTimeStart[0] > now.getHours() && arrTimeStart[0] < arrTimeFinish[0]) {
                    check = 1;
                    if (checkClick == 1) {
                        for (var j = 0; j < arrayData.length; j++) {
                            if (NgayDangKy == arrayData[j]["registrationDate"]) {
                                check = 0;
                                status = "Dữ liệu đã tồn tại!";
                                notification(status);
                                break;
                            } else {
                                check = 1;
                                status = " ";
                                notification(status);
                            }
                        }
                    }
                    var a = check;
                    if (arrAddr.length != 0) {
                        arrAddr[i][1].css("color", "black");
                        arrAddr[i][2].css("color", "black");
                        arrAddr[i][3].css("color", "black");
                        arrAddr[i][0].css("color", "black");
                    }

                } else {
                    if (arrTimeStart[0] < now.getHours() || (arrTimeStart[0] == now.getHours() && arrTimeStart[1] < now.getMinutes())) {
                        status = "Thời gian bắt đầu không hợp lệ!\n Thời gian bắt đầu nhở hơn thời gian hiện tại";
                        notification(status);
                        if (arrAddr.length != 0) {
                            arrAddr[i][0].css("color", "black");
                            arrAddr[i][3].css("color", "black");
                            arrAddr[i][1].css("color", "red");
                            arrAddr[i][2].css("color", "red");
                        }
                        check = 0;
                        return false;
                    } else {
                        status = "Thời gian bắt đầu lớn hơn thời gian kết thúc!";
                        notification(status);
                        if (arrAddr.length != 0) {
                            arrAddr[i][0].css("color", "black");
                            arrAddr[i][3].css("color", "black");
                            arrAddr[i][1].css("color", "red");
                            arrAddr[i][2].css("color", "red");
                        }
                        check = 0;
                        return false;
                    }
                }
            }
        }
    } else {
        if (dateInput2.getFullYear() > dateNow.getFullYear() || (dateInput2.getFullYear() == dateNow.getFullYear() && dateInput2.getMonth() > dateNow.getMonth()) || (dateInput2.getFullYear() == dateNow.getFullYear() && dateInput2.getMonth() == dateNow.getMonth() && dateInput2.getDate() > dateNow.getDate())) {
            if ((arrTimeStart[0] == arrTimeFinish[0] && arrTimeStart[1] < arrTimeFinish[1]) || arrTimeStart[0] < arrTimeFinish[0]) {
                check = 1;
                if (checkClick == 1) {
                    for (var j = 0; j < arrayData.length; j++) {
                        if (NgayDangKy == arrayData[j]["registrationDate"]) {
                            check = 0;
                            status = "Dữ liệu đã tồn tại!";
                            notification(status);
                            break;
                        } else {
                            check = 1;
                            status = " ";
                            notification(status);
                        }
                    }
                }
                var a = check;
                if (arrAddr.length != 0) {
                    arrAddr[i][1].css("color", "black");
                    arrAddr[i][2].css("color", "black");
                    arrAddr[i][3].css("color", "black");
                    arrAddr[i][0].css("color", "black");
                }
            } else {
                status = "thời gian bắt đầu và thời gian kết thúc không hợp lệ!";
                notification(status);
                if (arrAddr.length != 0) {
                    arrAddr[i][0].css("color", "black");
                    arrAddr[i][3].css("color", "black");
                    arrAddr[i][1].css("color", "red");
                    arrAddr[i][2].css("color", "red");
                }
                console.log(arrAddr[i][0].html());
                check = 0;
                return false;
            }
        } else {
            status = "Nhập ngày không hợp lệ!\n Thời gian đăng ký nhỏ hơn thời gian hiện tại";
            notification(status);
            if (arrAddr.length != 0) {
                arrAddr[i][1].css("color", "black");
                arrAddr[i][2].css("color", "black");
                arrAddr[i][3].css("color", "black");
                arrAddr[i][0].css("color", "red");
            }
            check = 0;
            return false;
        }

    }
}

function checkHoliday(date) {
    var holidays = ["2020-01-01", "2020-04-30", "2020-05-01", "2020-09-02", "2021-01-01"];
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var check = 0;
    for (var i = 0; i < holidays.length; i++) {
        var arrIndex = holidays[i].split("-");
        if (arrIndex[2] == day && arrIndex[1] == month && arrIndex[0] == year) {
            check = 1;
            break;
        }
    }

}

// thay dô?i thông tin li?ch dang ky´ la`m viê?c
function editTime() {
    checkEdit = 0;
    var arrayCur = new Array();
    var arrayEdit = new Array();
    var arrAddr = new Array();
    $("#myTable tr").each(function (i0) {
        var arrTemp = new Array();
        $(this).find("td").each(function (i1) {
            if ($(this).hasClass("not-edit") == false) {
                arrTemp[i1] = $(this).html();
            }
        });
        arrayCur.push(arrTemp);
    });

    for (var i = 0; i < arrayData.length; i++) {
        if (arrayData[i]["registrationDate"] != arrayCur[i + 1][1] || arrayData[i]["timeStart"] != arrayCur[i + 1][2] || arrayData[i]["timeFinish"] != arrayCur[i + 1][3] || arrayData[i]["reason"] != arrayCur[i + 1][4]) {
            arrayEdit.push(arrayCur[i + 1]);
            // cac o trong hang
            var arrAddr1 = new Array();
            arrAddr1[0] = $("tr[data-index='" + i + "'] .regis-date");
            arrAddr1[1] = $("tr[data-index='" + i + "'] .time-start");
            arrAddr1[2] = $("tr[data-index='" + i + "'] .time-finish");
            arrAddr1[3] = $("tr[data-index='" + i + "'] .reason");

            arrAddr[arrAddr.length] = arrAddr1;
        }
    }
    if (arrayEdit.length == 0) {
        checkEdit = 1;
    }

    if (arrayEdit.length != 0) {
        for (var i = 0; i < arrayEdit.length; i++) {
            // nga`y hê? thô´ng
            var now = new Date();
            var dateNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1 + 1);
            // nga`y nhâ?p
            var dateInput = new Date(arrayEdit[i][1]);
            var dateInput2 = new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate() - 1 + 1);
            // tho`i gian ba´t dâ`u
            var arrTimeStart = arrayEdit[i][2].split(":");
            // tho`i gian kê´t thu´c

            var arrTimeFinish = arrayEdit[i][3].split(":");
            checkDateTime(i, arrayEdit[i][1], arrayEdit[i][2], arrayEdit[i][3], arrayEdit[i][4], now, dateNow, dateInput2, arrTimeStart, arrTimeFinish, arrAddr, 0);
            if (check == 1) {
                checkEdit = 1;
            } else {
                checkEdit = 0;
            }

            if ((check == 1 && checkClick == 0) || (check == 1 && checkClick == 1 && checkAdd == 1)) {
                arrAddr = [];
                $
                    .ajax({
                        url: "/Registration/Registration/editRegistrationDetail",
                        type: "Get",
                        data: {
                            OtId: arrayEdit[i][0],
                            NgayDangKy: arrayEdit[i][1],
                            TGBatDau: arrayEdit[i][2],
                            TGKetThuc: arrayEdit[i][3],
                            LyDo: arrayEdit[i][4],
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
                                location.reload();
                            }, 800);

                        },
                        error: function () {
                            swal("Error", "Change Registration False", "error");
                        }

                    });
            }
        }

    }

}


// thêm li?ch la`m viê?c OT
function addTime() {
    var arrAdd = new Array();
    var NgayDangKy = document
        .getElementById("NgayDangKy").value;
    var TGBatDau = document
        .getElementById("TGBatDau").value;
    var TGKetThuc = document
        .getElementById("TGKetThuc").value;
    var LyDo = document
        .getElementById("LyDo").value;
    // cac o trong hang
    arrAdd1 = new Array();
    arrAdd1[0] = $("tr[data-index='" + 0 + "'] .regis-date1");
    arrAdd1[1] = $("tr[data-index='" + 0 + "'] .time-start1");
    arrAdd1[2] = $("tr[data-index='" + 0 + "'] .time-finish1");
    arrAdd1[3] = $("tr[data-index='" + 0 + "'] .reason1");

    arrAdd[arrAdd.length] = arrAdd1;
    // nga`y hê? thô´ng
    var now = new Date();
    var dateNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1 + 1);
    // nga`y nhâ?p
    var dateInput = new Date(NgayDangKy);
    var dateInput2 = new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate() - 1 + 1);
    // tho`i gian ba´t dâ`u
    var timeStart = $("#TGBatDau").val();
    var arrTimeStart = timeStart.split(":");
    // tho`i gian kê´t thu´c
    var timeFinish = $("#TGKetThuc").val();
    var arrTimeFinish = timeFinish.split(":");
    var i = 0;
    checkDateTime(i, NgayDangKy, TGBatDau, TGKetThuc, LyDo, now, dateNow, dateInput2, arrTimeStart, arrTimeFinish, arrAdd, checkClick);
    if (check == 1) {
        checkAdd = 1;
    } else {
        checkAdd = 0;
    }
    if (checkAdd == 1 && checkEdit == 1 && checkClick == 1) {
        checkClick = 0;
        arrAddr = [];
        $
            .ajax({
                url: "/Registration/Registration/addRegistrationDetail",
                type: "Get",
                data: {
                    NgayDangKy: NgayDangKy,
                    TGBatDau: TGBatDau,
                    TGKetThuc: TGKetThuc,
                    LyDo: LyDo,
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
                        location.reload();
                    }, 800);

                },
                error: function () {

                    swal("Error", "Your imaginary file is safe ??", "error");
                }

            });
    }
}

// function submit
function Submit1() {
    editTime();
    if (checkClick == 1) {
        addTime();
    }
}

// delete row on add button click
function functionDelete() {
    var otId = document.getElementById("otId2").value;
    var LyDoHuy = document.getElementById("LyDoHuy2").value;
    var row;
    for (var i = 0; i < arrayData.length; i++) {
        if (otId == arrayData[i]["otId"]) {
            row = i;
        }
    }
    document.getElementById("myTable").deleteRow(row + 1);
    arrayData.splice(row, 1);


    $.ajax({
        url: "/Registration/Registration/deleteRegistration",
        type: "Get",
        data: {
            otId: otId,
            LyDoHuy: LyDoHuy,
        },
        success: function (data) {

            window.setTimeout(function () {
                localStorage.setItem("swal",
                    swal({
                        title: "Success!",
                        text: "Message sent",
                        type: "success",
                        timer: 800,
                        showConfirmButton: false
                    })
                    );
            }, 800);

        },
        error: function () {
            swal("Error", "Your imaginary file is safe ??", "error");
        }
    });
}

// lâ´y id dua lên popup
function functionDeleteTime() {
    var table = document.getElementById('myTable');
    for (var i = 0; i < table.rows.length; i++) {
        table.rows[i].onclick = function name() {
            document.getElementById('otId2').value = this.cells[0].innerHTML;

        };
    }

};


// ti`m kiê´m
temp = 0;

function functionSearchOT(statusId) {
    $(".addrow").removeAttr("disabled");
    month = current.getMonth() + 1;
    $
        .ajax({
            url: '/Registration/Registration/SearchOverTime',
            type: "Get",
            data: {
                statusId: statusId,
                month: month,
                year: year
            },
            success: function (res) {
                var data = "";
                for (var i = 0; i < res.length; i++) {
                    let minutes = res[i].timeStart.Minutes;
                    if (res[i].timeStart.Minutes < 10) {
                        minutes = "0" + res[i].timeStart.Minutes;
                    }
                    let minutesF = res[i].timeFinish.Minutes;
                    if (res[i].timeFinish.Minutes < 10) {
                        minutesF = "0" + res[i].timeFinish.Minutes;
                    }
                    if (res[i].statusid == 3) {

                        data += "<tr data-index='" + i + "'><td hidden>"
                            + res[i].id
                            + "</td><td class='data-edit regis-date' contenteditable='true'>"
                            + convertDate(res[i].registrationDate)
                            + "</td><td class='data-edit time-start' contenteditable='true'>"
                            + res[i].timeStart.Hours + ":" + minutes + ":00"
                            + "</td><td class='data-edit time-finish' contenteditable='true'>"
                            + res[i].timeFinish.Hours + ":" + minutesF + ":00"
                            + "</td><td class='data-edit reason' contenteditable='true'>"
                            + res[i].reason
                            + "</td><td class='not-edit'> "
                            + res[i].reasonForCancel
                            + "</td><td class='not-edit'>Chờ duyệt"
                            + "</td><td class='not-edit'>"
                            + "<a class='delete1' title='Delete1' data-target='#myModalAdd2' onclick='functionDelete1()'  class='btn btn-info btn-lg'  data-toggle='modal'><i class=' fas fa-trash' style='color: red;' /i></a></td></tr>";

                    } else {
                        var status;
                        if (res[i].statusid == 1) {
                            status = "Đã duyệt";
                        } else status = "Bị hủy";
                        data += "<tr data-index='" + i + "'><td hidden>"
                            + res[i].id
                            + "</td><td >"
                            + convertDate(res[i].registrationDate)
                            + "</td><td>"
                            + res[i].timeStart.Hours + ":" + minutes + ":00"
                            + "</td><td>"
                            + res[i].timeFinish.Hours + ":" + minutesF + ":00"
                            + "</td><td>"
                            + res[i].reason
                            + "</td><td>"
                            + res[i].reasonForCancel
                            + "</td><td>"
                            + status
                            + "</td><td></td></tr>";

                    }
                }
                $('#tableRegistration').html(data);

            },
            error: function () {
                swal("Error", "Get Registration for Search", "error");
            }
        });
}

// hiê?n thi? thông ba´o
function notification(status) {
    if (status != "") document.getElementById("demo1").innerHTML = status;
}

// phân trang theo tha´ng
function PagitrationByMonthAddOT(id, index) {
    $(".addrow").removeAttr("disabled");
    temp;
    arrayData = [];
    if (month == 1 && id == 'PreviousByMonth') {
        year = year - 1;
        month = 12;
    } else if (month == 12 && id == 'NextByMont') {
        year = year + 1;
        month = 1;
    } else {
        month += parseInt(index);
        year;
    }
    $
        .ajax({
            url: '/Registration/Registration/PagingByMonthOverTime',
            type: "Get",
            data: {
                temp: temp,
                month: month,
                year: year
            },
            success: function (res) {
                var data = "";
                for (var i = 0; i < res.length; i++) {
                    let minutes = res[i].timeStart.Minutes;
                    if (res[i].timeStart.Minutes < 10) {
                        minutes = "0" + res[i].timeStart.Minutes;
                    }
                    let minutesF = res[i].timeFinish.Minutes;
                    if (res[i].timeFinish.Minutes < 10) {
                        minutesF = "0" + res[i].timeFinish.Minutes;
                    }
                    arrayData[i] = {
                        "otId": res[i].id,
                        "registrationDate": convertDate(res[i].registrationDate),
                        "timeStart": res[i].timeStart.Hours + ":" + minutes + ":00",
                        "timeFinish": res[i].timeFinish.Hours + ":" + minutesF + ":00",
                        "reason": res[i].reason
                    };
                }
                for (var i = 0; i < res.length; i++) {
                    let minutes = res[i].timeStart.Minutes;
                    if (res[i].timeStart.Minutes < 10) {
                        minutes = "0" + res[i].timeStart.Minutes;
                    }
                    let minutesF = res[i].timeFinish.Minutes;
                    if (res[i].timeFinish.Minutes < 10) {
                        minutesF = "0" + res[i].timeFinish.Minutes;
                    }
                    if (res[i].statusid == 3) {

                        data += "<tr data-index='" + i + "'><td hidden>"
                            + res[i].id
                            + "</td><td class='data-edit regis-date' contenteditable='true'>"
                            + convertDate(res[i].registrationDate)
                            + "</td><td class='data-edit time-start' contenteditable='true'>"
                            + res[i].timeStart.Hours + ":" + minutes + ":00"
                            + "</td><td class='data-edit time-finish' contenteditable='true'>"
                            + res[i].timeFinish.Hours + ":" + minutesF + ":00"
                            + "</td><td class='data-edit reason' contenteditable='true'>"
                            + res[i].reason
                            + "</td><td class='not-edit'> "
                            + res[i].reasonForCancel
                            + "</td><td class='not-edit'>Chờ duyệt"
                            + "</td><td class='not-edit'>"
                            + "<a class='delete1' title='Delete1' data-target='#myModalAdd2' onclick='functionDelete1()'  class='btn btn-info btn-lg'  data-toggle='modal'><i class=' fas fa-trash' style='color: red;' /i></a></td></tr>";

                    } else {
                        var status;
                        if (res[i].statusid == 1) {
                            status = "Đã duyệt";
                        } else status = "Bị hủy";
                        data += "<tr data-index='" + i + "'><td hidden>"
                            + res[i].id
                            + "</td><td >"
                            + convertDate(res[i].registrationDate)
                            + "</td><td>"
                            + res[i].timeStart.Hours + ":" + minutes + ":00"
                            + "</td><td>"
                            + res[i].timeFinish.Hours + ":" + minutesF + ":00"
                            + "</td><td>"
                            + res[i].reason
                            + "</td><td>"
                            + res[i].reasonForCancel
                            + "</td><td>"
                            + status
                            + "</td><td></td></tr>";

                    }
                }
                $('#tableRegistration').html(data);
                $('#myTable').load();

            },
            error: function () {
                alert("error");
            }
        });
}

// xuâ´t file Excel
function exportExcel() {
    $("#year").val(year);
    $("#temp").val(temp);
    $("#month").val(month);
    $("#btn-download").parent().submit();
};
