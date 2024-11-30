import { Injectable } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({
  providedIn: 'root',
})
export class TextToSpeechService {
  isSpeaking = false;

  constructor() {}

  speak(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
    this.isSpeaking = true;
  }

  stop(): void {
    window.speechSynthesis.cancel();
  }

  // async speak(text: string) {
  //   await TextToSpeech.speak({
  //     text: text,
  //     rate: 1.0,
  //   });
  // }

  // async stop() {
  //   await TextToSpeech.stop();
  //   this.isSpeaking = false;
  // }
}
