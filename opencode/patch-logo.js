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
    "matrixInk0": "#0a0e0a",
    "matrixInk1": "#0e130d",
    "matrixInk2": "#141c12",
    "matrixInk3": "#1e2a1b",
    "rainGreen": "#2eff6a",
    "rainGreenDim": "#1cc24b",
    "rainGreenHi": "#62ff94",
    "rainCyan": "#00efff",
    "rainTeal": "#24f6d9",
    "rainPurple": "#c770ff",
    "rainOrange": "#ffa83d",
    "alertRed": "#ff4b4b",
    "alertYellow": "#e6ff57",
    "alertBlue": "#30b3ff",
    "rainGray": "#8ca391",
    "lightBg": "#eef3ea",
    "lightPaper": "#e4ebe1",
    "lightInk1": "#dae1d7",
    "lightText": "#203022",
    "lightGray": "#748476"
  },
  "theme": {
    "primary": { "dark": "rainGreen", "light": "rainGreenDim" },
    "secondary": { "dark": "rainCyan", "light": "rainTeal" },
    "accent": { "dark": "rainPurple", "light": "rainPurple" },
    "error": { "dark": "alertRed", "light": "alertRed" },
    "warning": { "dark": "alertYellow", "light": "alertYellow" },
    "success": { "dark": "rainGreenHi", "light": "rainGreenDim" },
    "info": { "dark": "alertBlue", "light": "alertBlue" },
    "text": { "dark": "rainGreenHi", "light": "lightText" },
    "textMuted": { "dark": "rainGray", "light": "lightGray" },
    "background": { "dark": "matrixInk0", "light": "lightBg" },
    "backgroundPanel": { "dark": "matrixInk1", "light": "lightPaper" },
    "backgroundElement": { "dark": "matrixInk2", "light": "lightInk1" },
    "border": { "dark": "matrixInk3", "light": "lightGray" },
    "borderActive": { "dark": "rainGreen", "light": "rainGreenDim" },
    "borderSubtle": { "dark": "matrixInk2", "light": "lightInk1" },
    "diffAdded": { "dark": "rainGreenDim", "light": "rainGreenDim" },
    "diffRemoved": { "dark": "alertRed", "light": "alertRed" },
    "diffContext": { "dark": "rainGray", "light": "lightGray" },
    "diffHunkHeader": { "dark": "alertBlue", "light": "alertBlue" },
    "diffHighlightAdded": { "dark": "#77ffaf", "light": "#5dac7e" },
    "diffHighlightRemoved": { "dark": "#ff7171", "light": "#d53a3a" },
    "diffAddedBg": { "dark": "#132616", "light": "#e0efde" },
    "diffRemovedBg": { "dark": "#261212", "light": "#f9e5e5" },
    "diffContextBg": { "dark": "matrixInk1", "light": "lightPaper" },
    "diffLineNumber": { "dark": "textMuted", "light": "#556156" },
    "diffAddedLineNumberBg": { "dark": "#0f1b11", "light": "#d6e7d2" },
    "diffRemovedLineNumberBg": { "dark": "#1b1414", "light": "#f2d2d2" },
    "markdownText": { "dark": "rainGreenHi", "light": "lightText" },
    "markdownHeading": { "dark": "rainCyan", "light": "rainTeal" },
    "markdownLink": { "dark": "alertBlue", "light": "alertBlue" },
    "markdownLinkText": { "dark": "rainTeal", "light": "rainTeal" },
    "markdownCode": { "dark": "rainGreenDim", "light": "rainGreenDim" },
    "markdownBlockQuote": { "dark": "rainGray", "light": "lightGray" },
    "markdownEmph": { "dark": "rainOrange", "light": "rainOrange" },
    "markdownStrong": { "dark": "alertYellow", "light": "alertYellow" },
    "markdownHorizontalRule": { "dark": "rainGray", "light": "lightGray" },
    "markdownListItem": { "dark": "alertBlue", "light": "alertBlue" },
    "markdownListEnumeration": { "dark": "rainTeal", "light": "rainTeal" },
    "markdownImage": { "dark": "alertBlue", "light": "alertBlue" },
    "markdownImageText": { "dark": "rainTeal", "light": "rainTeal" },
    "markdownCodeBlock": { "dark": "rainGreenHi", "light": "lightText" },
    "syntaxComment": { "dark": "rainGray", "light": "lightGray" },
    "syntaxKeyword": { "dark": "rainPurple", "light": "rainPurple" },
    "syntaxFunction": { "dark": "alertBlue", "light": "alertBlue" },
    "syntaxVariable": { "dark": "rainGreenHi", "light": "lightText" },
    "syntaxString": { "dark": "rainGreenDim", "light": "rainGreenDim" },
    "syntaxNumber": { "dark": "rainOrange", "light": "rainOrange" },
    "syntaxType": { "dark": "alertYellow", "light": "alertYellow" },
    "syntaxOperator": { "dark": "rainTeal", "light": "rainTeal" },
    "syntaxPunctuation": { "dark": "rainGreenHi", "light": "lightText" }
  }
};

const DEFAULT_FCAV_LIGHT_THEME = {
  "$schema": "https://opencode.ai/theme.json",
  "name": "fcav-light",
  "defs": {
    "lightBg": "#FFFFFF",
    "lightPaper": "#F4FAF4",
    "lightInk1": "#E6F2E6",
    "lightText": "#203022",
    "lightGray": "#748476",
    "rainGreen": "#15803D",
    "rainGreenDim": "#16A34A",
    "rainTeal": "#0D9488",
    "rainPurple": "#7C3AED",
    "rainOrange": "#D97706",
    "alertRed": "#DC2626",
    "alertYellow": "#CA8A04",
    "alertBlue": "#0284C7"
  },
  "theme": {
    "primary": { "dark": "rainGreen", "light": "rainGreen" },
    "secondary": { "dark": "rainTeal", "light": "rainTeal" },
    "accent": { "dark": "rainPurple", "light": "rainPurple" },
    "error": { "dark": "alertRed", "light": "alertRed" },
    "warning": { "dark": "alertYellow", "light": "alertYellow" },
    "success": { "dark": "rainGreen", "light": "rainGreen" },
    "info": { "dark": "alertBlue", "light": "alertBlue" },
    "text": { "dark": "lightText", "light": "lightText" },
    "textMuted": { "dark": "lightGray", "light": "lightGray" },
    "background": { "dark": "lightBg", "light": "lightBg" },
    "backgroundPanel": { "dark": "lightPaper", "light": "lightPaper" },
    "backgroundElement": { "dark": "lightInk1", "light": "lightInk1" },
    "border": { "dark": "lightInk1", "light": "lightInk1" },
    "borderActive": { "dark": "rainGreen", "light": "rainGreen" },
    "borderSubtle": { "dark": "lightPaper", "light": "lightPaper" },
    "diffAdded": { "dark": "rainGreen", "light": "rainGreen" },
    "diffRemoved": { "dark": "alertRed", "light": "alertRed" },
    "diffContext": { "dark": "lightGray", "light": "lightGray" },
    "diffHunkHeader": { "dark": "alertBlue", "light": "alertBlue" },
    "diffHighlightAdded": { "dark": "rainGreenDim", "light": "rainGreenDim" },
    "diffHighlightRemoved": { "dark": "#EF4444", "light": "#EF4444" },
    "diffAddedBg": { "dark": "#E6F7E6", "light": "#E6F7E6" },
    "diffRemovedBg": { "dark": "#FEE2E2", "light": "#FEE2E2" },
    "diffContextBg": { "dark": "lightPaper", "light": "lightPaper" },
    "diffLineNumber": { "dark": "lightGray", "light": "lightGray" },
    "diffAddedLineNumberBg": { "dark": "#E6F7E6", "light": "#E6F7E6" },
    "diffRemovedLineNumberBg": { "dark": "#FEE2E2", "light": "#FEE2E2" },
    "markdownText": { "dark": "lightText", "light": "lightText" },
    "markdownHeading": { "dark": "rainTeal", "light": "rainTeal" },
    "markdownLink": { "dark": "alertBlue", "light": "alertBlue" },
    "markdownLinkText": { "dark": "rainTeal", "light": "rainTeal" },
    "markdownCode": { "dark": "rainGreen", "light": "rainGreen" },
    "markdownBlockQuote": { "dark": "lightGray", "light": "lightGray" },
    "markdownEmph": { "dark": "rainOrange", "light": "rainOrange" },
    "markdownStrong": { "dark": "alertYellow", "light": "alertYellow" },
    "markdownHorizontalRule": { "dark": "lightInk1", "light": "lightInk1" },
    "markdownListItem": { "dark": "rainGreen", "light": "rainGreen" },
    "markdownListEnumeration": { "dark": "rainOrange", "light": "rainOrange" },
    "markdownImage": { "dark": "alertBlue", "light": "alertBlue" },
    "markdownImageText": { "dark": "rainTeal", "light": "rainTeal" },
    "markdownCodeBlock": { "dark": "lightText", "light": "lightText" },
    "syntaxComment": { "dark": "lightGray", "light": "lightGray" },
    "syntaxKeyword": { "dark": "rainPurple", "light": "rainPurple" },
    "syntaxFunction": { "dark": "alertBlue", "light": "alertBlue" },
    "syntaxVariable": { "dark": "lightText", "light": "lightText" },
    "syntaxString": { "dark": "rainGreenDim", "light": "rainGreenDim" },
    "syntaxNumber": { "dark": "rainOrange", "light": "rainOrange" },
    "syntaxType": { "dark": "alertYellow", "light": "alertYellow" },
    "syntaxOperator": { "dark": "rainTeal", "light": "rainTeal" },
    "syntaxPunctuation": { "dark": "lightText", "light": "lightText" }
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

    // Update tui.jsonc if exists
    const tuiJsonc = path.join(userConfigDir, 'tui.jsonc');
    if (fs.existsSync(tuiJsonc)) {
      let content = fs.readFileSync(tuiJsonc, 'utf8');
      if (content.includes('"theme"')) {
        content = content.replace(/"theme":\s*"[^"]*"/, '"theme": "fcav"');
      } else {
        content = content.replace('{', '{\n  "theme": "fcav",');
      }
      fs.writeFileSync(tuiJsonc, content, 'utf8');
    }

    // Update local KV state
    const kvFile = path.join(os.homedir(), '.local', 'state', 'opencode', 'kv.json');
    if (fs.existsSync(kvFile)) {
      try {
        const kv = JSON.parse(fs.readFileSync(kvFile, 'utf8'));
        kv.theme = 'fcav';
        fs.writeFileSync(kvFile, JSON.stringify(kv, null, 2), 'utf8');
      } catch {}
    }

    // Update current workspace .opencode if present
    const wsThemes = path.join(process.cwd(), '.opencode', 'themes');
    if (fs.existsSync(wsThemes)) {
      fs.writeFileSync(path.join(wsThemes, 'fcav.json'), JSON.stringify(DEFAULT_FCAV_THEME, null, 2), 'utf8');
      fs.writeFileSync(path.join(wsThemes, 'fcav-light.json'), JSON.stringify(DEFAULT_FCAV_LIGHT_THEME, null, 2), 'utf8');
    }
    const wsTui = path.join(process.cwd(), '.opencode', 'tui.json');
    if (fs.existsSync(wsTui)) {
      fs.writeFileSync(wsTui, JSON.stringify(tuiContent, null, 2), 'utf8');
    }

    console.log('✓ Configurados temas fcav y fcav-light en ~/.config/opencode/themes/ y KV state');
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
  
  // Use backup if available to ensure pristine source offsets
  const backupPath = binaryPath + '.orig.bak';
  let buf;
  if (fs.existsSync(backupPath)) {
    buf = fs.readFileSync(backupPath);
  } else {
    buf = fs.readFileSync(binaryPath);
    try {
      fs.copyFileSync(binaryPath, backupPath);
      console.log(`  Created backup at: ${backupPath}`);
    } catch {}
  }
  const newBuf = Buffer.from(buf);

  // --- 1. Patch chunk-vhczrq09.js (CLI Logo & Banner in Matrix/FCAV Colors) ---
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
        console.log('  ✓ Patched chunk-vhczrq09.js (CLI Banner in Matrix/FCAV Colors)');
      }
    }
  }

  // --- 2. Patch chunk-zbpvt8mq.js (FCAV CODE Block Typography - Full and Compact) ---
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
        '"\\u2588^^^ \\u2588___ \\u2588__\\u2588 \\u2588__\\u2588",' +
        '"\\u2580    \\u2580\\u2580\\u2580\\u2580 \\u2580  \\u2580  \\u2580\\u2580 "' +
        '],right:[' +
        '"                   ",' +
        '"\\u2588\\u2580\\u2580\\u2580 \\u2588\\u2580\\u2580\\u2588 \\u2588\\u2580\\u2580\\u2584 \\u2588\\u2580\\u2580\\u2580",' +
        '"\\u2588___ \\u2588__\\u2588 \\u2588__\\u2588 \\u2588^^^",' +
        '"\\u2580\\u2580\\u2580\\u2580 \\u2580\\u2580\\u2580\\u2580 \\u2580~~\\u2580 \\u2580\\u2580\\u2580\\u2580"' +
        ']},t={left:[' +
        '"    ",' +
        '"\\u2588\\u2580\\u2580\\u2580",' +
        '"\\u2588^^^",' +
        '"\\u2580   "' +
        '],right:[' +
        '"    ",' +
        '"\\u2588\\u2580\\u2580\\u2580",' +
        '"\\u2588___",' +
        '"\\u2580\\u2580\\u2580\\u2580"' +
        ']};' +
        '\nexport{_ as en,t as fn};\n';

      const padLen2 = targetLen2 - Buffer.byteLength(jsCode2, 'utf8');
      if (padLen2 >= 4) {
        const paddedJs2 = jsCode2.replace('\nexport{_ as en,t as fn};\n', '/*' + ' '.repeat(padLen2 - 4) + '*/\nexport{_ as en,t as fn};\n');
        Buffer.from(paddedJs2, 'utf8').copy(newBuf, start2);
        console.log('  ✓ Patched chunk-zbpvt8mq.js (FCAV CODE Typography - Full and Compact)');
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
        '"\\u2588^^^ \\u2588___ \\u2588__\\u2588 \\u2588__\\u2588",' +
        '"\\u2580    \\u2580\\u2580\\u2580\\u2580 \\u2580  \\u2580  \\u2580\\u2580 "' +
        '],right:[' +
        '"                   ",' +
        '"\\u2588\\u2580\\u2580\\u2580 \\u2588\\u2580\\u2580\\u2588 \\u2588\\u2580\\u2580\\u2584 \\u2588\\u2580\\u2580\\u2580",' +
        '"\\u2588___ \\u2588__\\u2588 \\u2588__\\u2588 \\u2588^^^",' +
        '"\\u2580\\u2580\\u2580\\u2580 \\u2580\\u2580\\u2580\\u2580 \\u2580~~\\u2580 \\u2580\\u2580\\u2580\\u2580"' +
        ']};';

      const padLen3 = targetLen3 - Buffer.byteLength(jsCode3, 'utf8');
      if (padLen3 >= 4) {
        const paddedJs3 = jsCode3.replace('};', '/*' + ' '.repeat(padLen3 - 4) + '*/};');
        Buffer.from(paddedJs3, 'utf8').copy(newBuf, start3);
        console.log('  ✓ Patched vn (Legible Fallback & Resume Logo)');
      }
    }
  }

  // --- 4. Patch gi() TUI Logo Color (Force Verde Matrix base) ---
  const giTarget = Buffer.from('var{backgroundPanel:i,primary:Z}=U,V=f0(U.background,U.text,0.62);', 'utf8');
  const start5 = newBuf.indexOf(giTarget);
  if (start5 !== -1) {
    const targetLen5 = giTarget.length;
    const replacement5 = 'var{backgroundPanel:i,primary:Z}=U,V=U.primary;/*               */';
    if (Buffer.byteLength(replacement5, 'utf8') === targetLen5) {
      Buffer.from(replacement5, 'utf8').copy(newBuf, start5);
      console.log('  ✓ Patched gi() to render TUI logo in U.primary');
    }
  }

  // --- 5. Patch default theme Xa to point to Matrix theme Qa ---
  const start6 = newBuf.indexOf(Buffer.from('opencode:Xa,orng:Ja', 'utf8'));
  if (start6 !== -1) {
    const replacement6 = 'opencode:Qa,orng:Ja';
    Buffer.from(replacement6, 'utf8').copy(newBuf, start6);
    console.log('  ✓ Patched default opencode theme to use Matrix theme directly (Qa)');
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
