//some vars - you can play with it :
var efficiency_limit = 80; //make if from 0 to 100 - affect on max number of "food" on screen, low values = more food, higher chance to get slowdowns
var default_length = 40; //start length of snake, too much and browser will stop working
var snake_size = 4; //pix size of one snake rectangle, more = snake is thicker but less space
var updates_per_sec = 30; //number of updates per sec / game speed, make if higher than 0, higher values = higher speed but need more powerful machine
var eatable_part = 0.8; //part of snake which can be eaten by other snake, make if higher than 0 to 1, 1 means you cannont eat anything
var food_value = 4; //how many squares is added to snake after eating one white rect.
var food_per_update = 2; //number of "food" showing up each update, it goes pretty quick so make it low or game performance will be poor


function Box() {} //Box object to hold data for all drawn rects

//Adds new rectangle
function addRect(player, x, y, fill) {
  var rect = new Box;
  rect.x = x;
  rect.y = y;
  rect.w = snake_size;
  rect.h = snake_size;
  rect.fill = fill;
  rect.player = player;
  rect.score = 0;
  
  if (player === 0) { //if player one
    one.push(rect);
    return;
  } 
  if (player === 1) { //if player two
    two.push(rect);
    return;
  }
  if (player === 2) { //if food
    food.push(rect);
    return;
  }
}

//holds all snake info :
var one = []; //player one
var two = []; //player two
var food = []; //holds food info

//some vars, don't change it. Really. They are not usefull
var canvas,ctx; //some vars, because init is function and need some global vars
var WIDTH = 600;
var HEIGHT = 600;
var isplaying = false;
var now, time_fix, update_time;
var keys_fix = [];
var snake_one_direction = 1; //move right
var snake_two_direction = 3; //move left
var update_efficiency;

//ev. vars :
var two_players = true; //number of players
var player_one_color = [2];
var player_two_color = [2];

player_one_color[0] = "red";
player_one_color[1] = "orange";
player_two_color[0] = "blue";
player_two_color[1] = "cyan";

function init() {
  canvas = document.getElementById('canvas');  
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.id = "game";
  ctx = canvas.getContext('2d');

  reset(); //reset game to default state
}

//wipes the canvas context
function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

//redraw canvas
function draw() {
  clear(); //clear canvas
  
  // draw food
  var l = food.length;
  for (var i = 0; i < l; i ++) {
    drawshape(ctx, food[i], food[i].fill);
  }

  // draw snake one :
  var l = one.length;
  for (var i = 0; i < l; i++) {
      drawshape(ctx, one[i], one[i].fill);
  }  

  //draw snake two if apply :
  if (two_players) {
    var l = two.length;
    for (var i = 0; i < l; i++) {
        drawshape(ctx, two[i], two[i].fill);
    }   
  }
}

//draw single shape
function drawshape(context, shape, fill) {
  context.fillStyle = fill;  
  context.fillRect(shape.x,shape.y,shape.w,shape.h);
}

//resets game - place snakes in normal position
function reset() {
  
  one = [];
  two = [];
  food = [];
  
  snake_one_direction = 1; //move right
  snake_two_direction = 3; //move left
  
  var temp_length = default_length;;
  
  if (default_length === 0) temp_length = 1000;
  
  
  //first chunks :
  addRect(0, snake_size, length_fix(HEIGHT/2, snake_size), player_one_color[0]);
  addRect(1, WIDTH-snake_size, length_fix(HEIGHT/2, snake_size), player_two_color[0]);
  //sets rests of snake :
  for (sn = 1; sn < temp_length; sn ++ ) {
    addRect(0, -100, length_fix(HEIGHT/2, snake_size), player_one_color[0]);
    addRect(1, -100, length_fix(HEIGHT/2, snake_size), player_two_color[0]);
  }
  
  one[0].score = 0;
  two[0].score = 0;
  
  //color snakes and make them eatable
  food_calc(one);
  food_calc(two);
  
  isplaying = true;
}


//keyboard control :
var keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
  delete keys_fix[e.keyCode];
}, false);

function update_player(pl) {
  var margin = pl.length; //length of first snake array
  var buffer = [4]; //contain position of last snake element

  buffer[0] = pl[0].x;
  buffer[1] = pl[0].y;

  var snake_direction_temp;
  if (pl[0].player === 0) snake_direction_temp = snake_one_direction;
    else snake_direction_temp = snake_two_direction;

  //update first element (head)
  switch (snake_direction_temp) {
    case 0 : //moving up
      pl[0].y += snake_size;
      break;
    case 1 : //moving right
      pl[0].x += snake_size;
      break;
    case 2 : //moving down
      pl[0].y -= snake_size;
      break;
    case 3 : //moving left
      pl[0].x -= snake_size;
      break;
  }
    

  for (var upd = 1; upd < margin; upd ++ ) {
    //element into buffer :
    buffer[2] = pl[upd].x;
    buffer[3] = pl[upd].y;
    //update element from buffer (position of last element)
    pl[upd].x = buffer[0];
    pl[upd].y = buffer[1];
    //prepare buffer for next update :
    buffer[0] = buffer[2]; //x
    buffer[1] = buffer[3]; //y
  }
}

//updates position of snakes, check for colistions
function update() {
  //hotkeys :
  if (39 in keysDown && !keys_fix[39]) {
    snake_one_direction --;
    if (snake_one_direction < 0) snake_one_direction = 3;
    keys_fix[39] = true;
  }
  if (37 in keysDown && !keys_fix[37]) {
   snake_one_direction ++;
   if (snake_one_direction > 3) snake_one_direction = 0;
   keys_fix[37] = true;
  }
  
  if (two_players) {
    if (68 in keysDown && !keys_fix[68]) { 
      snake_two_direction --;
      if (snake_two_direction < 0) snake_two_direction = 3;
      keys_fix[68] = true;
    }
    if (65 in keysDown && !keys_fix[65]) { 
     snake_two_direction ++;
     if (snake_two_direction > 3) snake_two_direction = 0;
     keys_fix[65] = true;
    }
  }
  
  //snake one :
  update_player(one);
  //snake two if apply
  if (two_players) update_player(two);
  
  colision();
  
  if (update_efficiency > efficiency_limit) food_gen(); //generate food only if efficiency is better than this setted up
  
  food_col(one);
  
  //if endless mode :
  if (default_length === 0) {
    addRect(one[0].player, -100, -100, "black"); //add new black rectangle, color doesn't matter because it will be changed soon
    addRect(two[0].player, -100, -100, "black"); //add new black rectangle, color doesn't matter because it will be changed soon
  }
  
  if (two_players)
    food_col(two);
}

function food_gen() {
  for (something = 0; something < food_per_update; something ++ )
    addRect(2, length_fix(Math.round(rand(0, WIDTH) / snake_size)*snake_size), length_fix(Math.round(rand(0, HEIGHT) / snake_size)*snake_size), "white");
}
function food_col(pl) {
  var l = food.length;
  for (var i = 0; i < l; i ++) {
    if (pl[0].x === food[i].x && pl[0].y === food[i].y) {
      for (something = 0; something < food_value; something ++ ) {
        addRect(pl[0].player, -100, -100, "black"); //add new black rectangle, color doesn't matter because it will be changed soon
      }
      
      food_calc(pl);
      
      pl[0].score ++;
      food.splice(i, 1);
      return;
    }
  }
}
function food_calc(pl) {
  //calculate "eatable" snake part :
  var snake_length = pl.length; //length of snake
  var snake_margin = Math.round(snake_length * eatable_part); //eatable part margin (like half of snake or so)

  for (something = 0; something < snake_margin; something ++) { //from 0 to eatable part - fixing snake
    pl[something].fill = get_color(pl, 0);
  }

  for (something = snake_margin; something < snake_length; something ++) { //from margin to end of snake
    pl[something].fill = get_color(pl, 1);
  }
}

function get_color(pl, number) {
  if (pl[0].player === 0) return player_one_color[number];
  if (pl[0].player === 1) return player_two_color[number];
}



function rand(from, to) {
  return Math.floor(Math.random() * (to - from) + from);
}

function colision_part (pl, pl2) {
  if (pl[0].x < 0) 
    return 1;
  if (pl[0].y < 0) 
    return 1;
  if (pl[0].x > WIDTH) 
    return 1;
  if (pl[0].y > HEIGHT) 
    return 1;
  
  //colision in same snake :
  var mar = pl.length;
  for (cot = 1; cot < mar; cot ++ ) {
    if (pl[0].x === pl[cot].x && pl[0].y === pl[cot].y) {
      return 1;
    }
  }
  
  //colision with other snake :
  if (two_players) {
    var mar_two = pl2.length; //length of second snake
    
    for (cot = 0; cot < mar_two; cot ++) {
      if (pl[0].x === pl2[cot].x && pl[0].y === pl2[cot].y) { //if collision occurs 
        if (pl2[cot].fill === get_color(pl2, 1)) { //if collided with "eatable" part
          
          //add new chunks to snake
          for (oo = cot; oo < mar_two; oo ++) {
            addRect(pl[0].player, -100, -100, "black"); //add new black rectangle, color doesn't matter because it will be changed soon
          }
          
          //make sure new snake is at least 1 chunk long :
          if (cot <= 0) cot ++;
          
          //trim old snake :
          pl2.splice(cot, mar_two - cot);
          
          //adjust scores :
          pl[0].score += mar_two - cot;
          pl2[0].score -= mar_two - cot;
          
          //calculate new color of both snakes :
          food_calc(pl);
          food_calc(pl2);
          
          return 0;
        }
        return 1;
      }
    }
  }
}

function colision() {
  
  if (two_players) {
    if (colision_part(one, two)) stop(2);
    if (colision_part(two, one)) stop(1); 
  } else {
    if (colision_part(one, 0)) stop(0);
  }
}

function stop(player) {
  isplaying = false;
  $('#game-end').fadeIn(1000);
  
  if (!two_players) { //if one player
    $('#game-end-display').html("You get " + one[0].score + " points !");
  } else { //if two players
    if (one[0].x === two[0].x && one[0].y === two[0].y) { //tie/draw
      $('#game-end-display').html("Draw");
    }else {
      if (player === 1) { //if player one won
        $('#game-end-display').html("Player one won !<br/>\n\
                One - " + one[0].score + " points <br/>\n\
                  Two - " + two[0].score + "points");
      } else { //player two won
        $('#game-end-display').html("Player two won !<br/>\n\
                One - " + one[0].score + " points <br/>\n\
                  Two - " + two[0].score + "points");
      }
    }
  }
}


var data_update = 0;
var data_update_rate = 1000 / (1000/updates_per_sec) / 4; //update every 1/8 of second
// The main game loop
function main() {
	now = Date.now(); //date of drawing

	update(); //update canvas
	draw();  //redraw canvas
  
  update_efficiency = Math.round(((1000/updates_per_sec)-update_time)/(1000/updates_per_sec)*100);
  
  if (data_update > data_update_rate) {
    //some info :
    
    if (debug) {
      $('#next').html(time_fix + "ms");
      $('#upd-time').html(update_time + "ms");
      $('#perc-game').html(update_efficiency + "%");
      $('#food-counter').html(food.length);
    }
    data_update = 0;
  }
  
  //set redraw :
  update_time = Date.now() - now;
  time_fix = Math.round(1000/updates_per_sec - (update_time));
  
  data_update ++;
  
  if (isplaying)
  setTimeout(function() {
    main();
  }, time_fix );
};

function sq_size(size) {
  snake_size = size;
}