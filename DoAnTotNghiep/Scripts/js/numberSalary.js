function formatPrice(str) {
    if (str == null) {
        return '0';
    }
    str = typeof str != 'string' ? str.toString() : parseFloat(str).toString();
    return str.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}
$(document).ready(function () {
    $
        .ajax({
            url: "/Registration/Salaryt/sumSalary",
            type: "Get",
            success: function (res) {
                data = "";
                var salary = formatPrice(Math.round(res[0].totalSalary * 100) / 100) + "đ";
                var tienbh = formatPrice(Math.round(res[0].bh * 100) / 100) + "đ";
                data += "<h2 style='text-align: end'>Lương Tháng " + (res[0].mon-1)  + "</h2>";
                data += "<tr data-index='" + i + "' style='border: 1px'><td > Số ngày làm việc: "
                    + "</td><td class='data-edit regis-date' contenteditable='true' >"
                    + Math.round(res[0].numberDayWork * 100) / 100
                    + "</td></tr>";
                data += "<tr data-index='" + i + "' style='border: 1px'><td > Tổng giờ làm lý thuyết: "
                    + "</td><td class='data-edit regis-date' contenteditable='true' >"
                    + Math.round(res[0].numberTimeWorkLT * 100) / 100 
                    + "</td></tr>";

                data += "<tr data-index='" + i + "' style='border: 1px'><td  > Tổng giờ làm thực tế: "
                    + "</td><td class='data-edit regis-date' contenteditable='true' >"
                    + Math.round(res[0].numberTimeWorkTT * 100) / 100
                    + "</td></tr>";

                data += "<tr data-index='" + i + "' style='border: 1px'><td >Tổng giờ làm ngoài giờ: "
                    + "</td><td class='data-edit regis-date' contenteditable='true' >"
                    + Math.round(res[0].numberTimeOT * 100) / 100
                    + "</td></tr>";

                data += "<tr data-index='" + i + "' style='border: 1px'><td >Bảo Hiểm: "
                    + "</td><td class='data-edit regis-date' contenteditable='true' >"
                    + tienbh 
                    + "</td></tr>";
                data += "<tr data-index='" + i + "' style='border: 1px'><td >Tổng lương: "
                    + "</td><td class='data-edit regis-date' contenteditable='true' >"
                    + salary 
                    + "</td></tr>";

                $("#numberSalary").html(data);
            },
            error: function () {
                alert("error sum salary");
            }
        });
});
function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}


