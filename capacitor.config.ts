import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.claudiopaternesi.coachem',
  appName: 'Coachem',
  webDir: 'out',
  server: {
    url: 'http://192.168.1.4:3000',
    cleartext: true,
    androidScheme: 'http'
  },
  ios: {
    contentInset: 'never',
    allowsLinkPreview: false,
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: true,
    scheme: 'app',
    preferredContentMode: 'mobile',
    backgroundColor: '#ffffff'
  }
};

export default config;
