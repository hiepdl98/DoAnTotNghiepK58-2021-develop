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

$(document).ready(function () {

    $.ajax({
        type: 'GET',
        url: '/Oganization/Oganization/getNumberBoy',
        success: function (data) {
            $('#numberBoy').append(data);
        }
    });

    $.ajax({
        type: 'GET',
        url: '/Oganization/Oganization/getNumberGirl',
        success: function (data) {
            $('#numberGirl').append(data);
        }
    });

    $
        .ajax({
            url: "/Oganization/Oganization/getNumberNotification",
            type: "Get",
            success: function (data) {
                var count = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].isChecked == 0)
                        count += 1;
                }
                $('#numberNoti').text(count.toString());
            },
            error: function () {
                /*swal("Error", "Change Registration False", "error");*/
            }

        });

    $.ajax({
        type: 'POST',
        url: '/Menu/GetListMenu',
        success: function (data) {
            var db = "";
            var lstFarent = new Array();
            for (var i = 0; i < data.length; i++) {
                lstFarent.push(data[i].parentid);
            }
            var setLst = Array.from(new Set(lstFarent));
            var lstParentSort = removeElement(setLst, 0).sort(function (a, b) {
                return a - b;
            });

            for (var i = 0; i < data.length; i++) {
                if (checkId(lstParentSort, data[i].id) == 1 && data[i].parentid == 0) {
                    db += "<div class='dropdown' style='margin-top: 1em'>\n" +
                        "                    <button class='btn dropdown-toggle' style='color: white;background-color: #111' data-toggle='dropdown'>" + data[i].name + "\n" +
                        "                        <span class='caret'></span></button>\n" +
                        "                    <ul class='dropdown-menu' >\n";
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].parentid == data[i].id) {
                            db += "<li><a tabindex='-1' href='" + data[j].url + "' >" + data[j].name + "</a></li>";
                        }
                    }
                    db += "    </ul>\n" +
                        "                </div>";
                } else {
                    if (checkId(lstParentSort, data[i].id) == 0 && data[i].parentid == 0) {
                        db += "<a class='btn dropdown-toggle' style='margin-top: 1em;color: white;background-color: #111' tabindex='-1' href='" + data[i].url + "'>" + data[i].name + "</a>";
                    }
                }
            }
            db += "<a class='btn dropdown-toggle' style='margin-top: 1em;color: white;background-color: #111' tabindex='-1' href='/Login/getFormChange'>Đổi mật khẩu</a><br>";
            db += "<a class='btn dropdown-toggle' style='margin-top: 1em;color: white;background-color: #111' tabindex='-1' href='/Login/Logout'>Đăng xuất</a>";

            $('#dataMenu').html(db);
        }
    });
});


