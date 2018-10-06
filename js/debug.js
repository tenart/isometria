//var x = parseInt($(this).attr("data-x"), 10);
//var y = parseInt($(this).attr("data-y"), 10);
//var z = parseInt($(this).attr("data-z"), 10);
var x,y,z;

$(document).on("mouseover", ".cube", function () {
    x = parseInt($(this).attr("data-x"), 10);
    y = parseInt($(this).attr("data-y"), 10);
    z = parseInt($(this).attr("data-z"), 10);
});

$("#developer-window").draggable();

function updateDevWindow() {
    
    document.getElementById('developer-window').innerHTML = 
        '<p>Block X: ' + x + ' </p>'
        + '<p>Block Y: ' + y + '</p>'
        + '<p>Block Z: ' + z + '</p>'
        + '<p>' + '</p>'
        ;
}

updateDevWindow();