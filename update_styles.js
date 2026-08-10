const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'packages', 'portal', 'src', 'pages');

const files = [
  'Dashboard.jsx',
  'Compliance.jsx',
  'Documents.jsx',
  'Audits.jsx',
  'Incidents.jsx',
  'Training.jsx',
  'Tasks.jsx',
  'Reports.jsx',
  'Messages.jsx',
  'Settings.jsx',
  'MfaVerify.jsx',
  'Login.jsx'
];

const replacements = [
  { regex: /bg-white\/60/g, replace: 'bg-surface/50 glass-card' },
  { regex: /bg-white\/40/g, replace: 'bg-white/5' },
  { regex: /bg-white/g, replace: 'bg-surface' },
  { regex: /text-blueprint/g, replace: 'text-white' },
  { regex: /border-line/g, replace: 'border-white/10' },
  { regex: /bg-paper/g, replace: 'bg-navy' },
  { regex: /text-ink\/70/g, replace: 'text-text-secondary' },
  { regex: /text-ink\/60/g, replace: 'text-text-muted' },
  { regex: /text-ink\/50/g, replace: 'text-text-muted' },
  { regex: /text-ink\/40/g, replace: 'text-text-muted' },
  { regex: /text-ink/g, replace: 'text-text-primary' },
  { regex: /bg-ink\/5/g, replace: 'bg-white/5' },
  // Recharts specific
  { regex: /stroke="#1B3A56"/g, replace: 'stroke="#9CA3AF"' },
  { regex: /stroke="#C7D6DD"/g, replace: 'stroke="rgba(255,255,255,0.1)"' },
  { regex: /fill="#1B3A56"/g, replace: 'fill="#F9FAFB"' },
  { regex: /fill="#16222E"/g, replace: 'fill="#F9FAFB"' },
];

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Some pages have specific Rechart tooltips
    content = content.replace(/contentStyle={{[^}]*}}/g, (match) => {
      return match.replace(/backgroundColor:\s*['"]#(fff|ffffff|EDF2F4)['"]/i, "backgroundColor: '#1F2937'")
                  .replace(/borderColor:\s*['"]#C7D6DD['"]/i, "borderColor: 'rgba(255,255,255,0.1)'")
                  .replace(/color:\s*['"]#(1B3A56|16222E)['"]/i, "color: '#F9FAFB'");
    });

    for (const r of replacements) {
      content = content.replace(r.regex, r.replace);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
}
