import React, { useEffect } from 'react';
import { usePreloadCriticalResources, useResourceHints, useInlineCriticalCSS } from '@/hooks/usePerformanceOptimization';

interface PerformanceProviderProps {
  children: React.ReactNode;
}

const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  // Initialize performance optimizations
  usePreloadCriticalResources();
  useResourceHints();
  useInlineCriticalCSS();

  useEffect(() => {
    // Defer non-critical JavaScript
    const deferScripts = () => {
      const scripts = document.querySelectorAll('script[data-defer]');
      scripts.forEach(script => {
        if (script instanceof HTMLScriptElement) {
          script.defer = true;
        }
      });
    };

    // Optimize images loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Run optimizations after initial paint
    requestIdleCallback(() => {
      deferScripts();
      optimizeImages();
    });

    // Critical resource hints
    const addResourceHints = () => {
      // Preconnect to external domains
      const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    addResourceHints();
  }, []);

  return <>{children}</>;
};

export default PerformanceProvider;