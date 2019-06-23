/*******************************
 *******************************
 ***      isometria.js       ***
 ***                         ***
 ***  Authors: Jordan Wells  ***
 ***           Tom Nguyen    ***
 ***                         ***
 ***  Date:    2019          ***
 ***                         ***
 *******************************
 ******************************/


//***************************
//**** Global Variables *****
//***************************
let container;
let camera;
let controls;
let controls2;
let renderer;
let scene;
let builderCube1;
let cha;
let delta1;
let sceneMenuMain;
let sceneGame;
let sceneBuilder;
let currentScene;
let currentLevel;
let raycaster;
let mouse;
let xyz;
let geometry;
let material;
let rollOverMesh;
var paused = false;
var objects = [];
var ctrlPressed = false;
var characterColor = "#F29E38";
var cubeColor1 = "#e01d55"; //right
var cubeColor2 = "#e01d55"; //left
var cubeColor3 = "#04ddec"; //top
var cubeColor4 = "#674bee"; //bottom
var cubeColor5 = "#f7cc63"; //front
var cubeColor6 = "#CBDEDC"; //back
var currentColor = cubeColor3;
var floorBlock = new THREE.Vector3();
var moveSpeed = 100;

//***************************
//******* Game Setup ********
//***************************

//initialization
function init() {

    // Get a reference to the container element that will hold our scene
    container = document.querySelector('#scene-container');

    // create a Scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x223254);
    currentScene = "sceneMenuMain";
    //    currentLevel = "level1";
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    createCamera();
    createLights();
    createMeshes();
    createSceneCoords();
    createControls();
    createRenderer();

    delta1 = new THREE.Vector3();

    renderer.setAnimationLoop(() => {

        update();
        render();

    });

}

//sets coords of scenes to fake their separation
function createSceneCoords() {
    sceneMenuMain.position.set(0, 0, 0);
    sceneGame.position.set(350, 0, 0);
    sceneBuilder.position.set(-350, 0, 0);
}

//creates camera
function createCamera() {
    // set up the options for a perspective camera
    const fov = 35; // fov = Field Of View
    const aspect = container.clientWidth / container.clientHeight;

    const near = 0.1;
    const far = 200;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // every object is initially created at ( 0, 0, 0 )
    // we'll move the camera back a bit so that we can view the scene
    camera.position.set(0, 0, 10);
}

//world rotation controls
function createControls() {
    controls = new THREE.ObjectControls(camera, container, sceneGame);
    controls.setDistance(5,100);
}

//creates lights
function createLights() {
    // Create a directional light
    const light = new THREE.DirectionalLight(0xffffff, 3.0);
    // move the light back and up a bit
    light.position.set(1, 1, 1);
    // remember to add the light to the scene
    scene.add(light);
}

//creates geometries
function createGeometries() {
    const cube = new THREE.BoxGeometry(1, 1, 1);
    //    for (var i = 0; i < cube.faces.length; i++) {
    //        cube.faces[i].color.setHex(Math.random() * 0xffffffff);
    //    }

    const charbod = new THREE.CylinderBufferGeometry(.25, .25, .5);

    const rollOver = new THREE.BoxBufferGeometry(1, 1, 1);

    return {
        cube,
        charbod,
        rollOver,
    };
}

//creates materials
function createMaterials() {
    const cube = [
        new THREE.MeshBasicMaterial({
            color: cubeColor1,
            vertexColors: THREE.FaceColors
        }),
        new THREE.MeshBasicMaterial({
            color: cubeColor2,
            vertexColors: THREE.FaceColors
        }),
        new THREE.MeshBasicMaterial({
            color: cubeColor3,
            vertexColors: THREE.FaceColors
        }),
        new THREE.MeshBasicMaterial({
            color: cubeColor4,
            vertexColors: THREE.FaceColors
        }),
        new THREE.MeshBasicMaterial({
            color: cubeColor5,
            vertexColors: THREE.FaceColors
        }),
        new THREE.MeshBasicMaterial({
            color: cubeColor6,
            vertexColors: THREE.FaceColors
        })
    ];


    //    const char = new THREE.MeshBasicMaterial({
    //        color: characterColor
    //    });
    var spriteMap = new THREE.TextureLoader().load("img/character.png");
    const char = new THREE.SpriteMaterial({
        map: spriteMap,
        color: 0xffffff
    });

    const rollOver = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.5,
        transparent: true
    });

    return {
        cube,
        char,
        rollOver,
    }
}

//creates meshes
function createMeshes() {
    geometry = createGeometries();
    material = createMaterials();

    //****Main Menu****//
    sceneMenuMain = new THREE.Group();
    scene.add(sceneMenuMain);

    var menuMainCube1 = new THREE.Mesh(geometry.cube, material.cube);
    menuMainCube1.position.set(sceneMenuMain.position.x, sceneMenuMain.position.y, sceneMenuMain.position.z);
    sceneMenuMain.add(menuMainCube1);
    objects.push(menuMainCube1);

    //****Game****//
    sceneGame = new THREE.Group();
    scene.add(sceneGame);
    cha = new THREE.Sprite(material.char);
    cha.center = new THREE.Vector2(0.5, 0);

    loadLevel();

    //****Builder****//
    sceneBuilder = new THREE.Group();
    scene.add(sceneBuilder);
    builder(geometry, material);
}

//creates the renderer
function createRenderer() {

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.setPixelRatio(1);

    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;

    container.appendChild(renderer.domElement);

}

//updates every frame
function update() {
    //show/hide menus
    if (currentScene == "sceneMenuMain") {
        $("#menuMain").css("visibility", "visible");
        $("#menuPause").css("visibility", "hidden");
        paused = false;
    } else {
        $("#menuMain").css("visibility", "hidden");
    }

    //rotate cube on main menu
    sceneMenuMain.rotation.x += 0.01;
    sceneMenuMain.rotation.y += 0.01;


    //****Debugger****
    if ($("input[name='debug']")[0].checked == true) {
        $("#debugA").html(
            "RotX: " + (sceneGame.rotation.x * (180 / Math.PI)).toFixed(3) +
            "<br>" +
            "RotY: " + (sceneGame.rotation.y * (180 / Math.PI)).toFixed(3) +
            "<br>" +
            "<br>" +
            "CharX: " + (cha.position.x).toFixed(3) +
            "<br>" +
            "CharY: " + (cha.position.y).toFixed(3) +
            "<br>" +
            "CharZ: " + (cha.position.z).toFixed(3) +
            "<br>" +
            "<br>" +
            "Char^X: " + (cha.position.x - delta1.x).toFixed(3) +
            "<br>" +
            "Char^Y: " + (cha.position.y - delta1.y).toFixed(3) +
            "<br>" +
            "Char^Z: " + (cha.position.z - delta1.z).toFixed(3));
    } else {
        $("#debugA").html("");
    }
}

//renders every frame
function render() {
    renderer.render(scene, camera);
}

//handles window resizing
function onWindowResize() {

    // set the aspect ratio to match the new browser window aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;

    // update the camera's frustum
    camera.updateProjectionMatrix();

    // update the size of the renderer AND the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);

}

window.addEventListener('resize', onWindowResize);

//pauses/resumes the game
function pauseGame() {
    if (paused) {
        paused = false;
        $("#menuPause").css("visibility", "hidden");
    } else {
        switch (currentScene) {
            case "sceneGame":
            case "sceneBuilder":
                paused = true;
                $("#menuPause").css("visibility", "visible");
                break;
        }
    }
}

//changes the scene
function switchScene(scene) {
    currentScene = scene;
    var pos = new THREE.Object3D();
    pos = eval(currentScene);
    if (scene == "sceneMenuMain") {
        camera.position.set(pos.position.x, pos.position.y, pos.position.z + 10);
    } else {
        camera.position.set(pos.position.x, pos.position.y, pos.position.z + 20);
    }
}

//changes the level
function switchLevel(level) {
    //don't try to change the level if we don't need to
    if (level == currentLevel) {
        return;
    }
    //unload level by removing blocks
    while (sceneGame.children.length > 1) {
        if (sceneGame.children[0].type == "Mesh") {
            sceneGame.remove(sceneGame.children[0]);
            for (var k = 0; k < objects.length; k++) {
                if (objects[k] === sceneGame.children[0]) {
                    objects.splice(k,1);
                }
            }
        }
    }
    
    //switch on level
    for (var i = 0; i < levels.length; i++) {
        try {
            createLevel(eval(level),geometry,material);
        } catch (e) {
            console.log("Level '" + level + "' not found!");
            level = currentLevel;
        }
    }
    currentLevel = level;
}

//TODO
//saves level
function saveLevel() {
    if (currentScene == "sceneBuilder") {
        //children[1] is always the red hover box
        for (var i = 0; i < sceneBuilder.children.length; i++) {
            console.log("{" + sceneBuilder.children[i].position.x + ", " + sceneBuilder.children[i].position.y + ", " + sceneBuilder.children[i].position.z + "}");
        }
        var level = $('input[name="currentLevel"]').val();
    }
    writeStuff();
}

function writeStuff() {
    var fh = fopen("test.js");
    if (fh!=-1) {
        var str = "here's some text boi";
        fwrite(fh,str);
    }
    fclose(fh);
}

//loads level
function loadLevel() {
    var level = $('input[name="currentLevel"]').val();
    switchLevel(level);
}


//***************************
//****** Gut functions ******
//***************************

//Get x/y on-screen of 3D obj
function toScreenPosition(obj, camera) {
    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * renderer.context.canvas.width;
    var heightHalf = 0.5 * renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };

};

//checks the color under the character
function checkColor(v) {
    //****Get object under character****//
    //cal is reset variable
    var cal = cha.position.clone();
    cha.position.copy(v);

    //get screen-relative position
    var chaPos = toScreenPosition(cha, camera);
    chaPos.x = (chaPos.x / window.innerWidth) * 2 - 1;
    chaPos.y = -(chaPos.y / window.innerHeight) * 2 + 1;

    var groundColor;
    floorBlock = cha.position.clone();

    raycaster.setFromCamera(chaPos, camera);
    var intersects = raycaster.intersectObjects(objects);
    var fem;
    var i;
    for (var k = 0; k < intersects.length; k++) {
        if (fem != null) {
            if (intersects[k].faceIndex < 12 && intersects[k].distance < fem.distance) {
                i = k;
            }
        } else {
            if (intersects[k].faceIndex < 12) {
                fem = intersects[k];
                i = k;
            }
        }
    }
    if (typeof i !== "undefined" && intersects[i].faceIndex < 12) {
//        console.log(intersects[i].point);
        var j = 0;
        //change groundColor to correct face color
        groundColor = eval("cubeColor" + (Math.floor(intersects[i].faceIndex/2) + 1));
        floorBlock = relFacePos(cha.position, intersects[i]);
    }
    cha.position.set(cal.x, cal.y, cal.z);
    return groundColor;
}

//gets relative position from cube face
//used for character movement
function relFacePos(chapos, intersect) {
    var j = -0.5;
    var pos = chapos.clone();
    var position = intersect.object.position;
    
    var vec = new THREE.Vector3();
    vec.setFromMatrixPosition(intersect.object.matrixWorld);
//    var quat = new THREE.Quaternion();
//    quat.copy(sceneGame.quaternion);
//    var q = intersect.point;
//    q.applyQuaternion(quat.inverse());
    
    console.log(vec);
//    console.log(intersect.object.position);
//    console.log(q);
//    console.log(intersect.point);
    
//    var position = intersect.point;
//    position.x -= 50;

    switch (Math.floor(intersect.faceIndex/2)) {
        case 0:
            j += 1;
        case 1:
            xyz = "x";
            break;
        case 2:
            j += 1;
        case 3:
            xyz = "y";
            break;
        case 4:
            j += 1;
        case 5:
            xyz = "z";
            break;
    }

    //switch for updating x/y/z
    pos[xyz] = eval("position."+xyz)+j;
    
    //ensures pos is never more than 1 block from intersect
    if (Math.abs(position.x - pos.x) > 1) {
        pos.x = position.x;
    }
    if (Math.abs(position.y - pos.y) > 1) {
        pos.y = position.y;
    }
    if (Math.abs(position.z - pos.z) > 1) {
        pos.z = position.z;
    }

    return pos;
}

//handles character movement
// deltaX and deltaY are in pixels; right and down are positive
function pan(deltaX, deltaY) {
    if (paused || currentScene != "sceneGame")
        return;

    var element = $("body")[0];

    scene.updateMatrixWorld();
    var quat = new THREE.Quaternion();
    quat.copy(sceneGame.quaternion);

    var position = new THREE.Vector3();
    position.copy(cha.position);

    position.applyQuaternion(quat);

    position.x += deltaX / element.clientHeight;
    position.y += deltaY / element.clientHeight;

    position.applyQuaternion(quat.inverse());

    if (currentColor == checkColor(position)) {
        cha.position.copy(position);

        //ensure character is on the block
        cha.position.x = floorBlock.x;
        cha.position.y = floorBlock.y;
        cha.position.z = floorBlock.z;
    }
};

function moveUp() {
    pan(0, moveSpeed);
}

function moveDown() {
    pan(0, -moveSpeed);
}
function moveLeft() {
    pan(-moveSpeed, 0);
}
function moveRight() {
    pan(moveSpeed, 0);
}
function rotateUp() {
    if (currentScene != "sceneMenuMain") {
        var scene = eval(currentScene);
        if (((scene.rotation.x - (Math.PI / 4)) * (180 / Math.PI).toFixed(3)) > -90) {
            scene.rotation.x -= Math.PI / 4;
        }
        else {
            scene.rotation.x = (-90 * Math.PI/180);
        }
    }
}
function rotateDown() {
    if (currentScene != "sceneMenuMain") {
        var scene = eval(currentScene);
        if (((scene.rotation.x + (Math.PI / 4)) * (180 / Math.PI).toFixed(3)) < 90) {
            scene.rotation.x += Math.PI / 4;
        }
        else {
            scene.rotation.x = 90 * Math.PI/180;
        }
    }
}
function rotateLeft() {
    if (currentScene != "sceneMenuMain") {
        var scene = eval(currentScene);
        scene.rotation.y -= Math.PI / 4;
    }
}
function rotateRight() {
    if (currentScene != "sceneMenuMain") {
        var scene = eval(currentScene);
        scene.rotation.y += Math.PI / 4;
    }
}


//***************************
//********* Events **********
//***************************

//on mouse move
function onMouseMove(e) {
    //set mouse coords to grid
    //center of screen is 0,0
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    //handles mouse hover cube selector in builder
    if (!paused && currentScene == "sceneBuilder") {
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(objects);
        if (intersects.length > 0) {
            var intersect = intersects[0];
            if (intersect.object.name != "rollOverMesh") {
                if (ctrlPressed) {
                    rollOverMesh.position.copy(intersect.object.position);
                } else {
                    rollOverMesh.position.copy(intersect.object.position).add(intersect.face.normal);
                }
            }
        }
    }
}

//when a key is pressed
function keyPress(ev) {
    //ensure player is not in main menu
    if (currentScene != "sceneGame" && currentScene != "sceneBuilder") {
        return;
    }
    var keyCode = event.keyCode;

    delta1.copy(cha.position);

    //game controls
    switch (keyCode) {
        case 68: //d
            moveRight();
            break;
        case 83: //s
            moveDown();
            break;
        case 65: //a
            moveLeft();
            break;
        case 87: //w
            moveUp();
            break;
        case 39: //right
            rotateRight();
            break;
        case 40: //down
            rotateDown();
            break;
        case 37: //left
            rotateLeft();
            break;
        case 38: //up
            rotateUp();
            break;
        case 27: //esc
            pauseGame();
            break;
        case 17: //ctrl
            ctrlPressed = true;
            break;
    }
}

//on key up event
function keyUp(e) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 17:
            ctrlPressed = false;
            break;
    }

}



//***************************
//********** Misc ***********
//***************************

//handles the menu in the top left
function radioButtons() {
    var selectedScene = $("input[name='scene']:checked").val();
    if (currentScene != selectedScene) {
        currentScene = selectedScene;
        switchScene(currentScene);
    }

    currentColor = eval($("input[name='face']:checked").val());
}

//handles block placement/removal in builder
function builderfunc(e) {
    if (paused || currentScene != "sceneBuilder") {
        return;
    }

    //****Get object under mouse****//
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        var i = 0;
        try {
            do {
                var intersect = intersects[i];
                i++;
            } while (intersect.object.name == "rollOverMesh");
            if (e.ctrlKey) {
                removeCube(intersect);
            } else {
                addCube(intersect);
            }
        } catch (e) {
            //Catch Statement
        }
    }
}



//***************************
//********** Run ************
//***************************

$("input[type='radio']").click(radioButtons);

document.addEventListener("keydown", keyPress);
document.addEventListener("keyup", keyUp);
document.addEventListener("mousedown", builderfunc);
window.addEventListener("mousemove", onMouseMove, false);

// call the init function to set everything up
init();
