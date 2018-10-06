var pixelCoords = gridToIso(player);
var pX = pixelCoords.x + 256 - 32;
var pY = pixelCoords.y - 32;

$("#player").css("left", pX);
$("#player").css("top", pY);

var shiftPressed = false;

listener.register_combo({
    "keys": "shift",
    "on_keydown": function () {
        shiftPressed = true;
    },
    "on_keyup": function () {
        shiftPressed = false;
    },
    "prevent_default": true
});