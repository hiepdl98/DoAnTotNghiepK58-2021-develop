var so1 = 0;
var so2 = 0;
$(document).ready(function () {
    let sothunhat = document.getElementById("sothunhat")
    let sothuhai = document.getElementById("sothuhai")
    so1 = Math.floor(Math.random() * 10);
    so2 = Math.floor(Math.random() * 10);
    sothunhat.innerText = so1 + ' ';
    sothuhai.innerText = so2 + ' ';
});

function login() {
    var input = document.getElementById("calculator").value;
    if (input == (so1 + so2)) {
        var user = document.getElementById("user").value;
        var pw = document.getElementById("pw").value;
        $
            .ajax({
                url: "/Login/CheckLogin",
                type: "Post",
                data: {
                    user: user,
                    pw: pw
                },
                success: function (data) {
                    if (data == "True")
                        window.location.href = "/Oganization/Dashboard/Index";
                    else swal("Error", "User Or Password False", "error");
                },
                error: function () {
                    swal("Error", "User Or Password False", "error");
                }

            });
    } else {
        $("#calculator").css('color', 'red');
    }
}
