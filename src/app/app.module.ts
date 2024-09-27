import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { VersiculoModalComponent } from './versiculo-modal/versiculo-modal.component';
import { SentimentoModalModule } from './sentimento-modal/sentimento-modal.module';
import { EmocoesModalComponent } from './modal-emocao/modal-emocao/modal-emocao.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, VersiculoModalComponent, EmocoesModalComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    SentimentoModalModule,
    FormsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
