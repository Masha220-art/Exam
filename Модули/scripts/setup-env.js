const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../server/.env');
const examplePath = path.join(__dirname, '../server/.env.example');

function ensureEnvFile() {
  if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('Создан файл server/.env (скопирован из .env.example)');
    return;
  }

  if (!fs.existsSync(envPath)) {
    console.warn('Не найден server/.env и server/.env.example — создайте .env вручную.');
    return;
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const jwtMatch = content.match(/^JWT_SECRET=(.*)$/m);
  if (!jwtMatch || !jwtMatch[1].trim()) {
    const line = 'JWT_SECRET=change_me_to_a_long_random_string';
    const next = jwtMatch
      ? content.replace(/^JWT_SECRET=.*$/m, line)
      : `${content.trimEnd()}\n\n${line}\n`;
    fs.writeFileSync(envPath, next.endsWith('\n') ? next : `${next}\n`, 'utf8');
    console.log('В server/.env добавлен JWT_SECRET (был пустым или отсутствовал)');
  }
}

ensureEnvFile();