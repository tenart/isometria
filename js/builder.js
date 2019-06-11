var bobjects = new Array();

function builder(geometry, material) {
    var array = new Array();
    array.push(new THREE.Vector3(0, 0, 0));
    for (var i = 0; i < array.length; i++) {
        var cube = new THREE.Mesh(geometry.cube, material.cube);
        cube.position.set(array[i].x, array[i].y, array[i].z);
        sceneBuilder.add(cube);
        objects.push(cube);
        bobjects.push(cube);
    }

    rollOverMesh = new THREE.Mesh(geometry.rollOver, material.rollOver);
    rollOverMesh.name = "rollOverMesh";
    //    rollOverMesh.position.set(0,2,0);
    sceneBuilder.add(rollOverMesh);
    objects.push(rollOverMesh);
}

function addCube(intersect) {
    var voxel = new THREE.Mesh(geometry.cube, material.cube);
    try {
        if (intersect.object.name == "rollOverMesh") {
            voxel.position.copy(intersect.object.position);
        } else {
            voxel.position.copy(intersect.object.position).add(intersect.face.normal);

        }
        sceneBuilder.add(voxel);
        objects.push(voxel);
        bobjects.push(voxel);
    } catch (e) {
        //Catch Statement
    }
}

//function addCubeP(position) {
//    var voxel = new THREE.Mesh(geometry.cube, material.cube);
//    voxel.position.set(position.x,position.y,position.z);
////    voxel.position.copy(intersect.point).add(intersect.face.normal);
//    sceneBuilder.add(voxel);
//    objects.push(voxel);
//}

function removeCube(intersect) {
    if (intersect.object.name == "rollOverMesh") {}
    if (bobjects.length > 1) {
        sceneBuilder.remove(intersect.object);
        objects.splice(objects.indexOf(intersect.object), 1);
        bobjects.splice(bobjects.indexOf(intersect.object), 1);
    } else {
        console.log("Cannot delete last cube");
    }
}

function removeCubeP(position) {
    sceneBuilder.remove(obj);
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].position == obj.position) {
            objects = objects.splice(i, 1);
        }
    }
}
