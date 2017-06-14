var EntityManager = require("tiny-ecs").EntityManager;
var PIXI = require("pixi.js");


function Drawable() {
  this.sprite = null;
}

function Velocity () {
  this.dx = 0;
  this.dy = 0;
}

function makeBunny(entities, stage, x, y) {
  var b = entities.createEntity();
  b.addComponent(Drawable)
    .addComponent(Velocity);

  b.drawable.sprite = PIXI.Sprite.fromImage("https://pixijs.github.io/examples/required/assets/basics/bunny.png");

  b.drawable.sprite.position.x  = x;
  b.drawable.sprite.position.y  = y;

  b.velocity.dx = (Math.random() * 10) - 5;
  b.velocity.dy = (Math.random() * 10) - 5;

  stage.addChild(b.drawable.sprite);

  return b;
}

class MovementSystem {
  constructor(entities) {
    this.entities = entities;
  }

  update(dt) {
    var moveables = this.entities.queryComponents([Drawable, Velocity]);
    moveables.forEach(function(e){
      e.drawable.sprite.position.x += e.velocity.dx;
      e.drawable.sprite.position.y += e.velocity.dy;
    });
  }
};

class BounceSystem {
  constructor(entities) {
    this.entities = entities;
  }

  update(dt) {
    var moveables = this.entities.queryComponents([Drawable, Velocity]);
    moveables.forEach(function(e){
      let x = e.drawable.sprite.position.x;
      let y = e.drawable.sprite.position.y;
      let dx = e.velocity.dx;
      let dy = e.velocity.dy;

      if(x <= 0 || x >= 800) {
        e.velocity.dx = -dx;
      }

      if(y <= 0 || y >= 800) {
        e.velocity.dy = -dy;
      }
    });
  }
};


function init() {
  let renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor:0xFFFFFF});
  let stage = new PIXI.Container(0xFFFFFF);
  const entities = new EntityManager();

  renderer.view.style["transform"] = "translatez(0)";
  renderer.view.style.position = "absolute";
  document.body.appendChild(renderer.view);

  for(var i = 0; i < 50000; i++) {
    var newBunny = makeBunny(entities, stage, Math.random() * 800, Math.random() * 600);
  }

  var lastTime = Date.now();
  var systems = [new BounceSystem(entities),new MovementSystem(entities)];

  function loop() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000;
    systems.forEach(function(s) {
      s.update(dt);
    });
    renderer.render(stage);
    requestAnimationFrame(loop);
  }

  loop();
}

init();
