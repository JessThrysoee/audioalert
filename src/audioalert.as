/*!
 * HTML5 audio alert library with flash-fallback.
 *
 * Copyright (c) 2010 Jess Thrysoee, http://thrysoee.dk
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

package 
{
   import flash.external.ExternalInterface;
   import flash.display.Sprite;
   import flash.net.URLRequest;
   import flash.events.Event;
   import flash.media.Sound;

   public class audioalert extends Sprite 
   {
      private var sound:Sound;

      public function audioalert():void {

         this.sound = new Sound();
         this.sound.addEventListener(Event.COMPLETE, onComplete);
         this.sound.load(new URLRequest(this.loaderInfo.parameters.mp3));

         ExternalInterface.addCallback('audioAlertPlay', audioAlertPlay);
      }

      private function onComplete(event:Event):void
      {
         ExternalInterface.call('AudioAlert.onComplete', ExternalInterface.objectID);
      }

      public function audioAlertPlay():void {
          this.sound.play();
      }
   }

}

