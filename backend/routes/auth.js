const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Проверка существующего пользователя
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const password_hash = crypto.createHash('sha256').update(password + salt).digest('hex');

    await User.create({ username, password_hash, salt });

    res.json({ message: 'Пользователь зарегистрирован' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
  }
});


router.post('/login', async (req, res) => {
  console.log('Body:', req.body); 
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const hash = crypto.createHash('sha256').update(password.trim() + user.salt).digest('hex');
  if (hash !== user.password_hash) {
  return res.status(401).json({ error: 'Invalid credentials' });
  }
  console.log("Вошел")
  const token = jwt.sign({ id: user.id, name: user.username, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;