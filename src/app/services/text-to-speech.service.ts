import { Injectable } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({
  providedIn: 'root',
})
export class TextToSpeechService {
  isSpeaking = false;

  constructor() {}

  async speak(text: string) {
    await TextToSpeech.speak({
      text: text,
      rate: 1.0,
    });
    this.isSpeaking = true;
  }

  async stop() {
    await TextToSpeech.stop();
    this.isSpeaking = false;
  }
}
