const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/User/Documents/apex-veritas/packages/web/src';
const tailwindConfigPath = 'c:/Users/User/Documents/apex-veritas/packages/web/tailwind.config.cjs';

// 1. Update tailwind.config.cjs
let tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
tailwindConfig = tailwindConfig.replace(/module\.exports\s*=\s*\{/, "module.exports = {\n  darkMode: 'class',");
const oldColors = `      colors: {
        navy: '#0A0F1C',
        surface: '#1F2937',
        border: 'rgba(255,255,255,0.08)',
        text: {
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        },
        amber: {
          DEFAULT: '#F59E0B',
          grad1: '#EF4444',
          grad2: '#F97316',
        },
        teal: {
          DEFAULT: '#14B8A6',
          grad: '#06B6D4',
        },
        oxide: '#EF4444',
      },`;
const newColors = `      colors: {
        background: 'var(--color-bg-background)',
        surface: 'var(--color-bg-surface)',
        divider: 'var(--color-border-divider)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        amber: {
          DEFAULT: 'var(--color-amber)',
          grad1: 'var(--color-amber-grad1)',
          grad2: 'var(--color-amber-grad2)',
        },
        teal: {
          DEFAULT: 'var(--color-teal)',
          grad: 'var(--color-teal-grad)',
        },
        oxide: 'var(--color-oxide)',
      },`;
tailwindConfig = tailwindConfig.replace(oldColors, newColors);
fs.writeFileSync(tailwindConfigPath, tailwindConfig);

// 2. Create ThemeProvider.jsx
const themeProviderContent = `import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
`;
fs.mkdirSync(path.join(srcDir, 'components'), { recursive: true });
fs.writeFileSync(path.join(srcDir, 'components', 'ThemeProvider.jsx'), themeProviderContent);

// 3. Update index.css
const indexCssPath = path.join(srcDir, 'index.css');
let indexCss = fs.readFileSync(indexCssPath, 'utf8');
const oldBase = `@layer base {
  body {
    @apply bg-navy text-text-primary font-body antialiased;
  }
  h1, h2, h3, h4 {
    @apply font-display text-text-primary;
  }
}`;
const newBase = `@layer base {
  :root {
    --color-bg-background: #EDF2F4;
    --color-bg-surface: #FFFFFF;
    --color-border-divider: #C7D6DD;
    --color-text-primary: #16222E;
    --color-text-secondary: #1B3A56;
    --color-text-muted: #6B7280;
    --color-amber: #D98E2B;
    --color-amber-grad1: #D98E2B;
    --color-amber-grad2: #F59E0B;
    --color-teal: #2F7D6E;
    --color-teal-grad: #14B8A6;
    --color-oxide: #B23A34;
  }

  .dark {
    --color-bg-background: #0A0F1C;
    --color-bg-surface: #1F2937;
    --color-border-divider: rgba(255,255,255,0.08);
    --color-text-primary: #F9FAFB;
    --color-text-secondary: #9CA3AF;
    --color-text-muted: #6B7280;
    --color-amber: #F59E0B;
    --color-amber-grad1: #EF4444;
    --color-amber-grad2: #F97316;
    --color-teal: #14B8A6;
    --color-teal-grad: #06B6D4;
    --color-oxide: #EF4444;
  }

  body {
    @apply bg-background text-text-primary font-body antialiased transition-colors duration-300;
  }
  h1, h2, h3, h4 {
    @apply font-display text-text-primary;
  }
}`;
indexCss = indexCss.replace(oldBase, newBase);
fs.writeFileSync(indexCssPath, indexCss);

// 4. Update App.jsx
const appJsxPath = path.join(srcDir, 'App.jsx');
let appJsx = fs.readFileSync(appJsxPath, 'utf8');
appJsx = appJsx.replace("import { Routes, Route } from 'react-router-dom';", "import { Routes, Route } from 'react-router-dom';\nimport { ThemeProvider } from './components/ThemeProvider';");
appJsx = appJsx.replace('<div className="flex min-h-screen flex-col">', '<ThemeProvider>\n    <div className="flex min-h-screen flex-col">');
appJsx = appJsx.replace('    </div>\n  );\n}', '    </div>\n    </ThemeProvider>\n  );\n}');
fs.writeFileSync(appJsxPath, appJsx);

// 5. Update NavBar.jsx
const navBarPath = path.join(srcDir, 'components', 'NavBar.jsx');
let navBarJsx = fs.readFileSync(navBarPath, 'utf8');
navBarJsx = navBarJsx.replace("import { Link, NavLink } from 'react-router-dom';", "import { Link, NavLink } from 'react-router-dom';\nimport { useTheme } from './ThemeProvider';");
navBarJsx = navBarJsx.replace('export default function NavBar() {', 'export default function NavBar() {\n  const { theme, toggleTheme } = useTheme();');

const portalLink = `<a href={PORTAL_URL} className="glass-card px-5 py-2 text-xs font-semibold text-text-primary hover:border-amber-DEFAULT hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
            Client Portal
          </a>`;
const themeToggle = `          <button
            onClick={toggleTheme}
            className="glass-card p-2 text-text-primary hover:text-amber transition-colors border-white/20"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>`;

navBarJsx = navBarJsx.replace(portalLink, portalLink + '\n' + themeToggle);
fs.writeFileSync(navBarPath, navBarJsx);

// 6. Global Search and Replace in all JSX files
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const allFiles = walk(srcDir);
allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/bg-navy/g, 'bg-background');
  content = content.replace(/border-border/g, 'border-divider');
  content = content.replace(/border-white\/10/g, 'border-divider');
  content = content.replace(/bg-\\[#0A0F1C\\]/g, 'bg-background');
  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
