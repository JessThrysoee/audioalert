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
   import flash.events.IOErrorEvent;
   import flash.media.SoundChannel;
   import flash.display.Sprite;
   import flash.net.URLRequest;
   import flash.events.Event;
   import flash.media.Sound;

   public class audioalert extends Sprite 
   {
      private var sound:Sound;
      private var channel:SoundChannel = new SoundChannel();

      public function audioalert():void {

         sound = new Sound();
         sound.addEventListener(Event.COMPLETE, onLoadedData);
         sound.addEventListener(IOErrorEvent.IO_ERROR, onError);

         sound.load(new URLRequest(this.loaderInfo.parameters.mp3));

         ExternalInterface.addCallback('audioAlertPlay', audioAlertPlay);
      }

      private function onLoadedData(event:Event):void
      {
         ExternalInterface.call('AudioAlert.onLoadedData', ExternalInterface.objectID);
      }

      private function onError(event:IOErrorEvent):void
      {
         ExternalInterface.call('AudioAlert.onError', ExternalInterface.objectID, event.text);
      }

      private function onEnded(event:Event):void 
      {
         ExternalInterface.call('AudioAlert.onEnded', ExternalInterface.objectID);
      }

      public function audioAlertPlay():void 
      {
         channel = sound.play();
         channel.addEventListener(Event.SOUND_COMPLETE, onEnded);
      }
   }

}

