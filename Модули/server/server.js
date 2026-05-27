require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

let httpServer;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/admin', require('./routes/admin'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('База данных подключена');

    await sequelize.sync({ alter: false });
    console.log('Модели синхронизированы');

    const { User } = require('./models');
    const adminExists = await User.findOne({ where: { role: 'admin' } });

    if (!adminExists) {
      await User.create({
        login: process.env.ADMIN_LOGIN || 'Admin26',
        password: process.env.ADMIN_PASSWORD || 'Demo20',
        fullName: 'Администратор',
        phone: '+7(999)-999-99-99',
        email: 'admin@banketam.net',
        role: 'admin'
      });

      console.log('Администратор создан');
    }

    await listenOnPort();
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error);
    process.exit(1);
  }
}

function listenOnPort(attempt = 1) {
  const maxAttempts = 8;

  return new Promise((resolve, reject) => {
    httpServer = app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      resolve();
    });

    httpServer.on('error', (err) => {
      httpServer = null;

      if (err.code === 'EADDRINUSE' && attempt < maxAttempts) {
        console.log(`Порт ${PORT} занят, повтор ${attempt}/${maxAttempts - 1} через 1 сек...`);
        setTimeout(() => {
          listenOnPort(attempt + 1).then(resolve).catch(reject);
        }, 1000);
        return;
      }

      if (err.code === 'EADDRINUSE') {
        reject(new Error(`Порт ${PORT} занят. Выполните: npm run free-ports`));
        return;
      }

      reject(err);
    });
  });
}

function closeServer(callback) {
  if (!httpServer) {
    callback?.();
    return;
  }
  httpServer.close(callback);
}

process.once('SIGUSR2', () => {
  closeServer(() => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', () => {
  closeServer(() => {
    sequelize.close().finally(() => process.exit(0));
  });
});

process.on('SIGTERM', () => {
  closeServer(() => {
    sequelize.close().finally(() => process.exit(0));
  });
});

start();
