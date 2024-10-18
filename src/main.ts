import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import 'hammerjs'; // Adicione esta linha para importar Hammer.js

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
