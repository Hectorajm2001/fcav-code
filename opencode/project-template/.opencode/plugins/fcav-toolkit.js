/**
 * fcav-toolkit.js — Plugin Oficial FCAV CODE
 * Funcionalidades:
 * 1. Escaneo preventivo de secretos antes de commits / guardados (.env, keys, tokens).
 * 2. Formateo y linting de código (prettier, eslint, dotnet format).
 * 3. Notificaciones de escritorio para tareas completadas.
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const SECRET_PATTERNS = [
  /(?:api[_-]?key|apikey|secret|password|passwd|token|auth[_-]?token)\s*[:=]\s*['"][a-zA-Z0-9_\-.~+=/]{8,}['"]/i,
  /ghp_[a-zA-Z0-9]{36}/,
  /sk-[a-zA-Z0-9]{20,}/,
  /BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY/
];

/**
 * Escanea una cadena de texto buscando posibles secretos expuestos.
 * @param {string} content
 * @returns {string[]} Lista de patrones sospechosos encontrados
 */
function scanForSecrets(content) {
  const findings = [];
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(line)) {
        findings.push(`Línea ${idx + 1}: Posible secreto detectado -> ${line.trim().substring(0, 50)}...`);
        break;
      }
    }
  });
  return findings;
}

/**
 * Ejecuta formateo automático según los archivos presentes en el proyecto.
 * @param {string} projectDir
 */
function autoFormat(projectDir = process.cwd()) {
  try {
    // Si es proyecto .NET
    const csproj = fs.readdirSync(projectDir).find(f => f.endsWith('.csproj'));
    if (csproj) {
      try {
        cp.execSync('dotnet format --verbosity quiet', { cwd: projectDir, stdio: 'ignore' });
        return { success: true, tool: 'dotnet format' };
      } catch {}
    }

    // Si tiene prettier
    const pkgPath = path.join(projectDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        cp.execSync('npx prettier --write . --log-level warn', { cwd: projectDir, stdio: 'ignore' });
        return { success: true, tool: 'prettier' };
      } catch {}
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
  return { success: false, reason: 'No se detectó formateador configurado.' };
}

/**
 * Envía una notificación nativa de escritorio (Windows / Linux / macOS).
 * @param {string} title
 * @param {string} message
 */
function notifyDesktop(title = 'FCAV CODE', message = 'Tarea completada') {
  try {
    if (process.platform === 'win32') {
      const psCommand = `[reflection.assembly]::loadwithpartialname('System.Windows.Forms'); [System.Windows.Forms.NotifyIcon]::new() | % { $_.Icon = [System.Drawing.SystemIcons]::Information; $_.BalloonTipTitle = '${title.replace(/'/g, "''")}'; $_.BalloonTipText = '${message.replace(/'/g, "''")}'; $_.Visible = $true; $_.ShowBalloonTip(3000) }`;
      cp.exec(`powershell -NoProfile -Command "${psCommand}"`, { stdio: 'ignore' });
    } else if (process.platform === 'darwin') {
      cp.exec(`osascript -e 'display notification "${message}" with title "${title}"'`, { stdio: 'ignore' });
    } else if (process.platform === 'linux') {
      cp.exec(`notify-send "${title}" "${message}"`, { stdio: 'ignore' });
    }
  } catch {}
}

module.exports = {
  scanForSecrets,
  autoFormat,
  notifyDesktop
};
