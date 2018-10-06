var pixelCoords, pX, pY;

function updatePlayer() {
    pixelCoords = gridToIso(player);
    pX = pixelCoords.x + 256 - 32;
    pY = pixelCoords.y - 32;
    $("#player").css("left", pX);
    $("#player").css("top", pY);
}

function movePlayerTo(x, y) {
    player.x = x;
    player.y = y;
    updatePlayer();
}
function movePlayerTo(x, y, z) {
    player.x = x;
    player.y = y;
    player.z = z;
    updatePlayer();
}

function moveUp() {
    player.y--;
    updatePlayer();
}
function moveDown() {
    player.y++;
    updatePlayer();
}
function moveLeft() {
    player.x--;
    updatePlayer();
}
function moveRight() {
    player.x++;
    updatePlayer();
}

listener.simple_combo("up", moveUp);
listener.simple_combo("w", moveUp);
listener.simple_combo("down", moveDown);
listener.simple_combo("s", moveDown);
listener.simple_combo("left", moveLeft);
listener.simple_combo("a", moveLeft);
listener.simple_combo("right", moveRight);
listener.simple_combo("d", moveRight);

updatePlayer();