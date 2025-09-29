import { useEffect } from 'react';

const FastLoadOptimizer = () => {
  useEffect(() => {
    // Prefetch critical routes
    const prefetchRoutes = [
      '/about',
      '/services',
      '/booking',
      '/contact'
    ];

    prefetchRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });

    // Optimize font loading
    const fontOptimizations = () => {
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: 'Inter';
          font-display: swap;
          src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhiI2B.woff2') format('woff2');
        }
      `;
      document.head.appendChild(style);
    };

    // Add viewport meta if not present
    const addViewportMeta = () => {
      if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
        document.head.appendChild(viewport);
      }
    };

    // Run optimizations
    fontOptimizations();
    addViewportMeta();

    // Remove unused CSS classes (basic cleanup)
    const cleanupUnusedStyles = () => {
      const unusedPatterns = [
        '.clerk-',
        '.cl-'
      ];

      const stylesheets = Array.from(document.styleSheets);
      stylesheets.forEach(stylesheet => {
        try {
          const rules = Array.from(stylesheet.cssRules || []);
          rules.forEach((rule, index) => {
            if (rule instanceof CSSStyleRule) {
              unusedPatterns.forEach(pattern => {
                if (rule.selectorText?.includes(pattern)) {
                  stylesheet.deleteRule(index);
                }
              });
            }
          });
        } catch (e) {
          // Ignore cross-origin stylesheets
        }
      });
    };

    // Cleanup after page load
    setTimeout(cleanupUnusedStyles, 2000);
  }, []);

  return null;
};

export default FastLoadOptimizer;