$(document).ready(function () {

    $
        .ajax({
            url: "/getPost",
            type: "Get",
            success: function (data) {
                db = "";
                for(var i = 0 ; i < data.length ; i++){
                    db += "<a style='font-size: 24px;margin-left: 50px'> " + data[i].theme + "</a><br>"
                }
                $("#thongbao").html(db);

            },
            error: function () {
                swal("Error", "Change Registration False", "error");
            }

        });
});
