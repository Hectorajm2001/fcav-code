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
    "matrixInk0": "#080d08",
    "matrixInk1": "#0e140e",
    "matrixInk2": "#141d14",
    "matrixInk3": "#1c281b",
    "fcavGreen": "#22C55E",
    "fcavGreenDim": "#16A34A",
    "fcavGreenHi": "#4ADE80",
    "uatBlue": "#0369A1",
    "uatBlueLight": "#38BDF8",
    "uatOrange": "#FB923C",
    "uatOrangeDark": "#C2410C",
    "uatGold": "#FBBF24",
    "uatGoldDark": "#B45309",
    "rainGray": "#6B8070",
    "alertRed": "#EF4444",
    "alertRedDark": "#DC2626",
    "lightBg": "#FFFFFF",
    "lightPaper": "#F4FAF4",
    "lightInk1": "#E6F2E6",
    "lightText": "#0D2B14",
    "lightGray": "#5A7A60"
  },
  "theme": {
    "primary": { "dark": "fcavGreen", "light": "fcavGreen" },
    "secondary": { "dark": "uatBlueLight", "light": "uatBlue" },
    "accent": { "dark": "fcavGreenHi", "light": "fcavGreenDim" },
    "error": { "dark": "alertRed", "light": "alertRedDark" },
    "warning": { "dark": "uatGold", "light": "uatGoldDark" },
    "success": { "dark": "fcavGreenHi", "light": "fcavGreen" },
    "info": { "dark": "uatBlueLight", "light": "uatBlue" },
    "text": { "dark": "fcavGreenHi", "light": "lightText" },
    "textMuted": { "dark": "rainGray", "light": "lightGray" },
    "background": { "dark": "matrixInk0", "light": "lightBg" },
    "backgroundPanel": { "dark": "matrixInk1", "light": "lightPaper" },
    "backgroundElement": { "dark": "matrixInk2", "light": "lightInk1" },
    "border": { "dark": "matrixInk3", "light": "lightInk1" },
    "borderActive": { "dark": "fcavGreen", "light": "fcavGreen" },
    "borderSubtle": { "dark": "matrixInk2", "light": "lightPaper" },
    "diffAdded": { "dark": "fcavGreenDim", "light": "fcavGreen" },
    "diffRemoved": { "dark": "alertRed", "light": "alertRedDark" },
    "diffContext": { "dark": "rainGray", "light": "lightGray" },
    "diffHunkHeader": { "dark": "uatBlueLight", "light": "uatBlue" },
    "diffHighlightAdded": { "dark": "fcavGreenHi", "light": "fcavGreenDim" },
    "diffHighlightRemoved": { "dark": "#FCA5A5", "light": "#EF4444" },
    "diffAddedBg": { "dark": "#0f2312", "light": "#E6F7E6" },
    "diffRemovedBg": { "dark": "#261212", "light": "#FEE2E2" },
    "diffContextBg": { "dark": "matrixInk1", "light": "lightPaper" },
    "diffLineNumber": { "dark": "textMuted", "light": "lightGray" },
    "diffAddedLineNumberBg": { "dark": "#0f2312", "light": "#E6F7E6" },
    "diffRemovedLineNumberBg": { "dark": "#261212", "light": "#FEE2E2" },
    "markdownText": { "dark": "fcavGreenHi", "light": "lightText" },
    "markdownHeading": { "dark": "uatBlueLight", "light": "uatBlue" },
    "markdownLink": { "dark": "uatBlueLight", "light": "uatBlue" },
    "markdownLinkText": { "dark": "fcavGreenHi", "light": "fcavGreen" },
    "markdownCode": { "dark": "fcavGreenDim", "light": "fcavGreen" },
    "markdownBlockQuote": { "dark": "rainGray", "light": "lightGray" },
    "markdownEmph": { "dark": "uatOrange", "light": "uatOrangeDark" },
    "markdownStrong": { "dark": "uatGold", "light": "uatGoldDark" },
    "markdownHorizontalRule": { "dark": "matrixInk3", "light": "lightInk1" },
    "markdownListItem": { "dark": "fcavGreen", "light": "fcavGreen" },
    "markdownListEnumeration": { "dark": "uatOrange", "light": "uatOrangeDark" },
    "markdownImage": { "dark": "uatBlueLight", "light": "uatBlue" },
    "markdownImageText": { "dark": "fcavGreenHi", "light": "fcavGreen" },
    "markdownCodeBlock": { "dark": "fcavGreenHi", "light": "lightText" },
    "syntaxComment": { "dark": "rainGray", "light": "lightGray" },
    "syntaxKeyword": { "dark": "uatOrange", "light": "uatOrangeDark" },
    "syntaxFunction": { "dark": "uatBlueLight", "light": "uatBlue" },
    "syntaxVariable": { "dark": "fcavGreenHi", "light": "lightText" },
    "syntaxString": { "dark": "fcavGreen", "light": "fcavGreen" },
    "syntaxNumber": { "dark": "uatGold", "light": "uatGoldDark" },
    "syntaxType": { "dark": "uatGold", "light": "uatGoldDark" },
    "syntaxOperator": { "dark": "fcavGreenDim", "light": "fcavGreen" },
    "syntaxPunctuation": { "dark": "fcavGreenHi", "light": "lightText" }
  }
};

const DEFAULT_FCAV_LIGHT_THEME = {
  "$schema": "https://opencode.ai/theme.json",
  "name": "fcav-light",
  "defs": {
    "lightBg": "#FFFFFF",
    "lightPaper": "#F4FAF4",
    "lightInk1": "#E6F2E6",
    "lightText": "#0D2B14",
    "lightGray": "#5A7A60",
    "fcavGreen": "#15803D",
    "fcavGreenDim": "#16A34A",
    "fcavGreenDeep": "#14532D",
    "uatBlue": "#0369A1",
    "uatOrange": "#C2410C",
    "uatGold": "#B45309",
    "alertRed": "#DC2626"
  },
  "theme": {
    "primary": { "dark": "fcavGreen", "light": "fcavGreen" },
    "secondary": { "dark": "uatBlue", "light": "uatBlue" },
    "accent": { "dark": "fcavGreenDim", "light": "fcavGreenDim" },
    "error": { "dark": "alertRed", "light": "alertRed" },
    "warning": { "dark": "uatGold", "light": "uatGold" },
    "success": { "dark": "fcavGreen", "light": "fcavGreen" },
    "info": { "dark": "uatBlue", "light": "uatBlue" },
    "text": { "dark": "lightText", "light": "lightText" },
    "textMuted": { "dark": "lightGray", "light": "lightGray" },
    "background": { "dark": "lightBg", "light": "lightBg" },
    "backgroundPanel": { "dark": "lightPaper", "light": "lightPaper" },
    "backgroundElement": { "dark": "lightInk1", "light": "lightInk1" },
    "border": { "dark": "lightInk1", "light": "lightInk1" },
    "borderActive": { "dark": "fcavGreen", "light": "fcavGreen" },
    "borderSubtle": { "dark": "lightPaper", "light": "lightPaper" },
    "diffAdded": { "dark": "fcavGreen", "light": "fcavGreen" },
    "diffRemoved": { "dark": "alertRed", "light": "alertRed" },
    "diffContext": { "dark": "lightGray", "light": "lightGray" },
    "diffHunkHeader": { "dark": "uatBlue", "light": "uatBlue" },
    "diffHighlightAdded": { "dark": "fcavGreenDim", "light": "fcavGreenDim" },
    "diffHighlightRemoved": { "dark": "#EF4444", "light": "#EF4444" },
    "diffAddedBg": { "dark": "#E6F7E6", "light": "#E6F7E6" },
    "diffRemovedBg": { "dark": "#FEE2E2", "light": "#FEE2E2" },
    "diffContextBg": { "dark": "lightPaper", "light": "lightPaper" },
    "diffLineNumber": { "dark": "lightGray", "light": "lightGray" },
    "diffAddedLineNumberBg": { "dark": "#E6F7E6", "light": "#E6F7E6" },
    "diffRemovedLineNumberBg": { "dark": "#FEE2E2", "light": "#FEE2E2" },
    "markdownText": { "dark": "lightText", "light": "lightText" },
    "markdownHeading": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "markdownLink": { "dark": "uatBlue", "light": "uatBlue" },
    "markdownLinkText": { "dark": "fcavGreen", "light": "fcavGreen" },
    "markdownCode": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "markdownBlockQuote": { "dark": "lightGray", "light": "lightGray" },
    "markdownEmph": { "dark": "uatOrange", "light": "uatOrange" },
    "markdownStrong": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "markdownHorizontalRule": { "dark": "lightInk1", "light": "lightInk1" },
    "markdownListItem": { "dark": "fcavGreen", "light": "fcavGreen" },
    "markdownListEnumeration": { "dark": "uatOrange", "light": "uatOrange" },
    "markdownImage": { "dark": "uatBlue", "light": "uatBlue" },
    "markdownImageText": { "dark": "fcavGreen", "light": "fcavGreen" },
    "markdownCodeBlock": { "dark": "lightText", "light": "lightText" },
    "syntaxComment": { "dark": "#658269", "light": "#658269" },
    "syntaxKeyword": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "syntaxFunction": { "dark": "uatBlue", "light": "uatBlue" },
    "syntaxVariable": { "dark": "lightText", "light": "lightText" },
    "syntaxString": { "dark": "fcavGreenDim", "light": "fcavGreenDim" },
    "syntaxNumber": { "dark": "uatGold", "light": "uatGold" },
    "syntaxType": { "dark": "fcavGreenDeep", "light": "fcavGreenDeep" },
    "syntaxOperator": { "dark": "fcavGreen", "light": "fcavGreen" },
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
        '"\\u2588\\u2580\\u2580  \\u2588    \\u2588\\u2580\\u2580\\u2580\\u2588 \\u2588  \\u2588",' +
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
    // panelRgb: [14, 20, 14] (#0E140E), primaryRgb: [34, 197, 94] (#22C55E), logoBaseRgb: [74, 222, 128] (#4ADE80)
    const replacement4 = 'panelRgb=[14,20,14];primaryRgb=[34,197,94];logoBaseRgb=[74,222,128];  ';
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

  // --- 6. Patch Xa (Builtin Default Theme to Matrix-style FCAV Green) ---
  const start6 = newBuf.indexOf(Buffer.from('var Xa={$schema:"https://opencode.ai/theme.json",defs:{darkStep1:"#0a0a0a"', 'utf8'));
  const endMarker6 = Buffer.from(';var Ja={', 'utf8');
  if (start6 !== -1) {
    const endPos6 = newBuf.indexOf(endMarker6, start6);
    if (endPos6 !== -1) {
      const origXaBuf = newBuf.subarray(start6, endPos6);
      let resXa = origXaBuf.toString('utf8');
      resXa = resXa.replace('darkStep1:"#0a0a0a"', 'darkStep1:"#080d08"');
      resXa = resXa.replace('darkStep2:"#141414"', 'darkStep2:"#0e140e"');
      resXa = resXa.replace('darkStep3:"#1e1e1e"', 'darkStep3:"#141d14"');
      resXa = resXa.replace('darkStep4:"#282828"', 'darkStep4:"#182318"');
      resXa = resXa.replace('darkStep5:"#323232"', 'darkStep5:"#1c281b"');
      resXa = resXa.replace('darkStep6:"#3c3c3c"', 'darkStep6:"#141d14"');
      resXa = resXa.replace('darkStep7:"#484848"', 'darkStep7:"#1c281b"');
      resXa = resXa.replace('darkStep8:"#606060"', 'darkStep8:"#22c55e"');
      resXa = resXa.replace('darkStep9:"#fab283"', 'darkStep9:"#22c55e"');
      resXa = resXa.replace('darkStep10:"#ffc09f"', 'darkStep10:"#4ade80"');
      resXa = resXa.replace('darkStep11:"#808080"', 'darkStep11:"#6b8070"');
      resXa = resXa.replace('darkStep12:"#eeeeee"', 'darkStep12:"#4ade80"');
      resXa = resXa.replace('darkSecondary:"#5c9cf5"', 'darkSecondary:"#38bdf8"');
      resXa = resXa.replace('darkAccent:"#9d7cd8"', 'darkAccent:"#4ade80"');
      resXa = resXa.replace('darkRed:"#e06c75"', 'darkRed:"#ef4444"');
      resXa = resXa.replace('darkOrange:"#f5a742"', 'darkOrange:"#fb923c"');
      resXa = resXa.replace('darkGreen:"#7fd88f"', 'darkGreen:"#22c55e"');
      resXa = resXa.replace('darkCyan:"#56b6c2"', 'darkCyan:"#38bdf8"');
      resXa = resXa.replace('darkYellow:"#e5c07b"', 'darkYellow:"#fbbf24"');
      resXa = resXa.replace('lightStep2:"#fafafa"', 'lightStep2:"#f4faf4"');
      resXa = resXa.replace('lightStep3:"#f5f5f5"', 'lightStep3:"#e6f2e6"');
      resXa = resXa.replace('lightStep4:"#ebebeb"', 'lightStep4:"#d8ebd8"');
      resXa = resXa.replace('lightStep5:"#e1e1e1"', 'lightStep5:"#cae3ca"');
      resXa = resXa.replace('lightStep6:"#d4d4d4"', 'lightStep6:"#e6f2e6"');
      resXa = resXa.replace('lightStep7:"#b8b8b8"', 'lightStep7:"#b2d8b6"');
      resXa = resXa.replace('lightStep8:"#a0a0a0"', 'lightStep8:"#15803d"');
      resXa = resXa.replace('lightStep9:"#3b7dd8"', 'lightStep9:"#15803d"');
      resXa = resXa.replace('lightStep10:"#2968c3"', 'lightStep10:"#16a34a"');
      resXa = resXa.replace('lightStep11:"#8a8a8a"', 'lightStep11:"#5a7a60"');
      resXa = resXa.replace('lightStep12:"#1a1a1a"', 'lightStep12:"#0d2b14"');
      resXa = resXa.replace('lightSecondary:"#7b5bb6"', 'lightSecondary:"#0369a1"');
      resXa = resXa.replace('lightAccent:"#d68c27"', 'lightAccent:"#16a34a"');
      resXa = resXa.replace('lightRed:"#d1383d"', 'lightRed:"#dc2626"');
      resXa = resXa.replace('lightOrange:"#d68c27"', 'lightOrange:"#c2410c"');
      resXa = resXa.replace('lightGreen:"#3d9a57"', 'lightGreen:"#15803d"');
      resXa = resXa.replace('lightCyan:"#318795"', 'lightCyan:"#0284c7"');
      resXa = resXa.replace('lightYellow:"#b0851f"', 'lightYellow:"#b45309"');

      if (Buffer.byteLength(resXa, 'utf8') === origXaBuf.length) {
        Buffer.from(resXa, 'utf8').copy(newBuf, start6);
        console.log('  ✓ Patched Xa (Builtin Default Theme in Matrix-style FCAV Green)');
      }
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
