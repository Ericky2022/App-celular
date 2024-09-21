import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.scheduleNotifications();
  }

  async scheduleNotifications() {
    await LocalNotifications.requestPermissions();

    const notifications = [
      {
        title: 'Bom dia! Deus mando te dizer:',
        body: 'Esta é a sua primeira notificação do dia.',
        id: 1,
        schedule: {
          at: new Date(Date.now() + 1000 * 60 * 60 * 8), // 08:00
          repeat: 'day',
        },
      },
      {
        title: 'Boa noite! Antes de dormir Deus tem uma palavra para você',
        body: 'Esta é a sua segunda notificação do dia.',
        id: 2,
        schedule: {
          at: new Date(Date.now() + 1000 * 60 * 60 * 20), // 20:00
          repeat: 'day',
        },
      },
    ];

    await LocalNotifications.schedule({
      notifications,
    });
  }
}
