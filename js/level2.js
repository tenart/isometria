function level2(geometry, material) {
    //****Game****//
    var array = new Array();
    array.push(new THREE.Vector3(0, 0, 0));
//    array.push(new THREE.Vector3(0, 0, 1));
//    array.push(new THREE.Vector3(-1, 0, 0));
//    array.push(new THREE.Vector3(1, 0, 1));
//    array.push(new THREE.Vector3(1, 0, 0));
//    array.push(new THREE.Vector3(0, 0, -1));
//    array.push(new THREE.Vector3(1, 0, -1));
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
