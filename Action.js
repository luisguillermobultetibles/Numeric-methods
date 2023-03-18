// Game or history action interactivity
import {WebSystemObject} from './WebSystemObject';

export class Action extends WebSystemObject {

  // <-- configure Game controls:
  controls = {
    left: false,
    up: false,
    right: false,
    down: false,
  };

  constructor(start = true, canvas) {
    super();
    // prepaire our game canvas
    if (!canvas) {
      document.write(`<canvas height=400/ id="gameCanvas" width=400></canvas>`);
      this.canvas = document.getElementById('gameCanvas');
    } else {
      this.canvas = canvas;
    }

    this.context = this.canvas.getContext('2d');

    // game settings:
    this.FPS = 30;
    this.INTERVAL = 1000 / this.FPS; // milliseconds
    this.STEP = this.INTERVAL / 1000; // seconds

    // setup an object that represents the room
    this.room = {
      width: 500,
      height: 300,
      map: new Scene(500, 300),
    };

    // generate a large image texture for the room
    this.room.map.generate();

    // setup actor
    this.actor = new Actor(50, 50);

    // Old camera setup. It not works with maps smaller than canvas. Keeping the code deactivated here as reference.
    /* var camera = new Game.Camera(0, 0, canvas.width, canvas.height, room.width, room.height);*/
    /* camera.follow(actor, canvas.width / 2, canvas.height / 2); */

    // Set the right viewport size for the camera
    var vWidth = Math.min(this.room.width, this.canvas.width);
    var vHeight = Math.min(this.room.height, this.canvas.height);

    // Setup the camera
    this.camera = new Canvascam(0, 0, vWidth, vHeight, this.room.width, this.room.height);
    this.camera.follow(this.actor, vWidth / 2, vHeight / 2);

    // Setup the keyboard controls
    let keyboard = new Keyboard([[37, () => {
      Game.controls.left = true;
    }, () => {
      Game.controls.left = false;
    }],
      [38, () => {
        Game.controls.up = true;
      }, () => {
        Game.controls.up = false;
      }],
      [39, () => {
        Game.controls.right = true;
      }, () => {
        Game.controls.right = false;
      }],
      [40, () => {
        Game.controls.down = true;
      }, () => {
        Game.controls.down = false;
      }],
      [80, () => {
        Game.togglePause();
      }, () => {
        Game.togglePause();
      }]]);            // -->

    // Game Loop
    this.gameLoop = () => {
      this.update();
      this.draw();
    };

    this.cronometer = new Clock(this.INTERVAL, this.gameLoop, false);

    if (start) {
      this.start();
    }
  }

  // Game update function
  update() {
    this.actor.update(this.STEP, this.room.width, this.room.height);
    this.camera.update();
  }

  // Game draw function
  draw() {
    // clear the entire canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // redraw all objects
    this.room.map.draw(this.context, this.camera.xView, this.camera.yView);
    this.actor.draw(this.context, this.camera.xView, this.camera.yView);
  }

  // <-- configure play/pause capabilities:

  // Using setInterval instead of requestAnimationFrame for better cross browser support,
  // but it's easy to change to a requestAnimationFrame polyfill.

  start() {
    if (this.cronometer) {
      this.cronometer.active = true;
    }
    console.log('play');
  }

  togglePause() {
    this.cronometer.active = !this.cronometer.active;
    if (this.cronometer.active) {
      console.log('paused');
    } else {
      console.log('playing');
    }
    console.warn(this.cronometer.active);
  }

};

/*

This is the first class and all you need to start to develop games
Just create an .html like this, and run... good luck.


<!DOCTYPE HTML>
<html>
  <script src="Action.js"></script>
  <body>
    <script>
      Game = new Action(true);
    </script>
  </body>
</html>


*/
