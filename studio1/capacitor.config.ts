import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agenda.plus',
  appName: 'agenda-plus',
  webDir: 'out',
  server: {
    url: 'http://localhost:9002',
    cleartext: true
  }
};

export default config;
