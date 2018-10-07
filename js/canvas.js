PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

var app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio,
    backgroundColor: 0x1099bb,
    view: myView,
    transparent: false
});

//$("body").prepend(app.view);

var container = new PIXI.Container();
container.backgroundColor = 0xff0000;
container.pivot.set(0.5,0.5);
app.stage.addChild(container);

var playerSprite = new PIXI.Sprite(PIXI.Texture.fromImage('../img/person.gif'))
playerSprite.anchor.set(0.5,1);
playerSprite.zIndex = 9;

