function changePW() {
    var currentpw = document.getElementById("currentPw").value;
    var psw = document.getElementById("psw").value;

    $.ajax({
        type: 'Get',
        url: '/Login/ChangePassword',
        data: {
            currentpw: currentpw,
            psw: psw
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
                location.reload();
        },
        error: function () {
            swal("Error", "Change false", "error");
        }
    });
}
