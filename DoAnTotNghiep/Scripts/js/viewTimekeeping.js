
function convertDate(data) {
    var getdate = parseInt(data.replace("/Date(", "").replace(")/", ""));
    var ConvDate = new Date(getdate);
    var month = parseInt(ConvDate.getMonth()) + 1;
    return ConvDate.getFullYear() + "/" + month + "/" + ConvDate.getDate();
}

$(document).ready(function () {

    var current = new Date();
    var month = current.getMonth() + 1;
    var year = current.getFullYear();
    document.getElementById("start").value = year + "-" + month;

    getDataTimekeeping(month, year);

    $("#start").change(function () {
        var x = document.getElementById("start").value;
        var time = x.split("-");
        getDataTimekeeping(time[1], time[0]);
    });
});

function getDataTimekeeping(month, year) {
    $.ajax({
        url: "/Registration/Salaryt/geDataTimeKeeping",
        type: "Get",
        data: {
            month: month,
            year: year
        },
        success: function (data) {
            var db = "";
            for (var i = 0; i < data.length; i++) {
                db += "<tr ><td hidden>"
                    + data[i].id
                    + "</td><td>"
                    + convertDate(data[i].timekeepingDate)
                    + "</td><td>"
                    + data[i].timeStartAM.Hours + ":" + data[i].timeStartAM.Minutes + ":00"
                    + "</td><td>"
                    + data[i].timeFinishAM.Hours + ":" + data[i].timeFinishAM.Minutes + ":00"
                    + "</td><td>"
                    + data[i].timeStartPM.Hours + ":" + data[i].timeStartPM.Minutes + ":00"
                    + "</td><td>"
                    + data[i].timeFinishPM.Hours + ":" + data[i].timeFinishPM.Minutes + ":00"
                    + "</td><td>"
                    + data[i].timeStartOT.Hours + ":" + data[i].timeStartOT.Minutes + ":00"
                    + "</td><td>"
                    + data[i].timeFinishOT.Hours + ":" + data[i].timeFinishOT.Minutes + ":00"
                    + "</td></tr><hr>";
            }
            $('#dataTimeKeeping').html(db);
        },
        error: function () {
            swal("Error", "Lấy dữ liệu thất bại", "error");
        }
    });
}
