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
var cubeColor1 = "#F24C3D"; //right
var cubeColor2 = "#F24C3D"; //left
var cubeColor3 = "#588d6d"; //top
var cubeColor4 = "#292828"; //bottom
var cubeColor5 = "#021373"; //front
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

    scene.background = new THREE.Color(0x8FBCD4);
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
    sceneGame.position.set(50, 0, 0);
    sceneBuilder.position.set(100, 0, 0);
}

//creates camera
function createCamera() {
    // set up the options for a perspective camera
    const fov = 35; // fov = Field Of View
    const aspect = container.clientWidth / container.clientHeight;

    const near = 0.1;
    const far = 100;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // every object is initially created at ( 0, 0, 0 )
    // we'll move the camera back a bit so that we can view the scene
    camera.position.set(0, 0, 10);
}

//world rotation controls
function createControls() {
    controls = new THREE.ObjectControls(camera, container, sceneGame);
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
//     renderer.setPixelRatio(window.devicePixelRatio);

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

//pauses the game
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
    switch (currentScene) {
        case "sceneMenuMain":
            pos = sceneMenuMain;
            break;
        case "sceneGame":
            pos = sceneGame;
            break;
        case "sceneBuilder":
            pos = sceneBuilder;
            break;
    }
    camera.position.set(pos.position.x, pos.position.y, pos.position.z + 10);
}

//changes the level
function switchLevel(level) {
    if (level == currentLevel) {
        return;
    }
    while (sceneGame.children.length > 1) {
        if (sceneGame.children[0].type == "Mesh") {
            sceneGame.remove(sceneGame.children[0]);
            objects.splice(0, 1);
        }
    }
    switch (level) {
        case "level1":
            level1(geometry, material);
            break;
        case "level2":
            level2(geometry, material);
            break;
        default:
            console.log("Level '" + level + "' not found!");
            level = currentLevel;
            break;
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
    //    chaPos.x = (chaPos.x / window.innerWidth)  - 1;
    //    chaPos.y = -(chaPos.y / window.innerHeight)  + 1;
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
        var j = 0;
        //change groundColor to correct face color
        switch (intersects[i].faceIndex) {
            case 0:
            case 1: //right
                groundColor = cubeColor1;
                break;
            case 2:
            case 3: //left
                groundColor = cubeColor2;
                break;
            case 4:
            case 5: //top
                groundColor = cubeColor3;
                break;
            case 6:
            case 7: //bottom
                groundColor = cubeColor4;
                break;
            case 8:
            case 9: //front
                groundColor = cubeColor5;
                break;
            case 10:
            case 11: //back
                groundColor = cubeColor6;
                break;
        }
        floorBlock = relFacePos(cha.position, intersects[i]);
    }
    cha.position.set(cal.x, cal.y, cal.z);
    return groundColor;
}

//gets relative position from cube face
//used for character movement
function relFacePos(chapos, intersect) {
    var j = 0;
    var pos = chapos.clone();
    var position = intersect.object.position;

    switch (intersect.faceIndex) {
        case 0:
        case 1: //right
            xyz = "x";
            j += 0.5;
            break;
        case 2:
        case 3: //left
            xyz = "x";
            j -= 0.5;
            break;
        case 4:
        case 5: //top
            xyz = "y";
            j += 0.5;
            break;
        case 6:
        case 7: //bottom
            xyz = "y";
            j -= 0.5;
            break;
        case 8:
        case 9: //front
            xyz = "z";
            j += 0.5;
            break;
        case 10:
        case 11: //back
            xyz = "z";
            j -= 0.5;
            break;
    }

    //switch for updating x/y/z
    switch (xyz) {
        case "x":
            pos.x = position.x + j;
            break;
        case "y":
            pos.y = position.y + j;
            break;
        case "z":
            pos.z = position.z + j;
            break;
    }

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
            //move char right
            pan(moveSpeed, 0);
            break;
        case 83: //s
            //move char down
            pan(0, -moveSpeed);
            break;
        case 65: //a
            //move char left
            pan(-moveSpeed, 0);
            break;
        case 87: //w
            //move char up
            pan(0, moveSpeed);
            break;
        case 39: //right
            //rotate game right
            sceneGame.rotation.y -= Math.PI / 4;
            break;
        case 40: //down
            //rotate game down
            sceneGame.rotation.x += Math.PI / 4;
            break;
        case 37: //left
            //rotate game left
            sceneGame.rotation.y += Math.PI / 4;
            break;
        case 38: //up
            //rotate game up
            sceneGame.rotation.x -= Math.PI / 4;
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

    switch ($("input[name='face']:checked").val()) {
        case "cubeColor1":
            currentColor = cubeColor1;
            break;
        case "cubeColor2":
            currentColor = cubeColor2;
            break;
        case "cubeColor3":
            currentColor = cubeColor3;
            break;
        case "cubeColor4":
            currentColor = cubeColor4;
            break;
        case "cubeColor5":
            currentColor = cubeColor5;
            break;
        case "cubeColor6":
            currentColor = cubeColor6;
            break;
    }
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
