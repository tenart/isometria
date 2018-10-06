var listener = new window.keypress.Listener();

var map3d = new Array(layers);
for (zz = 0; zz < layers; zz++) {
    map3d[zz] = new Array(width);
    for (yy = 0; yy < height; yy++) {
        map3d[zz][yy] = new Array(width)
        for (xx = 0; xx < width; xx++) {
            map3d[zz][yy][xx] = 0;
        }
    }
}

$("#floor_widget_wrap").css("height", height * tile);
$("#floor_widget_wrap").css("width", width * tile);
$("#floor_widget_wrap").css("margin-left", height * tile / 4 * -1);
$("#floor_widget_wrap").css("margin-top", width * tile / 4 * -1);

// DYNAMICALLY ADDS FLOOR GRID BUTTONS AND OTHER GRAPHIC

for (i = 0; i < height * width; i++) {
    $("#floor_widget_wrap").append("<div class='floor_button'></div>");
}

function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function gridToIso(input) {
    //  screen.x = (map.x - map.y) * TILE_WIDTH_HALF;
    //  screen.y = (map.x + map.y) * TILE_HEIGHT_HALF;
    var x = input.x;
    var y = input.y;
    var z = input.z;
    var output = {
        x: ((x - y) * 32),
        y: ((x + y) * 16) - (32 * z)
    };
    return output;
}

// USED BY drawIso() TO DRAW ONE CUBE AT A TIME.
// CAN BE CALLED DIRECTLY TO DRAW CUBES BUT WILL CREATE LAYERING ARTIFACT

function drawCube(gridCoords, materialID) {
    if (materialID == 0) {
        return false;
    } else {
        var pixelCoords = gridToIso(gridCoords);
        var pX = pixelCoords.x + 256 - 32;
        var pY = pixelCoords.y - 32;
        $("#draw_wrapper").append("<div class='cube c" + materialID + "' data-materialID='" + materialID + "' data-x='" + gridCoords.x + "' data-y='" + gridCoords.y + "' data-z='" + gridCoords.z + "' style='top:" + pY + "px; left:" + pX + "px'></div>")
    }
}

function clearFaceSelector() {
    $("#face_selector").hide();
    $("#cube_delete_icon").hide();
    $("#face_selector").css("left", 0);
    $("#face_selector").css("top", 0);
}

// CLEARS AND DRAW ENTIRE MAP USING DATA FROM map3d ARRAY.
// SHOULD BE CALLED AFTER UPDATING ARRAY

function drawIso() {
    $("#draw_wrapper").empty();
    clearFaceSelector();
    for (z = 0; z < layers; z++) {
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                var gridCoords = {
                    x: x,
                    y: y,
                    z: z
                }
                drawCube(gridCoords, map3d[z][y][x]);
            }
        }
    }
}

// USED TO UPDATE A VALUE FROM

function updateArray(targetArray, gridCoords, materialID) {
    if (gridCoords.x < 0 ||
        gridCoords.y < 0 ||
        gridCoords.z < 0 ||
        gridCoords.x > width - 1 ||
        gridCoords.y > height - 1 ||
        gridCoords.z > layers - 1) {
        console.log("Out of bounds gridCoords")
    } else {
        targetArray[gridCoords.z][gridCoords.y][gridCoords.x] = materialID;
        localStorage.setItem("savedMap3d", JSON.stringify(targetArray));
        console.log("Location " + gridCoords.x + " " + gridCoords.y + " " + gridCoords.z + " successfully updated")
    }
}

// USEFUL FOR PASSING 3D GRID COORDINATES TO ARRAY FUNCTIONS

function gridCoords(x, y, z) {
    var object = {
        x: x,
        y: y,
        z: z
    }
    return object;
}

var template1 = [
    [
        [2, 0, 2],
        [0, 1, 0],
        [2, 0, 2]
    ],
    [
        [2, 2, 2],
        [2, 0, 2],
        [2, 2, 2]
    ],
    [
        [2, 2, 2],
        [2, 0, 2],
        [2, 2, 2]
    ]
];

var template2 = [
    [
        [2, 2, 2],
        [1, 0, 1],
        [2, 2, 2]
    ],
    [
        [2, 2, 2],
        [2, 1, 2],
        [2, 2, 2]
    ]
];

var template3 = [
    [
        [2, 1, 2],
        [2, 0, 2],
        [2, 1, 2]
    ],
    [
        [2, 2, 2],
        [2, 1, 2],
        [2, 2, 2]
    ]
];

function searchMap(targetArray, template, tempDimensions, tempDatum) {

    var xDim = tempDimensions.x;
    var yDim = tempDimensions.y;
    var zDim = tempDimensions.z;

    var zUpBound = zDim - (tempDatum.z + 1);
    var zDnBound = tempDatum.z;

    var yUpBound = yDim - (tempDatum.y + 1);
    var yDnBound = tempDatum.y;

    var xUpBound = xDim - (tempDatum.x + 1);
    var xDnBound = tempDatum.x;

    var matches = [];

    var count = 0;

    for (z = 0; z < layers; z++) {
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                if (targetArray[z][y][x] == template[tempDatum.z][tempDatum.y][tempDatum.x]) {
                    count++;
                    var currentBuffer = new Array(zDim);
                    for (zz = 0; zz < zDim; zz++) {
                        currentBuffer[zz] = new Array(yDim);
                        for (yy = 0; yy < yDim; yy++) {
                            currentBuffer[zz][yy] = new Array(xDim)
                            for (xx = 0; xx < xDim; xx++) {
                                currentBuffer[zz][yy][xx] = 0;

                                var currentX = x - (xDnBound - xx);
                                var currentY = y - (yDnBound - yy);
                                var currentZ = z - (zDnBound - zz);

                                if (currentX < 0 ||
                                    currentY < 0 ||
                                    currentZ < 0 ||
                                    currentX > width - 1 ||
                                    currentY > height - 1 ||
                                    currentZ > layers - 1) {
                                    currentBuffer[zz][yy][xx] = 0;
                                } else {
                                    currentBuffer[zz][yy][xx] = targetArray[currentZ][currentY][currentX];
                                }
                            }
                        }
                    }

                    var matchStatus;
                    for (zz = 0; zz < zDim; zz++) {
                        for (yy = 0; yy < yDim; yy++) {
                            for (xx = 0; xx < xDim; xx++) {
                                var rule = template[zz][yy][xx];
                                var current = currentBuffer[zz][yy][xx];
                                if (rule == 2) {
                                    matchStatus = true;
                                } else {
                                    if (current == rule) {
                                        matchStatus = true;
                                    } else {
                                        matchStatus = false;
                                        break
                                    }
                                }
                            }

                            if (matchStatus == false) {
                                break;
                            }

                        }

                        if (matchStatus == false) {
                            break;
                        }

                    }
                    if (matchStatus == false) {
                        console.log(x + " " + y + " " + z + " disqualified");
                    } else {
                        matches.push(gridCoords(x, y, z));
                        console.log(x + " " + y + " " + z + " matched");
                    }
                }
            }
        }
    }
    console.log(matches.length + "/" + count + " matched");
    return matches;
}

$("#search").click(function () {
    var matches = searchMap(map3d, template1, gridCoords(3, 3, 3), gridCoords(1, 1, 0));
    for (i = 0; i < matches.length; i++) {
        var coords = matches[i];
        coords.z++;
        updateArray(map3d, coords, 20);
    }
    drawIso();
})

$("#search_b").click(function () {
    var matches = searchMap(map3d, template2, gridCoords(3, 3, 2), gridCoords(1, 1, 1));
    for (i = 0; i < matches.length; i++) {
        var coords = matches[i];
        coords.z--;
        updateArray(map3d, coords, 31);
    }
    drawIso();
})

$("#search_c").click(function () {
    var matches = searchMap(map3d, template3, gridCoords(3, 3, 2), gridCoords(1, 1, 1));
    for (i = 0; i < matches.length; i++) {
        var coords = matches[i];
        coords.z--;
        updateArray(map3d, coords, 30);
    }
    drawIso();
})

var lastSaved = localStorage.getItem("savedMap3d");

if (lastSaved !== null) {
    //map3d = JSON.parse(lastSaved);
    //drawIso();
}

$(".floor_button").click(function () {
    var index = $(this).index();
    var x = index % width;
    var y = Math.floor(index / width);
    var gridCoords = {
        x: x,
        y: y,
        z: 0
    }
    var materialID = 1;
    updateArray(map3d, gridCoords, materialID);
    drawIso();
})

$("#face_selector").hide();

$(document).on("mouseover", ".cube", function () {
    var x = parseInt($(this).attr("data-x"), 10);
    var y = parseInt($(this).attr("data-y"), 10);
    var z = parseInt($(this).attr("data-z"), 10);
    var pX = $(this).css("left");
    var pY = $(this).css("top");
    var lAdjacent;
    var rAdjacent;
    var uAdjacent;
    $("#face_right").hide();
    $("#face_left").hide();
    if (z < layers - 1) {
        if (map3d[z + 1][y][x] == 0) {
            $("#face_top").show();
        } else {
            $("#face_top").hide();
        }
    } else {
        $("#face_top").hide();
    }
    if (y < height - 1) {
        if (map3d[z][y + 1][x] == 0) {
            $("#face_left").show();
        } else {
            $("#face_left").hide();
        }
    } else {
        $("#face_left").hide();
    }
    if (map3d[z][y][x + 1] == 0) {
        $("#face_right").show();
    } else {
        $("#face_right").hide();
    }
    $("#grid_2d_debug_msg_4").text("4: cube x " + x);
    $("#grid_2d_debug_msg_5").text("5: cube y " + y);
    $("#face_selector").show();
    $("#face_selector").css("left", pX);
    $("#face_selector").css("top", pY);
    $("#face_selector").attr("data-x", x);
    $("#face_selector").attr("data-y", y);
    $("#face_selector").attr("data-z", z);
})

$("#face_left").click(function () {
    if (shiftPressed) {
        return false;
    }
    var gridCoords = {
        x: parseInt($(this).closest("#face_selector").attr("data-x"), 10),
        y: parseInt($(this).closest("#face_selector").attr("data-y"), 10) + 1,
        z: parseInt($(this).closest("#face_selector").attr("data-z"), 10)
    }
    var materialID = 1;
    updateArray(map3d, gridCoords, materialID);
    drawIso();
})

$("#face_right").click(function () {
    if (shiftPressed) {
        return false;
    }
    var gridCoords = {
        x: parseInt($(this).closest("#face_selector").attr("data-x"), 10) + 1,
        y: parseInt($(this).closest("#face_selector").attr("data-y"), 10),
        z: parseInt($(this).closest("#face_selector").attr("data-z"), 10)
    }
    var materialID = 1;
    updateArray(map3d, gridCoords, materialID);
    drawIso();
})

$("#face_top").click(function () {
    if (shiftPressed) {
        return false;
    }
    var gridCoords = {
        x: parseInt($(this).closest("#face_selector").attr("data-x"), 10),
        y: parseInt($(this).closest("#face_selector").attr("data-y"), 10),
        z: parseInt($(this).closest("#face_selector").attr("data-z"), 10) + 1
    }
    var materialID = 1;
    updateArray(map3d, gridCoords, materialID);
    drawIso();
})

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

$(".face_button").click(function () {
    if (shiftPressed) {
        var gridCoords = {
            x: parseInt($(this).closest("#face_selector").attr("data-x"), 10),
            y: parseInt($(this).closest("#face_selector").attr("data-y"), 10),
            z: parseInt($(this).closest("#face_selector").attr("data-z"), 10)
        };
        var materialID = 0;
        updateArray(map3d, gridCoords, materialID);
        drawIso();
    }
})

function clearAll() {
    for (z = 0; z < layers; z++) {
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                var gridCoords = {
                    x: x,
                    y: y,
                    z: z
                }
                map3d[z][y][x] = 0;
            }
        }
    }
    drawIso();
}

$("#clear_all").click(function () {
    clearAll()
})

function update() {
    if (shiftPressed) {
        $("#cube_delete_icon").show();
    } else {
        $("#cube_delete_icon").hide();
    }
}

function printMap3D(){
  for(i = 0; i < map3d.length; i++){
    for(j = 0; j < map3d[i].length; j++){
      console.log(map3d[i][j])
    }
  }
}

setInterval(update, 1);
