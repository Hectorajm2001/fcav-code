#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const os = require('os');
const { patchBinary, findOpencodeBinaries, getLogoText, installThemeFiles } = require('./patch-logo');

function printBanner() {
  const green = '\x1B[92m';
  const yellow = '\x1B[93m';
  const reset = '\x1B[0m';
  console.log(`\n${green}  ███████╗ ██████╗ █████╗ ██╗   ██╗${reset}`);
  console.log(`${green}  ██╔════╝██╔════╝██╔══██╗██║   ██║${reset}`);
  console.log(`${green}  █████╗  ██║     ███████║██║   ██║${reset}`);
  console.log(`${green}  ██╔══╝  ██║     ██╔══██║╚██╗ ██╔╝${reset}`);
  console.log(`${green}  ██║     ╚██████╗██║  ██║ ╚████╔╝ ${reset}`);
  console.log(`${green}  ╚═╝      ╚═════╝╚═╝  ╚═╝  ╚═══╝ ${reset}`);
  console.log(`${green}   ██████╗ ██████╗ ██████╗ ███████╗${reset}`);
  console.log(`${green}  ██╔════╝██╔═══██╗██╔══██╗██╔════╝${reset}`);
  console.log(`${green}  ██║     ██║   ██║██║  ██║█████╗  ${reset}`);
  console.log(`${green}  ██║     ██║   ██║██║  ██║██╔══╝  ${reset}`);
  console.log(`${green}  ╚██████╗╚██████╔╝██████╔╝███████╗${reset}`);
  console.log(`${green}   ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝${reset}`);
  console.log(`${yellow}        Facultad de Comercio ${reset}`);
  console.log(`${yellow}                 y           ${reset}`);
  console.log(`${yellow}       Administración Victoria${reset}\n`);
}

async function updateFcav(options = {}) {
  printBanner();
  console.log('========================================================');
  console.log('   FCAV CODE — Actualizador y Parcheador');
  console.log('========================================================\n');

  const skipNpm = options.patchOnly || process.argv.includes('--patch-only');

  if (!skipNpm) {
    console.log('[1/3] Actualizando motor de IA (OpenCode) desde npm...');
    try {
      cp.execSync('npm install -g opencode-ai@latest', { stdio: 'inherit' });
      console.log('✓ Motor actualizado a la última versión disponible.');
    } catch (e) {
      console.warn('⚠️ Advertencia en actualización npm:', e.message);
    }
  } else {
    console.log('[1/3] Omitiendo actualización npm (--patch-only).');
  }

  console.log('\n[2/3] Sincronizando temas e identidad visual FCAV...');
  installThemeFiles();

  console.log('\n[3/3] Inyectando logotipo y colores FCAV en los binarios...');
  try {
    const logoRaw = getLogoText();
    const binaries = findOpencodeBinaries();
    if (binaries.length === 0) {
      console.warn('⚠️ No se encontraron binarios de OpenCode para parchear.');
    } else {
      let count = 0;
      for (const b of binaries) {
        if (patchBinary(b, logoRaw)) count++;
      }
      console.log(`\n✅ Inyección completada con éxito: ${count}/${binaries.length} binarios personalizados.`);
    }
  } catch (e) {
    console.error('❌ Error al inyectar logotipo FCAV:', e.message);
    process.exit(1);
  }

  console.log('\n========================================================');
  console.log('   ✅ FCAV CODE está 100% actualizado y configurado');
  console.log('========================================================\n');
}

if (require.main === module) {
  updateFcav();
}

module.exports = { updateFcav };
