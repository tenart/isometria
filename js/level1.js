function level1(geometry, material) {
    //****Game****//
    var array = new Array();
    array.push(new THREE.Vector3(0, 0, 0));
    array.push(new THREE.Vector3(3, 1, 0));
    array.push(new THREE.Vector3(-3, 1, 0));
//    array.push(new THREE.Vector3(1, -1, 1));
    for (var i = 0; i < array.length; i++) {
        var cube = new THREE.Mesh(geometry.cube, material.cube);
        cube.position.set(array[i].x, array[i].y, array[i].z);
        sceneGame.add(cube);
        objects.push(cube);
    }

    //****Character****//
    cha.position.y += 1;
    const bod = new THREE.Mesh(geometry.charbod, material.char);
    bod.position.set(0, -.25, 0);
    cha.add(bod);
    sceneGame.add(cha);
    objects.push(bod);
}
