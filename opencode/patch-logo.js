const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const zlib = require('zlib');
const os = require('os');

const DEFAULT_FCAV_LOGO = `  ███████╗ ██████╗ █████╗ ██╗   ██╗
  ██╔════╝██╔════╝██╔══██╗██║   ██║
  █████╗  ██║     ███████║██║   ██║
  ██╔══╝  ██║     ██╔══██║╚██╗ ██╔╝
  ██║     ╚██████╗██║  ██║ ╚████╔╝
  ╚═╝      ╚═════╝╚═╝  ╚═╝  ╚═══╝
   ██████╗ ██████╗ ██████╗ ███████╗
  ██╔════╝██╔═══██╗██╔══██╗██╔════╝
  ██║     ██║   ██║██║  ██║█████╗  
  ██║     ██║   ██║██║  ██║██╔══╝  
  ╚██████╗╚██████╔╝██████╔╝███████╗
   ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
        Facultad de Comercio 
                 y
       Administración Victoria`;

const DEFAULT_FCAV_THEME = {
  "$schema": "https://opencode.ai/theme.json",
  "name": "fcav",
  "defs": {
    "fcavGreen": "#22C55E",
    "fcavGreenDark": "#15803D",
    "fcavGreenLight": "#4ADE80",
    "fcavGreenDeep": "#166534",
    "bgDark": "#071209",
    "bgPanelDark": "#0D1C10",
    "bgElementDark": "#152B1B",
    "borderDark": "#1E4D27",
    "borderActiveDark": "#22C55E",
    "borderSubtleDark": "#0F2A15",
    "textLight": "#E8F5E9",
    "textMutedDark": "#739478",
    "bgLight": "#FFFFFF",
    "bgPanelLight": "#F4F9F4",
    "bgElementLight": "#E5EFE5",
    "borderLight": "#B2D8B6",
    "borderActiveLight": "#15803D",
    "borderSubtleLight": "#D5EBD7",
    "textDark": "#0F2A14",
    "textMutedLight": "#4A6B4E"
  },
  "theme": {
    "primary": { "dark": "fcavGreen", "light": "fcavGreenDark" },
    "secondary": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "accent": { "dark": "fcavGreenLight", "light": "fcavGreen" },
    "error": { "dark": "#EF4444", "light": "#DC2626" },
    "warning": { "dark": "#F59E0B", "light": "#B45309" },
    "success": { "dark": "fcavGreen", "light": "fcavGreenDark" },
    "info": { "dark": "fcavGreenLight", "light": "fcavGreenDark" },
    "text": { "dark": "textLight", "light": "textDark" },
    "textMuted": { "dark": "textMutedDark", "light": "textMutedLight" },
    "background": { "dark": "bgDark", "light": "bgLight" },
    "backgroundPanel": { "dark": "bgPanelDark", "light": "bgPanelLight" },
    "backgroundElement": { "dark": "bgElementDark", "light": "bgElementLight" },
    "border": { "dark": "borderDark", "light": "borderLight" },
    "borderActive": { "dark": "borderActiveDark", "light": "borderActiveLight" },
    "borderSubtle": { "dark": "borderSubtleDark", "light": "borderSubtleLight" },
    "diffAdded": { "dark": "fcavGreenLight", "light": "fcavGreenDark" },
    "diffRemoved": { "dark": "#EF4444", "light": "#DC2626" },
    "diffContext": { "dark": "textMutedDark", "light": "textMutedLight" },
    "diffHunkHeader": { "dark": "fcavGreenLight", "light": "fcavGreenDeep" },
    "diffHighlightAdded": { "dark": "#86EFAC", "light": "#16A34A" },
    "diffHighlightRemoved": { "dark": "#FCA5A5", "light": "#EF4444" },
    "diffAddedBg": { "dark": "#0E2E14", "light": "#DCFCE7" },
    "diffRemovedBg": { "dark": "#2E0F12", "light": "#FEE2E2" },
    "diffContextBg": { "dark": "bgPanelDark", "light": "bgPanelLight" },
    "diffLineNumber": { "dark": "textMutedDark", "light": "textMutedLight" },
    "diffAddedLineNumberBg": { "dark": "#0E2E14", "light": "#DCFCE7" },
    "diffRemovedLineNumberBg": { "dark": "#2E0F12", "light": "#FEE2E2" },
    "markdownText": { "dark": "textLight", "light": "textDark" },
    "markdownHeading": { "dark": "fcavGreenLight", "light": "fcavGreenDark" },
    "markdownLink": { "dark": "fcavGreenLight", "light": "fcavGreenDark" },
    "markdownLinkText": { "dark": "fcavGreen", "light": "fcavGreenDark" },
    "markdownCode": { "dark": "fcavGreenLight", "light": "fcavGreenDark" },
    "markdownBlockQuote": { "dark": "textMutedDark", "light": "textMutedLight" },
    "markdownEmph": { "dark": "#F59E0B", "light": "#B45309" },
    "markdownStrong": { "dark": "fcavGreenLight", "light": "fcavGreenDark" },
    "markdownHorizontalRule": { "dark": "borderDark", "light": "borderLight" },
    "markdownListItem": { "dark": "fcavGreen", "light": "fcavGreenDark" },
    "markdownListEnumeration": { "dark": "#F59E0B", "light": "#B45309" },
    "markdownImage": { "dark": "fcavGreenLight", "light": "fcavGreenDark" },
    "markdownImageText": { "dark": "fcavGreen", "light": "fcavGreenDark" },
    "markdownCodeBlock": { "dark": "textLight", "light": "textDark" },
    "syntaxComment": { "dark": "#527357", "light": "#658269" },
    "syntaxKeyword": { "dark": "fcavGreenLight", "light": "fcavGreenDark" },
    "syntaxFunction": { "dark": "fcavGreen", "light": "fcavGreenDark" },
    "syntaxVariable": { "dark": "textLight", "light": "textDark" },
    "syntaxString": { "dark": "#86EFAC", "light": "#16A34A" },
    "syntaxNumber": { "dark": "#4ADE80", "light": "#15803D" },
    "syntaxType": { "dark": "#86EFAC", "light": "fcavGreenDeep" },
    "syntaxOperator": { "dark": "fcavGreen", "light": "fcavGreenDark" },
    "syntaxPunctuation": { "dark": "textLight", "light": "textDark" }
  }
};

const DEFAULT_FCAV_LIGHT_THEME = {
  "$schema": "https://opencode.ai/theme.json",
  "name": "fcav-light",
  "defs": {
    "fcavGreen": "#15803D",
    "fcavGreenAccent": "#16A34A",
    "fcavGreenDeep": "#14532D",
    "bgLight": "#FFFFFF",
    "bgPanelLight": "#F4F9F4",
    "bgElementLight": "#E5EFE5",
    "borderLight": "#B2D8B6",
    "borderActiveLight": "#15803D",
    "borderSubtleLight": "#D5EBD7",
    "textDark": "#0F2A14",
    "textMutedLight": "#4A6B4E"
  },
  "theme": {
    "primary": { "dark": "fcavGreen", "light": "fcavGreen" },
    "secondary": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "accent": { "dark": "fcavGreenAccent", "light": "fcavGreenAccent" },
    "error": { "dark": "#DC2626", "light": "#DC2626" },
    "warning": { "dark": "#B45309", "light": "#B45309" },
    "success": { "dark": "fcavGreen", "light": "fcavGreen" },
    "info": { "dark": "fcavGreenAccent", "light": "fcavGreenAccent" },
    "text": { "dark": "textDark", "light": "textDark" },
    "textMuted": { "dark": "textMutedLight", "light": "textMutedLight" },
    "background": { "dark": "bgLight", "light": "bgLight" },
    "backgroundPanel": { "dark": "bgPanelLight", "light": "bgPanelLight" },
    "backgroundElement": { "dark": "bgElementLight", "light": "bgElementLight" },
    "border": { "dark": "borderLight", "light": "borderLight" },
    "borderActive": { "dark": "borderActiveLight", "light": "borderActiveLight" },
    "borderSubtle": { "dark": "borderSubtleLight", "light": "borderSubtleLight" },
    "diffAdded": { "dark": "fcavGreen", "light": "fcavGreen" },
    "diffRemoved": { "dark": "#DC2626", "light": "#DC2626" },
    "diffContext": { "dark": "textMutedLight", "light": "textMutedLight" },
    "diffHunkHeader": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "diffHighlightAdded": { "dark": "fcavGreenAccent", "light": "fcavGreenAccent" },
    "diffHighlightRemoved": { "dark": "#EF4444", "light": "#EF4444" },
    "diffAddedBg": { "dark": "#DCFCE7", "light": "#DCFCE7" },
    "diffRemovedBg": { "dark": "#FEE2E2", "light": "#FEE2E2" },
    "diffContextBg": { "dark": "bgPanelLight", "light": "bgPanelLight" },
    "diffLineNumber": { "dark": "textMutedLight", "light": "textMutedLight" },
    "diffAddedLineNumberBg": { "dark": "#DCFCE7", "light": "#DCFCE7" },
    "diffRemovedLineNumberBg": { "dark": "#FEE2E2", "light": "#FEE2E2" },
    "markdownText": { "dark": "textDark", "light": "textDark" },
    "markdownHeading": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "markdownLink": { "dark": "fcavGreenAccent", "light": "fcavGreenAccent" },
    "markdownLinkText": { "dark": "fcavGreen", "light": "fcavGreen" },
    "markdownCode": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "markdownBlockQuote": { "dark": "textMutedLight", "light": "textMutedLight" },
    "markdownEmph": { "dark": "#B45309", "light": "#B45309" },
    "markdownStrong": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "markdownHorizontalRule": { "dark": "borderLight", "light": "borderLight" },
    "markdownListItem": { "dark": "fcavGreen", "light": "fcavGreen" },
    "markdownListEnumeration": { "dark": "#B45309", "light": "#B45309" },
    "markdownImage": { "dark": "fcavGreenAccent", "light": "fcavGreenAccent" },
    "markdownImageText": { "dark": "fcavGreen", "light": "fcavGreen" },
    "markdownCodeBlock": { "dark": "textDark", "light": "textDark" },
    "syntaxComment": { "dark": "#658269", "light": "#658269" },
    "syntaxKeyword": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "syntaxFunction": { "dark": "fcavGreen", "light": "fcavGreen" },
    "syntaxVariable": { "dark": "textDark", "light": "textDark" },
    "syntaxString": { "dark": "fcavGreenAccent", "light": "fcavGreenAccent" },
    "syntaxNumber": { "dark": "fcavGreen", "light": "fcavGreen" },
    "syntaxType": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "syntaxOperator": { "dark": "fcavGreen", "light": "fcavGreen" },
    "syntaxPunctuation": { "dark": "textDark", "light": "textDark" }
  }
};

function getLogoText() {
  const candidates = [
    path.join(__dirname, '..', 'resources', 'fcav-logo.txt'),
    path.join(__dirname, 'config', 'fcav-logo.txt'),
    path.join(__dirname, 'fcav-logo.txt'),
    path.join(os.homedir(), '.config', 'opencode', 'fcav-logo.txt')
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return fs.readFileSync(c, 'utf8').replace(/\r\n/g, '\n').trimEnd();
    }
  }
  return DEFAULT_FCAV_LOGO;
}

function installThemeFiles() {
  try {
    const userConfigDir = path.join(os.homedir(), '.config', 'opencode');
    const userThemeDir = path.join(userConfigDir, 'themes');
    fs.mkdirSync(userThemeDir, { recursive: true });

    // fcav.json
    const themeFile = path.join(userThemeDir, 'fcav.json');
    const themeSrc = path.join(__dirname, 'config', 'themes', 'fcav.json');
    if (fs.existsSync(themeSrc)) {
      fs.copyFileSync(themeSrc, themeFile);
    } else {
      fs.writeFileSync(themeFile, JSON.stringify(DEFAULT_FCAV_THEME, null, 2), 'utf8');
    }

    // fcav-light.json
    const themeLightFile = path.join(userThemeDir, 'fcav-light.json');
    const themeLightSrc = path.join(__dirname, 'config', 'themes', 'fcav-light.json');
    if (fs.existsSync(themeLightSrc)) {
      fs.copyFileSync(themeLightSrc, themeLightFile);
    } else {
      fs.writeFileSync(themeLightFile, JSON.stringify(DEFAULT_FCAV_LIGHT_THEME, null, 2), 'utf8');
    }

    const tuiFile = path.join(userConfigDir, 'tui.json');
    const tuiContent = {
      "$schema": "https://opencode.ai/tui.json",
      "theme": "fcav",
      "logo": getLogoText() + "\n"
    };
    fs.writeFileSync(tuiFile, JSON.stringify(tuiContent, null, 2), 'utf8');

    console.log('✓ Configurados temas fcav y fcav-light en ~/.config/opencode/themes/');
  } catch (e) {
    console.warn('Could not setup user global theme files:', e.message);
  }
}

function findOpencodeBinaries() {
  const binaries = [];
  try {
    const npmRoot = cp.execSync('npm root -g', { encoding: 'utf8' }).trim();
    const basePath = path.join(npmRoot, 'opencode-ai');
    const potentialPaths = [
      path.join(basePath, 'bin', 'opencode.exe'),
      path.join(basePath, 'bin', 'opencode'),
      path.join(basePath, 'node_modules', 'opencode-windows-x64', 'bin', 'opencode.exe'),
      path.join(basePath, 'node_modules', 'opencode-windows-x64-baseline', 'bin', 'opencode.exe'),
      path.join(basePath, 'node_modules', 'opencode-linux-x64', 'bin', 'opencode'),
      path.join(basePath, 'node_modules', 'opencode-linux-arm64', 'bin', 'opencode'),
      path.join(basePath, 'node_modules', 'opencode-darwin-arm64', 'bin', 'opencode'),
      path.join(basePath, 'node_modules', 'opencode-darwin-x64', 'bin', 'opencode')
    ];
    for (const p of potentialPaths) {
      if (fs.existsSync(p) && !binaries.includes(p)) {
        binaries.push(p);
      }
    }
  } catch (err) {
    console.warn('Could not determine npm global root automatically:', err.message);
  }
  return binaries;
}

function safeWriteBinary(targetPath, buffer) {
  try {
    fs.writeFileSync(targetPath, buffer);
  } catch (err) {
    if (err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'EACCES') {
      const tempOld = targetPath + '.' + Date.now() + '.old';
      fs.renameSync(targetPath, tempOld);
      fs.writeFileSync(targetPath, buffer);
      try {
        fs.unlinkSync(tempOld);
      } catch (e) {}
    } else {
      throw err;
    }
  }
}

function patchBinary(binaryPath, logoRaw) {
  console.log(`\nPatching binary: ${binaryPath}`);
  const buf = fs.readFileSync(binaryPath);
  const newBuf = Buffer.from(buf);

  // --- 1. Patch chunk-vhczrq09.js (CLI Logo & Banner in Institutional FCAV Colors) ---
  const start1 = newBuf.indexOf(Buffer.from('chunk-vhczrq09.js\x00// @bun\n', 'utf8'));
  const exportMarker1 = Buffer.from('export{b as an};\n', 'utf8');
  if (start1 !== -1) {
    const exportPos1 = newBuf.indexOf(exportMarker1, start1);
    if (exportPos1 !== -1) {
      const end1 = exportPos1 + exportMarker1.length;
      const targetLen1 = end1 - start1;
      const b64 = zlib.deflateSync(Buffer.from(logoRaw, 'utf8')).toString('base64');

      const jsCode1 = 'chunk-vhczrq09.js\x00// @bun\n' +
        'import{en as p}from"B:/~BUN/root/chunk-zbpvt8mq.js";import{kT as h}from"B:/~BUN/root/chunk-4xexkqz8.js";import{iV as X,kV as L}from"B:/~BUN/root/chunk-at6t28qn.js";var b={};X(b,{println:()=>E,print:()=>a,markdown:()=>A,logo:()=>I,input:()=>N,error:()=>w,empty:()=>D,UI:()=>b,Style:()=>T,CancelledError:()=>_});import{EOL as x}from"os";' +
        'var Z="' + b64 + '";' +
        'class _ extends h.TaggedErrorClass()("UICancelledError",{}){}' +
        'var T={TEXT_HIGHLIGHT:"\\x1B[92m",TEXT_HIGHLIGHT_BOLD:"\\x1B[92m\\x1B[1m",TEXT_DIM:"\\x1B[90m",TEXT_DIM_BOLD:"\\x1B[90m\\x1B[1m",TEXT_NORMAL:"\\x1B[0m",TEXT_NORMAL_BOLD:"\\x1B[1m",TEXT_WARNING:"\\x1B[93m",TEXT_WARNING_BOLD:"\\x1B[93m\\x1B[1m",TEXT_DANGER:"\\x1B[91m",TEXT_DANGER_BOLD:"\\x1B[91m\\x1B[1m",TEXT_SUCCESS:"\\x1B[92m",TEXT_SUCCESS_BOLD:"\\x1B[92m\\x1B[1m",TEXT_INFO:"\\x1B[92m",TEXT_INFO_BOLD:"\\x1B[92m\\x1B[1m"};' +
        'function E(...r){a(...r),process.stderr.write(x)}function a(...r){f=!1,process.stderr.write(r.join(" "))}var f=!1;' +
        'function D(){if(f)return;E(""+T.TEXT_NORMAL),f=!0}' +
        'function I(r){let o="\\x1B[0m",g="\\x1B[92m",y="\\x1B[93m",d="\\x1B[90m";let isT=process.stdout.isTTY||process.stderr.isTTY;let lines=L("zlib").inflateSync(Buffer.from(Z,"base64")).toString("utf8").split("\\n");let res=[];for(let i=0;i<lines.length;i++){let l=lines[i];if(isT){if(i<12)l=g+l+o;else l=y+l+o}if(r)res.push(r);res.push(l,x)}return res.join("").trimEnd()}' +
        'async function N(r){let t=L("readline").createInterface({input:process.stdin,output:process.stdout});return new Promise((i)=>{t.question(r,(c)=>{t.close(),i(c.trim())})})}' +
        'function w(r){if(r.startsWith("Error: "))r=r.slice(7);E(T.TEXT_DANGER_BOLD+"Error: "+T.TEXT_NORMAL+r)}function A(r){return r}' +
        '\nexport{b as an};\n';

      const padLen1 = targetLen1 - Buffer.byteLength(jsCode1, 'utf8');
      if (padLen1 >= 4) {
        const paddedJs1 = jsCode1.replace('\nexport{b as an};\n', '/*' + ' '.repeat(padLen1 - 4) + '*/\nexport{b as an};\n');
        Buffer.from(paddedJs1, 'utf8').copy(newBuf, start1);
        console.log('  ✓ Patched chunk-vhczrq09.js (CLI Banner in Institutional FCAV Colors)');
      }
    }
  }

  // --- 2. Patch chunk-zbpvt8mq.js (Legible Block Typography for TUI) ---
  const start2 = newBuf.indexOf(Buffer.from('chunk-zbpvt8mq.js\x00// @bun\n', 'utf8'));
  const exportMarker2 = Buffer.from('export{_ as en,t as fn};\n', 'utf8');
  if (start2 !== -1) {
    const exportPos2 = newBuf.indexOf(exportMarker2, start2);
    if (exportPos2 !== -1) {
      const end2 = exportPos2 + exportMarker2.length;
      const targetLen2 = end2 - start2;

      const jsCode2 = 'chunk-zbpvt8mq.js\x00// @bun\n' +
        'var _={left:[' +
        '"                   ",' +
        '"\\u2588\\u2580\\u2580\\u2580 \\u2588\\u2580\\u2580\\u2580 \\u2588\\u2580\\u2580\\u2588 \\u2588  \\u2588",' +
        '"\\u2588\\u2580\\u2580  \\u2588    \\u2588\\u2580\\u2580\\u2588 \\u2588  \\u2588",' +
        '"\\u2580    \\u2580\\u2580\\u2580\\u2580 \\u2580  \\u2580  \\u2580\\u2580 "' +
        '],right:[' +
        '"                   ",' +
        '"\\u2588\\u2580\\u2580\\u2580 \\u2588\\u2580\\u2580\\u2588 \\u2588\\u2580\\u2580\\u2584 \\u2588\\u2580\\u2580\\u2580",' +
        '"\\u2588    \\u2588  \\u2588 \\u2588  \\u2588 \\u2588\\u2580\\u2580 ",' +
        '"\\u2580\\u2580\\u2580\\u2580 \\u2580\\u2580\\u2580\\u2580 \\u2580\\u2580\\u2580\\u2580 \\u2580\\u2580\\u2580\\u2580"' +
        ']};' +
        'var t=_;' +
        '\nexport{_ as en,t as fn};\n';

      const padLen2 = targetLen2 - Buffer.byteLength(jsCode2, 'utf8');
      if (padLen2 >= 4) {
        const paddedJs2 = jsCode2.replace('\nexport{_ as en,t as fn};\n', '/*' + ' '.repeat(padLen2 - 4) + '*/\nexport{_ as en,t as fn};\n');
        Buffer.from(paddedJs2, 'utf8').copy(newBuf, start2);
        console.log('  ✓ Patched chunk-zbpvt8mq.js (Legible TUI Block Typography)');
      }
    }
  }

  // --- 3. Patch vn (TUI Session Resume & Fallback Logo) ---
  const start3 = newBuf.indexOf(Buffer.from('var vn={left:[', 'utf8'));
  const endMarker3 = Buffer.from('};function ED', 'utf8');
  if (start3 !== -1) {
    const endPos3 = newBuf.indexOf(endMarker3, start3);
    if (endPos3 !== -1) {
      const end3 = endPos3 + 2;
      const targetLen3 = end3 - start3;

      const jsCode3 = 'var vn={left:[' +
        '"                   ",' +
        '"\\u2588\\u2580\\u2580\\u2580 \\u2588\\u2580\\u2580\\u2580 \\u2588\\u2580\\u2580\\u2588 \\u2588  \\u2588",' +
        '"\\u2588\\u2580\\u2580  \\u2588    \\u2588\\u2580\\u2580\\u2588 \\u2588  \\u2588",' +
        '"\\u2580    \\u2580\\u2580\\u2580\\u2580 \\u2580  \\u2580  \\u2580\\u2580 "' +
        '],right:[' +
        '"                   ",' +
        '"\\u2588\\u2580\\u2580\\u2580 \\u2588\\u2580\\u2580\\u2588 \\u2588\\u2580\\u2580\\u2584 \\u2588\\u2580\\u2580\\u2580",' +
        '"\\u2588    \\u2588  \\u2588 \\u2588  \\u2588 \\u2588\\u2580\\u2580 ",' +
        '"\\u2580\\u2580\\u2580\\u2580 \\u2580\\u2580\\u2580\\u2580 \\u2580\\u2580\\u2580\\u2580 \\u2580\\u2580\\u2580\\u2580"' +
        ']};';

      const padLen3 = targetLen3 - Buffer.byteLength(jsCode3, 'utf8');
      if (padLen3 >= 4) {
        const paddedJs3 = jsCode3.replace('};', '/*' + ' '.repeat(padLen3 - 4) + '*/};');
        Buffer.from(paddedJs3, 'utf8').copy(newBuf, start3);
        console.log('  ✓ Patched vn (Legible Fallback & Resume Logo)');
      }
    }
  }

  // --- 4. Patch class vg default colors (Deep Dark Green & Institutional Green) ---
  const vgColorTarget = Buffer.from('panelRgb=[0,0,0];primaryRgb=[255,255,255];logoBaseRgb=[180,180,180];', 'utf8');
  const start4 = newBuf.indexOf(vgColorTarget);
  if (start4 !== -1) {
    const targetLen4 = vgColorTarget.length;
    // panelRgb: [13, 28, 16] (#0D1C10), primaryRgb: [34, 197, 94] (#22C55E), logoBaseRgb: [74, 222, 128] (#4ADE80)
    const replacement4 = 'panelRgb=[13,28,16];primaryRgb=[34,197,94];logoBaseRgb=[74,222,128]; ';
    if (Buffer.byteLength(replacement4, 'utf8') === targetLen4) {
      Buffer.from(replacement4, 'utf8').copy(newBuf, start4);
      console.log('  ✓ Patched class vg default colors to Deep Green & FCAV Institutional Green');
    }
  }

  // --- 5. Patch gi() TUI Logo Color (Force Verde FCAV base) ---
  const giTarget = Buffer.from('var{backgroundPanel:i,primary:Z}=U,V=f0(U.background,U.text,0.62);', 'utf8');
  const start5 = newBuf.indexOf(giTarget);
  if (start5 !== -1) {
    const targetLen5 = giTarget.length;
    const replacement5 = 'var{backgroundPanel:i,primary:Z}=U,V=U.primary;/*               */';
    if (Buffer.byteLength(replacement5, 'utf8') === targetLen5) {
      Buffer.from(replacement5, 'utf8').copy(newBuf, start5);
      console.log('  ✓ Patched gi() to render TUI logo in Verde FCAV (U.primary)');
    }
  }

  // Backup original binary if not existing
  const backupPath = binaryPath + '.orig.bak';
  if (!fs.existsSync(backupPath)) {
    try {
      fs.copyFileSync(binaryPath, backupPath);
      console.log(`  Created backup at: ${backupPath}`);
    } catch {}
  }

  // Write patched binary with atomic fallback
  safeWriteBinary(binaryPath, newBuf);

  console.log(`✅ Successfully patched ${binaryPath}`);
  return true;
}

function main() {
  console.log('=== FCAV CODE Logo & Theme Patcher ===');
  installThemeFiles();

  const logoRaw = getLogoText();
  console.log('Loaded FCAV logo successfully.');

  const binaries = findOpencodeBinaries();
  if (binaries.length === 0) {
    console.warn('No OpenCode binaries found to patch.');
    return;
  }

  let patchedCount = 0;
  for (const b of binaries) {
    if (patchBinary(b, logoRaw)) {
      patchedCount++;
    }
  }

  console.log(`\nPatch complete. Patched ${patchedCount}/${binaries.length} binaries.`);
}

if (require.main === module) {
  main();
}

module.exports = { patchBinary, findOpencodeBinaries, getLogoText, installThemeFiles };
