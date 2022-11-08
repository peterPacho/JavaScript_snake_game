$(document).ready(function() {
  anim('#loading-screen', '#play-screen');
  init();
  
  $('#play').click(function() {
    anim("#play-screen", "#players-screen");
  });
  
  // game start :
  $('#one').click(function() {
    $('#li-player-two').hide();
    two_players = false;;
    anim('#players-screen', '#controls-screen');
  });
  $('#two').click(function() {
    $('#li-player-two').show();
    two_players = true;
    anim('#players-screen', '#controls-screen');
  });
  
  $('#game-play-again').click(function() {
    $('#game-end').hide();
    reset();
    main();
  });
  
  $('#game-main').click(function() {
    $('#game-end').hide();
    anim('#game-container', '#play-screen');
  });
  
  //color chooser :
  $('.color-choose').click(function() {
    
  });
  
  //finally : 
  $('#game-starter').click(function() {
    reset();
    main();
    anim('#controls-screen', '#game-container');
  });
});

function anim(from, to) {
  $(from).fadeOut(200, function() {
    $(to).fadeIn(200);
  });
}