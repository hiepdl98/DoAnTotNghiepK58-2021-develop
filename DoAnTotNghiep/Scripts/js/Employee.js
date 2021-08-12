function convertDate(data) {
    var getdate = parseInt(data.replace("/Date(", "").replace(")/", ""));
    var ConvDate = new Date(getdate);
    var month = parseInt(ConvDate.getMonth()) + 1;
    if (month < 10) {
        month = "0" + month;
    }
    return ConvDate.getFullYear() + "/" + month + "/" + ConvDate.getDate();
}

$(document).ready(function () {
    $
        .ajax({
            url: "/Employee/Employee/getInformation",
            type: "Get",
            success: function (res) {
                var birthDay = convertDate(res[0].birthday).replace("/", "-").replace("/", "-");

                $('#nameUser').val(res[0].nameEmp);
                $('#accountUser').val(res[0].userEmp);
                $('#emailUser').val(res[0].email);
                $('#dateUser').val(birthDay);
                if (res[0].sex)
                    $('#formSex').val("Nữ");
                else
                    $('#formSex').val("Nam");
                $('#addressUser').val(res[0].address);
                $('#phoneUser').val(res[0].phone);
                $('#salary').val(res[0].salary);
                $('#departmentUser').val(res[0].nameDep);
                $('#titleUser').val(res[0].nameTitle);
                /*document.getElementById("imgAvatar").src = res[0].image;*/
            },
            error: function () {
                alert("error getInformation");
            }
        });

});

function changeInformation() {
    var fileUpload = $("#inputGroupFile02").get(0);
    var file = fileUpload.files;

    var employeeName = document.getElementById("nameUser").value;
    var userEmp = document.getElementById("accountUser").value;
    var emailEmp = document.getElementById("emailUser").value;
    var dateOfBirth = document.getElementById("dateUser").value;
    var sex = $("#sexUser").val();

    var addressEmp = document.getElementById("addressUser").value;
    var phoneNumber = document.getElementById("phoneUser").value;


    const formData = new FormData();
    formData.append('prodFile', file[0]);
    postData('GET', '/Image/editImage', formData).then(function (msg) {

    })

    if (employeeName != "") {

        $.ajax({
            url: "/Employee/Employee/ChangeInformation",
            type: "Get",
            data: {
                employeeName: employeeName,
                userEmp: userEmp,
                dateOfBirth: dateOfBirth,
                sex: sex,
                addressEmp: addressEmp,
                emailAddress: emailEmp,
                phoneNumber: phoneNumber
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
    } else
        $('#checkInfor').text("Hãy nhập họ tên");


}


