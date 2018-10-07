//var x = parseInt($(this).attr("data-x"), 10);
//var y = parseInt($(this).attr("data-y"), 10);
//var z = parseInt($(this).attr("data-z"), 10);
var x,y,z;

$(document).on("mouseover", ".cube", function () {
    x = parseInt($(this).attr("data-x"), 10);
    y = parseInt($(this).attr("data-y"), 10);
    z = parseInt($(this).attr("data-z"), 10);
    //updateCoordsWindow();
});

$(".developer-window").draggable();

function updateCoordsWindow() {
    
    document.getElementById('debug-coordinates').innerHTML = 
        '<p>Block X: ' + x + ' </p>'
        + '<p>Block Y: ' + y + '</p>'
        + '<p>Block Z: ' + z + '</p>'
        + '<p>' + '</p>'
        ;
}

//updateCoordsWindow();

$("#debug-materials button").click(function() {
    $("#debug-materials button").removeClass("active");
    $(this).addClass("active");
    buildID = $(this).attr("data-id");
})
