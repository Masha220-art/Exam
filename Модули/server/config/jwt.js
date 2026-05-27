const secret = (process.env.JWT_SECRET || '').trim();

if (!secret) {
  console.warn(
    'JWT_SECRET не задан. Скопируйте server/.env.example в server/.env и укажите JWT_SECRET.'
  );
}

module.exports = secret || 'dev-only-insecure-jwt-secret';