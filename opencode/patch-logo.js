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
    const themesDir = path.join(userConfigDir, 'themes');
    fs.mkdirSync(themesDir, { recursive: true });

    // Copy theme files to ~/.config/opencode/themes/
    const srcTheme = path.join(__dirname, 'config', 'themes', 'fcav.json');
    if (fs.existsSync(srcTheme)) {
      fs.copyFileSync(srcTheme, path.join(themesDir, 'fcav.json'));
    }
    const srcLight = path.join(__dirname, 'config', 'themes', 'fcav-light.json');
    if (fs.existsSync(srcLight)) {
      fs.copyFileSync(srcLight, path.join(themesDir, 'fcav-light.json'));
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

    // Update local KV state so theme is immediately active
    const stateDir = path.join(os.homedir(), '.local', 'state', 'opencode');
    fs.mkdirSync(stateDir, { recursive: true });
    const kvFile = path.join(stateDir, 'kv.json');
    let kv = {};
    if (fs.existsSync(kvFile)) {
      try {
        kv = JSON.parse(fs.readFileSync(kvFile, 'utf8'));
      } catch {}
    }
    kv.theme = 'fcav';
    fs.writeFileSync(kvFile, JSON.stringify(kv, null, 2), 'utf8');

    // Update current workspace .opencode if present
    const wsTui = path.join(process.cwd(), '.opencode', 'tui.json');
    if (fs.existsSync(wsTui)) {
      fs.writeFileSync(wsTui, JSON.stringify(tuiContent, null, 2), 'utf8');
    }

    console.log('✓ Configurado tema fcav como predeterminado en tui.json, themes/ y KV state');
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

  // --- 2. Patch chunk-zbpvt8mq.js (Crisp Pure Block Typography - Image 1) ---
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
        ']},t={left:[' +
        '"    ",' +
        '"\\u2588\\u2580\\u2580\\u2580",' +
        '"\\u2588\\u2580\\u2580 ",' +
        '"\\u2580   "' +
        '],right:[' +
        '"    ",' +
        '"\\u2588\\u2580\\u2580\\u2580",' +
        '"\\u2588   ",' +
        '"\\u2580\\u2580\\u2580\\u2580"' +
        ']};' +
        '\nexport{_ as en,t as fn};\n';

      const padLen2 = targetLen2 - Buffer.byteLength(jsCode2, 'utf8');
      if (padLen2 >= 4) {
        const paddedJs2 = jsCode2.replace('\nexport{_ as en,t as fn};\n', '/*' + ' '.repeat(padLen2 - 4) + '*/\nexport{_ as en,t as fn};\n');
        Buffer.from(paddedJs2, 'utf8').copy(newBuf, start2);
        console.log('  ✓ Patched chunk-zbpvt8mq.js (Crisp Pure Block Typography)');
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
        '"\\u2580\\u2580\\u2580\\u2580 \\u2588\\u2580\\u2580\\u2580\\u2580 \\u2580\\u2580\\u2580\\u2580 \\u2580\\u2580\\u2580\\u2580"' +
        ']};';

      const padLen3 = targetLen3 - Buffer.byteLength(jsCode3, 'utf8');
      if (padLen3 >= 4) {
        const paddedJs3 = jsCode3.replace('};', '/*' + ' '.repeat(padLen3 - 4) + '*/};');
        Buffer.from(paddedJs3, 'utf8').copy(newBuf, start3);
        console.log('  ✓ Patched vn (Legible Fallback & Resume Logo)');
      }
    }
  }

  // --- 4. Patch class vg default colors (Institutional Green Colors) ---
  const vgColorTarget = Buffer.from('panelRgb=[0,0,0];primaryRgb=[255,255,255];logoBaseRgb=[180,180,180];', 'utf8');
  const start4 = newBuf.indexOf(vgColorTarget);
  if (start4 !== -1) {
    const targetLen4 = vgColorTarget.length;
    // panelRgb: [14, 20, 14] (#0E140E), primaryRgb: [34, 197, 94] (#22C55E), logoBaseRgb: [74, 222, 128] (#4ADE80)
    const replacement4 = 'panelRgb=[14,20,14];primaryRgb=[34,197,94];logoBaseRgb=[74,222,128];';
    if (Buffer.byteLength(replacement4, 'utf8') === targetLen4) {
      Buffer.from(replacement4, 'utf8').copy(newBuf, start4);
      console.log('  ✓ Patched class vg default colors to FCAV Institutional Green');
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

  // --- 6. Patch default theme Xa directly to Matrix/FCAV Dark Theme with Institutional Accents ---
  const start6 = newBuf.indexOf(Buffer.from('var Xa={$schema:"https://opencode.ai/theme.json"', 'utf8'));
  const endMarker6 = Buffer.from(';var Ja={', 'utf8');
  if (start6 !== -1) {
    const endPos6 = newBuf.indexOf(endMarker6, start6);
    if (endPos6 !== -1) {
      const targetLen6 = endPos6 - start6;
      const jsCode6 = 'var Xa={' +
        '$schema:"https://opencode.ai/theme.json",' +
        'defs:{' +
        'darkStep1:"#080d08",darkStep2:"#0e140e",darkStep3:"#141d14",darkStep4:"#182317",darkStep5:"#1c281b",' +
        'darkStep6:"#223221",darkStep7:"#2a3e29",darkStep8:"#344e33",darkStep9:"#22c55e",darkStep10:"#16a34a",' +
        'darkStep11:"#4ade80",darkStep12:"#4ade80",' +
        'lightStep1:"#ffffff",lightStep2:"#f4faf4",lightStep3:"#e6f2e6",lightStep4:"#d9ebd9",lightStep5:"#cbe3cb",' +
        'lightStep6:"#b9d8b9",lightStep7:"#a1c9a1",lightStep8:"#7eb57e",lightStep9:"#15803d",lightStep10:"#14532d",' +
        'lightStep11:"#15803d",lightStep12:"#0d2b14",' +
        'uatBlue:"#0369a1",uatBlueLight:"#38bdf8",uatOrange:"#fb923c",uatGold:"#fbbf24",alertRed:"#ef4444"' +
        '},' +
        'theme:{' +
        'primary:{dark:"darkStep9",light:"lightStep9"},' +
        'secondary:{dark:"uatBlueLight",light:"uatBlue"},' +
        'accent:{dark:"darkStep11",light:"lightStep10"},' +
        'error:{dark:"alertRed",light:"alertRed"},' +
        'warning:{dark:"uatGold",light:"uatGold"},' +
        'success:{dark:"darkStep9",light:"lightStep9"},' +
        'info:{dark:"uatBlueLight",light:"uatBlue"},' +
        'text:{dark:"darkStep12",light:"lightStep12"},' +
        'textMuted:{dark:"#6b8070",light:"#5a7a60"},' +
        'background:{dark:"darkStep1",light:"lightStep1"},' +
        'backgroundPanel:{dark:"darkStep2",light:"lightStep2"},' +
        'backgroundElement:{dark:"darkStep3",light:"lightStep3"},' +
        'border:{dark:"darkStep5",light:"lightStep3"},' +
        'borderActive:{dark:"darkStep9",light:"lightStep9"},' +
        'borderSubtle:{dark:"darkStep3",light:"lightStep2"},' +
        'diffAdded:{dark:"darkStep9",light:"lightStep9"},' +
        'diffRemoved:{dark:"alertRed",light:"alertRed"},' +
        'diffContext:{dark:"#6b8070",light:"#5a7a60"},' +
        'diffHunkHeader:{dark:"uatBlueLight",light:"uatBlue"},' +
        'diffHighlightAdded:{dark:"darkStep11",light:"lightStep9"},' +
        'diffHighlightRemoved:{dark:"#ef4444",light:"#ef4444"},' +
        'diffAddedBg:{dark:"#102814",light:"#e6f7e6"},' +
        'diffRemovedBg:{dark:"#2a1010",light:"#fee2e2"},' +
        'diffContextBg:{dark:"darkStep2",light:"lightStep2"},' +
        'diffLineNumber:{dark:"#6b8070",light:"#5a7a60"},' +
        'diffAddedLineNumberBg:{dark:"#102814",light:"#e6f7e6"},' +
        'diffRemovedLineNumberBg:{dark:"#2a1010",light:"#fee2e2"},' +
        'markdownText:{dark:"darkStep12",light:"lightStep12"},' +
        'markdownHeading:{dark:"uatBlueLight",light:"lightStep10"},' +
        'markdownLink:{dark:"uatBlueLight",light:"uatBlue"},' +
        'markdownLinkText:{dark:"darkStep11",light:"lightStep9"},' +
        'markdownCode:{dark:"darkStep11",light:"lightStep10"},' +
        'markdownBlockQuote:{dark:"#6b8070",light:"#5a7a60"},' +
        'markdownEmph:{dark:"uatOrange",light:"uatOrange"},' +
        'markdownStrong:{dark:"uatGold",light:"lightStep10"},' +
        'markdownHorizontalRule:{dark:"darkStep5",light:"lightStep3"},' +
        'markdownListItem:{dark:"darkStep9",light:"lightStep9"},' +
        'markdownListEnumeration:{dark:"uatOrange",light:"uatOrange"},' +
        'markdownImage:{dark:"uatBlueLight",light:"uatBlue"},' +
        'markdownImageText:{dark:"darkStep11",light:"lightStep9"},' +
        'markdownCodeBlock:{dark:"darkStep12",light:"lightStep12"},' +
        'syntaxComment:{dark:"#6b8070",light:"#658269"},' +
        'syntaxKeyword:{dark:"uatOrange",light:"lightStep10"},' +
        'syntaxFunction:{dark:"uatBlueLight",light:"uatBlue"},' +
        'syntaxVariable:{dark:"darkStep12",light:"lightStep12"},' +
        'syntaxString:{dark:"darkStep9",light:"lightStep9"},' +
        'syntaxNumber:{dark:"uatGold",light:"uatGold"},' +
        'syntaxType:{dark:"uatGold",light:"lightStep10"},' +
        'syntaxOperator:{dark:"darkStep10",light:"lightStep9"},' +
        'syntaxPunctuation:{dark:"darkStep12",light:"lightStep12"}' +
        '}}';

      const padLen6 = targetLen6 - Buffer.byteLength(jsCode6, 'utf8');
      if (padLen6 >= 4) {
        const paddedJs6 = jsCode6 + '/*' + ' '.repeat(padLen6 - 4) + '*/';
        Buffer.from(paddedJs6, 'utf8').copy(newBuf, start6);
        console.log('  ✓ Patched Xa (Builtin Default Theme with FCAV Dark and Light Palette)');
      }
    }
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
