/**
 * Освобождает порты dev-сервера (Windows).
 * Запуск: node scripts/free-ports.js
 */
const { execSync } = require('child_process');

const PORTS = [3000, 3001, 5000];

function freePort(port) {
  try {
    const output = execSync(`netstat -ano | findstr ":${port}"`, { encoding: 'utf8' });
    const pids = new Set();

    for (const line of output.split('\n')) {
      if (!line.includes('LISTENING')) continue;
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid) && pid !== '0') {
        pids.add(pid);
      }
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        console.log(`Порт ${port}: остановлен процесс PID ${pid}`);
      } catch {
        // процесс уже завершён
      }
    }
  } catch {
    // порт свободен
  }
}

console.log('Проверка портов 3000, 3001, 5000...');
PORTS.forEach(freePort);
console.log('Готово.');
