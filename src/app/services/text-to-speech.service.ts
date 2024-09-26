import { Injectable } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({
  providedIn: 'root',
})
export class TextToSpeechService {
  private synth: SpeechSynthesis;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  // speak(text: string) {
  //   if (this.synth.speaking) {
  //     console.error('Já está falando...');
  //     return;
  //   }

  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.lang = 'pt-BR'; // Define o idioma
  //   this.synth.speak(utterance);
  // }

  // stop() {
  //   this.synth.cancel(); // Para a síntese de voz
  // }

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
