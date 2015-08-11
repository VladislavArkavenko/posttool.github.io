require('./main.css');

var scenery = require('./img');
var soundtrack = require('./mus');

$(document).on('ready', function () {
  var canvas = document.getElementById('menu_canvas');
  var ctx = canvas.getContext('2d');
  var scene = scenery(ctx);
  scene.animate();

  var playing = false;
  var sound = soundtrack({
    part: localStorage.getItem('part'),
    interval: function (m) {
      if (m % 4 == 0)
        scene.move();
    }
  });

  function update(p) {
    if (p != null) {
      p = sound.setPart(p);
      localStorage.setItem('part', p);
    } else {
      p = sound.part();
    }
    scene.camera.position.z = 1000 + p * 300;
    $('#la').text(p);
  }

  function is_audio_playing() {
    return playing;
  }

  $(document).on('click', function () {
    update(sound.part() + 1);
  });

  $(window).on('keydown', function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    switch (code) {
      case 38:
      case 39:
        update(sound.part() + 1);
        return false;
      case 37:
      case 40:
        update(sound.part() - 1);
        return false;
      case 32:
        if (is_audio_playing()) {
          $('#fa').show();
          playing = false;
          sound.pause();
        }
        else {
          $('#fa').hide();
          playing = true;
          sound.play();
        }
        return false;
    }
  });

  $(window).on('focus', function () {
    if (playing)
      sound.play();
  });

  $(window).on('blur', function () {
    sound.pause();
  });


  $(window).on('resize', resizeCanvas, false);
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  update();
  scene.move();
});

