import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'meuApp',
  webDir: 'www',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_notification', // Nome do ícone pequeno para a notificação
      iconColor: '#488AFF',          // Cor para o ícone da notificação
      sound: 'beep.wav',             // Som personalizado, se houver
    },
  },
};

export default config;
