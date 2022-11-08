var debug = false;

$(document).ready(function() {
  $('#advance-toggle').click(function() {
    $('#advance-setting-list').toggle();
  });
  
  add_event_listener("s-debug");
  add_event_listener("s-eff-limit");
  add_event_listener("s-def-lgth");
  add_event_listener("s-sq-size");
  add_event_listener("s-upd-sec");
  add_event_listener("s-eat-part");
  add_event_listener("s-food-val");
  add_event_listener("s-food-upd");
  add_event_listener("s-resolution");
  
  $("#s-eff-limit-b").click(function () {
    efficiency_limit = fix_value($('#s-eff-limit-v').val());
  });
  $("#s-def-lgth-b").click(function () {
    default_length = fix_value($('#s-def-lgth-v').val());
  });
  $("#s-sq-size-b").click(function () {
    change_resolution(WIDTH, HEIGHT);
    snake_size = fix_value($('#s-sq-size-v').val());
  });
  $("#s-upd-sec-b").click(function () {
    updates_per_sec =fix_value( $('#s-upd-sec-v').val());
  });
  $("#s-eat-part-b").click(function () {
    eatable_part = fix_value($('#s-eat-part-v').val());
  });
  $("#s-food-val-b").click(function () {
    food_value = fix_value($('#s-food-val-v').val());
  });
  $("#s-food-upd-b").click(function () {
    food_per_update = fix_value($('#s-food-upd-v').val());
  });
  $('#s-resolution-b').click(function() {
    change_resolution(
            fix_value(  $('#s-resolution-v-w').val()  ),
            fix_value( $('#s-resolution-v-h').val() )   
                    );
  });
  $('#s-debug-b').click(function() {
    $('#debug').toggle();
    debug = !debug;
  });
  $('#s-resolution-b-max').click(function() {
    var tmp_width = $('body').width() - 10;
    var tmp_height = $('body').height() - 10;
    
    //set inputs :
    $('#s-resolution-v-h').val(tmp_height);
    $('#s-resolution-v-w').val(tmp_width);
    change_resolution(
            fix_value(  $('#s-resolution-v-w').val()  ),
            fix_value( $('#s-resolution-v-h').val() )   
                    );
  });
});

function add_event_listener(id) {
  id = "#" + id;
  
  $(id).mouseenter(function() {
    $(id + "-d").show();
    $('#s-default').hide();
  }).mouseleave(function() {
    $(id + "-d").hide();
    $('#s-default').show();  
  });
}

//removes quote marks
function fix_value(value) {  
  return parseFloat(value);
}

function button_enabled(state) {
  $('input[type=button]').prop("disabled", !state);
}

function length_fix(length, square_size) {
  if (length % square_size > 0) {
    length -= length % square_size;
  } 
  return length;
}

function change_resolution(width, height) {
  //round values to match resolution :
  width = length_fix(width, snake_size);
  height = length_fix(height, snake_size);
  
  $('.main').css('height', height).css('width', width).css('margin-left', width/2*-1);
  canvas.width = width;
  canvas.height = height;
  WIDTH = width;
  HEIGHT = height;
  reset();
}