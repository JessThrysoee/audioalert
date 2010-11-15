/*!
 * HTML5 audio alert library with flash-fallback.
 *
 * Copyright (c) 2010 Jess Thrysoee, http://thrysoee.dk
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

/*global window, Audio, swfobject*/
/*jslint newcap:false*/

var AudioAlert = (function () {

   var AudioAlert = function (options) {
      if ('Audio' in window) {
         //html5
         return new AudioAlert.prototype.html5(options);
      } else {
         //flash
         return new AudioAlert.prototype.flash(options);
      }
   };

   AudioAlert.prototype = {
      //html5
      html5: function (o) {
         this.audio = new Audio();
         this.audio.src = this.audio.canPlayType('audio/ogg') ? o.ogg : o.mp3;
      },

      //flash
      flash: function (o) {
         var id, self = this;

         this.flashReady = false;
         this.swfobjectReady = false;
         this.pendingPlay = false;

         id = 'audioalert' + (AudioAlert.id++);
         AudioAlert.add(id, this);

         swfobject.addDomLoadEvent(function () {
            self.init(o, id);
         });
      }
   };

   //html5
   AudioAlert.prototype.html5.prototype = {
      play: function () {
         this.audio.play();
      }
   };

   //flash
   AudioAlert.prototype.flash.prototype = {
      init: function (o, id) {
         var audio, el, self = this;

         el = document.createElement('div');
         el.style.cssText = 'position:fixed; left=0; bottom=0; width=8px; height=8px; overflow:hidden';

         audio = document.createElement('div');
         audio.id = id;

         el.appendChild(audio);
         document.body.appendChild(el);

         swfobject.embedSWF(o.swf || 'audioalert-1.0.swf', id, '8', '8', '9.0.0', null, {
            mp3: o.mp3
         }, {
            'allowscriptaccess': 'always'
         }, {
            name: id
         }, function (e) {
            self.audio = e.ref; // substituted elem
            self.swfobjectReady = true;
            if (self.pendingPlay && self.flashReady) {
               self.play();
            }
         });
      },

      play: function () {
         if (this.flashReady && this.swfobjectReady) {
            this.pendingPlay = false;
            this.audio.audioAlertPlay();
         } else {
            // play as soon as flash and swfobject are ready
            this.pendingPlay = true;
         }
      }
   };

   //flash
   (function () {
      AudioAlert.id = 1;
      // list of instances, needed by onComplete
      AudioAlert.instances = {};

      AudioAlert.add = function (id, obj) {
         AudioAlert.instances[id] = obj;
      };

      AudioAlert.get = function (id) {
         return AudioAlert.instances[id];
      };

      // onComplete is called from flash when it is ready to play
      AudioAlert.onComplete = function (id) {
         var o = this.get(id);
         if (o) {
            o.flashReady = true;
            if (o.pendingPlay && o.swfobjectReady) {
               o.play();
            }
         }
      };
   }());


   return (window.AudioAlert = AudioAlert);
}());
