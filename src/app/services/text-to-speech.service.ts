import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TextToSpeechService {
  private synth: SpeechSynthesis;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string) {
    if (this.synth.speaking) {
      console.error('Já está falando...');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR'; // Define o idioma
    this.synth.speak(utterance);
  }

  stop() {
    this.synth.cancel(); // Para a síntese de voz
  }
}
