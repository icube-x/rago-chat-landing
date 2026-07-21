const measurementId = 'G-NHQJ174DKM';

type GtagCommand = 'config' | 'js';
type GtagArguments = [GtagCommand, string | Date];

declare global {
  interface Window {
    dataLayer: GtagArguments[];
    gtag: (...args: GtagArguments) => void;
  }
}

window.dataLayer = window.dataLayer || [];
window.gtag = (...args: GtagArguments) => window.dataLayer.push(args);
window.gtag('js', new Date());
window.gtag('config', measurementId);

const script = document.createElement('script');
script.async = true;
script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
document.head.append(script);

export {};
