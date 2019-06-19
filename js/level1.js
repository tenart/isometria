function level1(geometry, material) {
    //****Game****//
    var array = new Array();
    array.push(new THREE.Vector3(0, 0, 0));
    array.push(new THREE.Vector3(0, 0, 1));
    array.push(new THREE.Vector3(-1, 0, 0));
    array.push(new THREE.Vector3(1, 0, 1));
    array.push(new THREE.Vector3(1, 0, 0));
    array.push(new THREE.Vector3(0, 0, -1));
    array.push(new THREE.Vector3(1, 0, -1));
    array.push(new THREE.Vector3(0, 0, -3));
    array.push(new THREE.Vector3(1, 2, -3));
    array.push(new THREE.Vector3(-1, 0, -2));
    array.push(new THREE.Vector3(-2, 1, -2));
    array.push(new THREE.Vector3(-2, 2, -3));
    array.push(new THREE.Vector3(-1, 0, 1));
    array.push(new THREE.Vector3(-1, -2, 2));
    array.push(new THREE.Vector3(-1, 2, 3));
    array.push(new THREE.Vector3(-1, -2, 3));
    array.push(new THREE.Vector3(-1, -2, 1));
    array.push(new THREE.Vector3(0, -2, 2));
    array.push(new THREE.Vector3(0, -2, 1));
    array.push(new THREE.Vector3(3, 0, 2));
    array.push(new THREE.Vector3(2, 1, 3));
    array.push(new THREE.Vector3(3, 1, 0));
    array.push(new THREE.Vector3(3, 1, -1));
    array.push(new THREE.Vector3(4, 1, -1));
    array.push(new THREE.Vector3(2, 1, -1));
    array.push(new THREE.Vector3(-4, 1, 0));
    array.push(new THREE.Vector3(-4, 1, -1));
    array.push(new THREE.Vector3(-2, -1, 0));
    array.push(new THREE.Vector3(-3, -1, 0));
    array.push(new THREE.Vector3(-4, 1, 1));
    array.push(new THREE.Vector3(-4, 1, 2));
    array.push(new THREE.Vector3(-5, 1, 1));
    array.push(new THREE.Vector3(-2, -2, 3));
    for (var i = 0; i < array.length; i++) {
        var cube = new THREE.Mesh(geometry.cube, material.cube);
        cube.position.set(array[i].x, array[i].y, array[i].z);
        sceneGame.add(cube);
        objects.push(cube);
    }

    //****Character****//
    cha.position.x = 0;
    cha.position.y = 0.5;
    cha.position.z = 0;
    sceneGame.add(cha);
    objects.push(cha);
}
