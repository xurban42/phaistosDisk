goog.provide('disk.main');

goog.require('goog.dom');
goog.require('goog.Timer');
goog.require('goog.style');
goog.require('goog.events');
goog.require('disk.templates');

/** 
 * @constructor
 */
disk.Main = function() {

  var diskDiv = goog.dom.getElement('disk');

  var sideA = goog.dom.getElement('side-a');
  sideA.innerHTML = disk.templates.sideA({'debug': goog.DEBUG});

  var sideB = goog.dom.getElement('side-b');
  sideB.innerHTML = disk.templates.sideB({'debug': goog.DEBUG});

  // BUTTONS
  var colorBtn = goog.dom.getElement('color-button');
  var bothBtn = goog.dom.getElement('both-button');
  var bwBtn = goog.dom.getElement('bw-button');

  var textBtn = goog.dom.getElement('text-button');
  var playBtnA = goog.dom.getElement('play-buttonA');
  var playBtnB = goog.dom.getElement('play-buttonB');

  var animation = new disk.Animation();

  goog.events.listen(colorBtn, goog.events.EventType.CLICK,
      function() {
        goog.dom.classes.remove(bothBtn, 'active');
        goog.dom.classes.remove(bwBtn, 'active');
        goog.dom.classes.add(colorBtn, 'active');

        goog.dom.classes.addRemove(diskDiv, ['both-disk', 'bw-disk'], 'color-disk');
      });

  goog.events.listen(bothBtn, goog.events.EventType.CLICK,
      function() {
        goog.dom.classes.remove(colorBtn, 'active');
        goog.dom.classes.remove(bwBtn, 'active');
        goog.dom.classes.add(bothBtn, 'active');

        goog.dom.classes.addRemove(diskDiv, ['color-disk', 'bw-disk'], 'both-disk');
      });

  goog.events.listen(bwBtn, goog.events.EventType.CLICK,
      function() {
        goog.dom.classes.remove(bothBtn, 'active');
        goog.dom.classes.remove(colorBtn, 'active');
        goog.dom.classes.add(bwBtn, 'active');

        goog.dom.classes.addRemove(diskDiv, ['both-disk', 'color-disk'], 'bw-disk');
      });

    goog.events.listen(textBtn, goog.events.EventType.CLICK,
      function() {
        goog.dom.classes.toggle(textBtn, 'active');

        goog.dom.classes.toggle(diskDiv, 'text-enabled');
      });

    goog.events.listen(playBtnA, goog.events.EventType.CLICK, 
      function(e) {
        animation.stopB();
        if (!goog.dom.classes.has(e.target, 'playing')) {
          animation.startA();
        } else {
          animation.stopA();
        }
      });

     goog.events.listen(playBtnB, goog.events.EventType.CLICK, 
      function(e) {
        animation.stopA();
        if (!goog.dom.classes.has(e.target, 'playing')) { 
          animation.startB();
        } else {
          animation.stopB();
        }
      });
   
    window.onload = function() {
      var mapA = new disk.ImageMap('diskmapA', 1145);
      mapA.resize();
      var mapB = new disk.ImageMap('diskmapB', 800);
      mapB.resize();
    }

    var areasA = goog.dom.getElementsByTagNameAndClass('area', undefined, 
        goog.dom.getElement('diskmapA'));
    var lenA = areasA['length'];
    for (var ai=1; ai<=lenA; ai++) {

      // SIDE A
      goog.events.listen(goog.dom.getElement('areaA'+ai), goog.events.EventType.MOUSEOVER, 
      function(e) {
        var num = e.target.id.slice(5);
        goog.dom.classes.add(goog.dom.getElement('textA'+num), 'texthover');
      });

      goog.events.listen(goog.dom.getElement('areaA'+ai), goog.events.EventType.MOUSEOUT, 
      function(e) {
        var num = e.target.id.slice(5);
        goog.dom.classes.remove(goog.dom.getElement('textA'+num), 'texthover');
      });

      goog.events.listen(goog.dom.getElement('areaA'+ai), goog.events.EventType.CLICK, 
      function(e) {
        animation.stopA();
        animation.stopB();

        var num = e.target.id.slice(5);
        disk.playSound('sideA/'+num);
      });
    }

    var areasB = goog.dom.getElementsByTagNameAndClass('area', undefined, 
        goog.dom.getElement('diskmapB'));
    var lenB = areasB['length'];
    for (var bi=1; bi<=lenB; bi++) {
      // SIDE B
      goog.events.listen(goog.dom.getElement('areaB'+bi), goog.events.EventType.MOUSEOVER, 
      function(e) {
        var num = e.target.id.slice(5);
        goog.dom.classes.add(goog.dom.getElement('textB'+num), 'texthover');
      });

      goog.events.listen(goog.dom.getElement('areaB'+bi), goog.events.EventType.MOUSEOUT, 
      function(e) {
        var num = e.target.id.slice(5);
        goog.dom.classes.remove(goog.dom.getElement('textB'+num), 'texthover');
      });

      goog.events.listen(goog.dom.getElement('areaB'+bi), goog.events.EventType.CLICK, 
      function(e) {
        animation.stopA();
        animation.stopB();

        var num = e.target.id.slice(5);
        disk.playSound('sideB/'+num);
      });
    }
}

/** 
 * @constructor
 * @param {string} map Map element id.
 * @param {number} width Original image width.
 */
disk.ImageMap = function (map, width) {
  var mapEl = goog.dom.getElement(map);
  this.name = map;
  var n,
      areas = mapEl.getElementsByTagName('area'),
      len = areas.length,
      coords = [],
      previousWidth = width, 
      imgElement = goog.dom.getElement(map+'img');

  for (n = 0; n < len; n++) {
      coords[n] = areas[n].coords.split(',');
  }
  this.resize = function () {
      var n, m, clen,
          x = goog.style.getSize(imgElement).width / previousWidth;

      for (n = 0; n < len; n++) {
          clen = coords[n].length;
          for (m = 0; m < clen; m++) {
              coords[n][m] *= x;
          }
          areas[n].coords = coords[n].join(',');
      }
      previousWidth = goog.style.getSize(imgElement).width;
      return true;
  };
  window.onresize = this.resize;
};

disk.playSound = function(filename) { 
  if (goog.DEBUG) {
    goog.dom.getElement("sound").innerHTML=
      '<audio id="audioplay"><source src="../www/sound/' + 
      filename + '.mp3" type="audio/mpeg" /><source src="../www/sound/' + 
      filename + '.ogg" type="audio/ogg" />' +
      ' <embed id="embedplay" hidden="true" autostart="true" loop="false" src="../www/sound/' +
       filename +'.mp3" /></audio>';

  } else {
    goog.dom.getElement("sound").innerHTML=
      '<audio id="audioplay"><source src="sound/' + 
      filename + '.mp3" type="audio/mpeg" /><source src="sound/' + 
      filename + '.ogg" type="audio/ogg" />' +
      ' <embed id="embedplay" hidden="true" autostart="true" loop="false" src="sound/' +
       filename +'.mp3" /></audio>';
  }
  var audio = document.getElementById('audioplay');
  audio.play();
};

/**
 * @constructor
 */ 
disk.Animation = function() {
  this.playNextPartA = goog.bind(function() {
    if (this.numA > 0) {
      goog.events.unlisten(goog.dom.getElement('audioplay'), 'ended', this.playNextPartA, false, this);
      goog.events.unlisten(goog.dom.getElement('embedplay'), 'ended', this.playNextPartA, false, this);
      goog.dom.classes.remove(goog.dom.getElement('textA'+this.numA), 'texthover');
    }
    if (this.numA < 31) {
      this.numA++;
      goog.dom.classes.add(goog.dom.getElement('textA'+this.numA), 'texthover');
      disk.playSound('sideA/'+this.numA);
      goog.events.listen(goog.dom.getElement('audioplay'), 'ended', this.playNextPartA, false, this);
      goog.events.listen(goog.dom.getElement('embedplay'), 'ended', this.playNextPartA, false, this);
    } else {
      goog.dom.classes.remove(goog.dom.getElement('play-buttonA'), 'playing');
    }
  }, this);

  this.playNextPartB = goog.bind(function() {
    if (this.numB > 0) {
      goog.events.unlisten(goog.dom.getElement('audioplay'), 'ended', this.playNextPartB, false, this);
      goog.events.unlisten(goog.dom.getElement('embedplay'), 'ended', this.playNextPartB, false, this);
      goog.dom.classes.remove(goog.dom.getElement('textB'+this.numB), 'texthover');
    }
    if (this.numB < 30) {
      this.numB++;
      goog.dom.classes.add(goog.dom.getElement('textB'+this.numB), 'texthover');
      disk.playSound('sideB/'+this.numB);
      goog.events.listen(goog.dom.getElement('audioplay'), 'ended', this.playNextPartB, false, this);
      goog.events.listen(goog.dom.getElement('embedplay'), 'ended', this.playNextPartB, false, this);
    } else {
      goog.dom.classes.remove(goog.dom.getElement('play-buttonB'), 'playing');
    }
  }, this);
}

disk.Animation.prototype.startA = function() {
  this.numA = 0;
  goog.dom.classes.add(goog.dom.getElement('play-buttonA'), 'playing');
  this.playNextPartA();
}

disk.Animation.prototype.startB = function() {
  this.numB = 0;
  goog.dom.classes.add(goog.dom.getElement('play-buttonB'), 'playing');
  this.playNextPartB();
}

disk.Animation.prototype.stopA = function() {
  disk.playSound('no'); 
  goog.dom.classes.remove(goog.dom.getElement('play-buttonA'), 'playing');
  if ((this.numA > 0) && (this.numA <= 31)) {
    goog.dom.classes.remove(goog.dom.getElement('textA'+this.numA), 'texthover');
  }
}

disk.Animation.prototype.stopB = function() {
  disk.playSound('no'); 
  goog.dom.classes.remove(goog.dom.getElement('play-buttonB'), 'playing');
  if ((this.numB > 0) && (this.numB <= 30)) {
    goog.dom.classes.remove(goog.dom.getElement('textB'+this.numB), 'texthover');
  }
  
}

  /*goog.events.listen(this.timer, goog.Timer.TICK, 
  function() {
    this.tickCount++;

    /*switch (this.tickCount) {
      case 1: 
        playNextPart();
        break;
      case 26:
        playNextPart();
        break;
      case 40:
        playNextPart();
        break;
      case 55:
        playNextPart();
        break;
      case 74:// 5
        playNextPart();
        break;
      case 98:
        playNextPart();
        break;
      case 119:
        playNextPart();
        break;
      case 141:
        playNextPart();
        break;
      case 170:
        playNextPart();
        break;
      case 193: //10
        playNextPart();
        break;
      case 217:
        playNextPart();
        break;
      case 241:
        playNextPart();
        break;
      case 267:
        playNextPart();
        break;
      case 282:
        playNextPart();
        break;
      case 313: //15
        playNextPart();
        break;
      case 330:
        playNextPart();
        break;
      case 351:
        playNextPart();
        break;
      case 394:
        playNextPart();
        break;
      case 409:
        playNextPart();
        break;
      case 428: //20
        playNextPart();
        break;
      case 461:
        playNextPart();
        break;
      case 476:
        playNextPart();
        break;
      case 497:
        playNextPart();
        break;
      case 538:
        playNextPart();
        break;
      case 569: // 25
        playNextPart();
        break;
      case 586:
        playNextPart();
        break;
      case 610:
        playNextPart();
        break;
      case 626:
        playNextPart();
        break;
      case 648:
        playNextPart();
        break;
      case 686: // 30
        playNextPart();
        break;
      case 699:
        playNextPart();
        break;
      case 717: //31
        playNextPart();
        goog.dom.classes.toggle(goog.dom.getElement('play-button'),
           'playing');
          break;

    }
  }, false, this);*/

goog.exportSymbol('Main', disk.Main);
