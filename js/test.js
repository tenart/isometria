var levels = new Array();

function createLevel(level, geometry, material) {
    cha.position.x = level[0];
    cha.position.y = level[1];
    cha.position.z = level[2];

    for (var i = 3; i < level.length; i += 3) {
        var cube = new THREE.Mesh(geometry.cube, material.cube);
        cube.position.set(level[i], level[i + 1], level[i + 2]);
        sceneGame.add(cube);
        objects.push(cube);
    }
    sceneGame.add(cha);
    objects.push(cha);
}

var level1 = [
    0, 0.5, 0,
    0, 0, 0,
    0, 0, 1,
    -1, 0, 0,
    1, 0, 1,
    1, 0, 0,
    0, 0, -1,
    1, 0, -1,
    0, 0, -3,
    1, 2, -3,
    -1, 0, -2,
    -2, 1, -2,
    -2, 2, -3,
    -1, 0, 1,
    -1, -2, 2,
    -1, 2, 3,
    -1, -2, 3,
    -1, -2, 1,
    0, -2, 2,
    0, -2, 1,
    3, 0, 2,
    2, 1, 3,
    3, 1, 0,
    3, 1, -1,
    4, 1, -1,
    2, 1, -1,
    -4, 1, 0,
    -4, 1, -1,
    -2, -1, 0,
    -3, -1, 0,
    -4, 1, 1,
    -4, 1, 2,
    -5, 1, 1,
    -2, -2, 3,
];
levels.push(level1);

var level2 = [
    0, 0.5, 0,
    0, 0, 0,
    0, 0, 1,
    -1, 0, 0,
    1, 0, 1,
    1, 0, 0,
    0, 0, -1,
    1, 0, -1,
];
levels.push(level2);