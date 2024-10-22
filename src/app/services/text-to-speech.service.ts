import { Injectable } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({
  providedIn: 'root',
})
export class TextToSpeechService {

  async speak(text: string) {
    await TextToSpeech.speak({
      text: text,
      lang: 'pt-BR',
      rate: 1.0
    });
  }

  async stop() {
    await TextToSpeech.stop();
  }
}
