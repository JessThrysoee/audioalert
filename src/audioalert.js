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
      html5: function (options) {
         var audio, o = options;

         this.options = options;

         audio = new Audio();
         audio.src = audio.canPlayType('audio/ogg') ? o.ogg : o.mp3;

         //http://dev.w3.org/html5/spec-author-view/video.html#mediaevents
         if (o.loadeddata) {
            audio.addEventListener('loadeddata', o.loadeddata, false);
         }
         if (o.ended) {
            audio.addEventListener('ended', o.ended, false);
         }
         if (o.error) {
            audio.addEventListener('error', o.error, false);
         }

         this.audio = audio;
      },

      //flash
      flash: function (options) {
         var id, self = this;

         this.options = options;

         this.flashReady = false;
         this.swfobjectReady = false;
         this.pendingPlay = false;

         this.id = 'audioalert' + (AudioAlert.id++);
         AudioAlert.add(this.id, this);

         swfobject.addDomLoadEvent(function () {
            self.init();
         });
      }
   };

   //html5
   AudioAlert.prototype.html5.prototype = {
      play: function () {
         this.audio.play();
      },
      bind: function (eventType, handler) {
         this.options[eventType] = handler;
         this.audio.addEventListener(eventType, handler, false);
      }
   };

   //flash
   AudioAlert.prototype.flash.prototype = {
      init: function () {
         var audio, el, o, self;

         self = this;
         o = this.options;

         el = document.createElement('div');
         el.style.cssText = 'position:fixed; left=0; bottom=0; width=8px; height=8px; overflow:hidden';

         audio = document.createElement('div');
         audio.id = this.id;

         el.appendChild(audio);
         document.body.appendChild(el);

         swfobject.embedSWF(o.swf || 'audioalert-1.0.swf', this.id, '8', '8', '9.0.0', null, {
            mp3: o.mp3
         }, {
            'allowscriptaccess': 'always'
         }, {
            name: this.id
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
      },

      bind: function (eventType, handler) {
         this.options[eventType] = handler;
      }
   };

   //flash -- global dispath to instances
   (function () {
      AudioAlert.id = 1;
      AudioAlert.instances = {};

      AudioAlert.add = function (id, obj) {
         AudioAlert.instances[id] = obj;
      };

      AudioAlert.get = function (id) {
         return AudioAlert.instances[id];
      };

      // onComplete is called from flash when it is ready to play
      AudioAlert.onLoadedData = function (id) {
         var obj = this.get(id);
         if (obj) {
            if (obj.options.loadeddata) {
               obj.options.loadeddata();
            }

            obj.flashReady = true;
            if (obj.pendingPlay && obj.swfobjectReady) {
               obj.play();
            }
         }
      };

      AudioAlert.onError = function (id, text) {
         var obj = this.get(id);
         if (obj && obj.options.error) {
            obj.options.error(text);
         }
      };

      AudioAlert.onEnded = function (id) {
         var obj = this.get(id);
         if (obj && obj.options.ended) {
            obj.options.ended();
         }
      };
   }());


   return (window.AudioAlert = AudioAlert);
}());
