var scenery = require('./img');
var soundtrack = require('./mus');
require('./main.css');

$(document).on('ready', function () {
  var canvas = document.getElementById('menu_canvas');
  var context = canvas.getContext('2d');
  var scene = scenery(context);
  scene.animate();
  var sound = soundtrack({
    part: localStorage.getItem('part'),
    interval: function (m) {
      if (m % 4 == 0)
        scene.move();
    }
  });

  function update(p) {
    if (p != null) {
      sound.setPart(p);
      p = sound.part();
      localStorage.setItem('part', p);
    } else {
      p = sound.part();
    }
    scene.camera.position.z = 1000 + p * 300;
    $('#la').text(p);
  }

  function is_text_hidden() {
    return $('#fa').css('display') == 'none';
  }

  $(document).on('click', function () {
    update(sound.part() + 1);
  });

  $(window).on('keydown', function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 38 || code == 39) {
      update(sound.part() + 1);
      return false;
    }
    if (code == 37 || code == 40) {
      update(sound.part() - 1);
      return false;
    }
    if (code == 32) {
      if (is_text_hidden()) {
        $('#fa').show();
        sound.pause();
      }
      else {
        $('#fa').hide();
        sound.play();
      }
      return false;
    }
  });

  $(window).on('resize', resizeCanvas, false);
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  //$(window).on('touchstart', function (e) {
  //  e.preventDefault();
  //  Tone.startMobile();
  //});

  resizeCanvas();
  update();
  scene.move();
});

