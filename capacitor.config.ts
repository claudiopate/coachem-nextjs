import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coachem.app',
  appName: 'Coachem',
  webDir: 'out',
  server: {
    url: 'http://192.168.1.4:3000',
    cleartext: true,
    androidScheme: 'http'
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#ffffff',
    preferredContentMode: 'mobile',
    scheme: 'app',
    limitsNavigationsToAppBoundDomains: true,
    scrollEnabled: true,
    allowsLinkPreview: false,
    overrideUserAgent: 'Coachem iOS App'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      showSpinner: false,
      androidSpinnerStyle: "large",
      spinnerColor: "#999999",
      splashFullScreen: false,
      splashImmersive: false
    }
  }
};

export default config;
