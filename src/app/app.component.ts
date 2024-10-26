import { Component, OnInit } from '@angular/core';
import { LocalNotifications, LocalNotificationActionPerformed } from '@capacitor/local-notifications';
import { Router } from '@angular/router';
import { EmocaoServiceService } from './services/emocao.service.service'; // Importar o EmocaoService

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  dadosEmocao: any = {}; // Armazenar os dados do serviço

  constructor(private router: Router, private emocaoService: EmocaoServiceService) {} // Injetar o EmocaoService

  ngOnInit() {
    // Carregar os dados das emoções no início
    this.emocaoService.getEmocoes().subscribe(data => {
      this.dadosEmocao = data.sentimentos; // Armazenar os sentimentos para serem usados
      this.scheduleNotifications(); // Agendar notificações após carregar os dados
    });

    // Ouvinte de eventos de clique na notificação
    LocalNotifications.addListener('localNotificationActionPerformed', (notification: LocalNotificationActionPerformed) => {
      const versiculo = notification.notification.body; // Versículo
      const reflexao = notification.notification.extra?.reflexao || 'Reflexão não disponível'; // Reflexão
      this.router.navigate(['/notificacao-reflexao', { versiculo, reflexao }]);
      console.log('notificação')
    });
  }

  async scheduleNotifications() {
    await LocalNotifications.requestPermissions();

    const versiculoInfo = this.getVersiculoAleatorio();

    const notifications = [
      {
        title: 'Bom dia! Deus mandou te dizer:',
        body: versiculoInfo.versiculo, // Passa o versículo como corpo da notificação
        id: 1,
        schedule: {
          at: this.getNextNotificationTime(6, 0),
          repeat: 'day',
        },
        extra: { reflexao: versiculoInfo.reflexao } // Inclui a reflexão como extra
      },
      {
        title: 'Boa noite! Antes de dormir Deus quer falar com você:',
        body: versiculoInfo.versiculo,
        id: 2,
        schedule: {
          at: this.getNextNotificationTime(23, 25),
          repeat: 'day',
        },
        extra: { reflexao: versiculoInfo.reflexao }
      },
      {
        title: 'Boa noite! Antes de dormir Deus quer falar com você:',
        body: versiculoInfo.versiculo,
        id: 3,
        schedule: {
          at: this.getNextNotificationTime(23, 18),
          repeat: 'day',
        },
        extra: { reflexao: versiculoInfo.reflexao }
      },
    ];

    await LocalNotifications.schedule({ notifications });
  }

  getNextNotificationTime(hours: number, minutes: number): Date {
    const now = new Date();
    let notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);

    if (notificationTime <= now) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    return notificationTime;
  }

  getVersiculoAleatorio(): { versiculo: string, reflexao: string } {
    if (this.dadosEmocao['feliz'] && this.dadosEmocao['feliz'].length > 0) {
      const versiculos = this.dadosEmocao['feliz'];
      const indiceAleatorio = Math.floor(Math.random() * versiculos.length);
      const versiculoSorteado = versiculos[indiceAleatorio];
      return { versiculo: versiculoSorteado.versiculo, reflexao: versiculoSorteado.reflexao };
    } else {
      return { versiculo: 'Versículo padrão', reflexao: 'Reflexão padrão' };
    }
  }
}
