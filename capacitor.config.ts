import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.contaempresas.demo',
  appName: 'Conta Empresas Demo',
  webDir: '.output/public',
  backgroundColor: '#2f2b9f',
  android: {
    backgroundColor: '#2f2b9f',
    allowMixedContent: false,
    captureInput: true,
  },
};

export default config;
