function movePlayer() {
    var pixelCoords = gridToIso(player);
    var pX = pixelCoords.x + 256 - 32;
    var pY = pixelCoords.y - 32;
    $("#player").css("left", pX);
    $("#player").css("top", pY);
}

function moveUp() {
    player.y--;
    movePlayer();
}
function moveDown() {
    player.y++;
    movePlayer();
}
function moveLeft() {
    player.x--;
    movePlayer();
}
function moveRight() {
    player.x++;
    movePlayer();
}

listener.simple_combo("up", moveUp);
listener.simple_combo("w", moveUp);
listener.simple_combo("down", moveDown);
listener.simple_combo("s", moveDown);
listener.simple_combo("left", moveLeft);
listener.simple_combo("a", moveLeft);
listener.simple_combo("right", moveRight);
listener.simple_combo("d", moveRight);