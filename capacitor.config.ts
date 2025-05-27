import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coachem.app',
  appName: 'Coachem',
  webDir: '.next',
  server: {
    url: 'http://localhost:3000',
    cleartext: true,
    allowNavigation: ['*'],
    hostname: 'localhost'
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#ffffff',
    preferredContentMode: 'mobile',
    scheme: 'app',
    limitsNavigationsToAppBoundDomains: false,
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
