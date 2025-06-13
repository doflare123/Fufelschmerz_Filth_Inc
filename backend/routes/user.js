const express = require('express');
const router = express.Router();
const { User, Resource, ExchangeRate, UserResource, BankResource, Transaction } = require('../models');
const authMiddleware = require('../middleware/auth');
const { Op } = require('sequelize');

async function findResourceByName(name) {
  return await Resource.findOne({ where: { name } });
}


// Пользователь: Получить свои ресурсы
router.get('/resources', authMiddleware, async (req, res) => {
  try {
    const userResources = await UserResource.findAll({
      where: { UserId: req.user.id },
      include: Resource
    });
    
    res.json(userResources);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка при получении ресурсов' });
  }
});

router.get('transactions', authMiddleware, async(req, res) =>{
  try {
    
  } catch (error) {
    
  }
})

router.post('/transfer', authMiddleware, async (req, res) => {
  try {
    const { senderName, receiverName, resourceName, quantity } = req.body;

    // Получаем отправителя и проверяем, что это текущий пользователь
    const sender = await User.findByPk(req.user.id);

    // Получаем получателя
    const receiver = await User.findOne({ where: { username: receiverName } });
    if (!receiver) {
      return res.status(404).json({ error: 'Получатель не найден' });
    }

    // Получаем ресурс
    const resource = await Resource.findOne({ where: { name: resourceName } });
    if (!resource) {
      return res.status(404).json({ error: 'Ресурс не найден' });
    }

    // Проверка наличия ресурса у отправителя
    const userResource = await UserResource.findOne({
      where: {
        UserId: sender.id,
        ResourceId: resource.id
      }
    });

    if (!userResource || userResource.quantity < quantity) {
      return res.status(400).json({ error: 'Недостаточно ресурсов для перевода' });
    }

    // Списываем у отправителя
    await userResource.update({ quantity: userResource.quantity - quantity });

    // Добавляем получателю
    let receiverResource = await UserResource.findOne({
      where: {
        UserId: receiver.id,
        ResourceId: resource.id
      }
    });

    if (receiverResource) {
      await receiverResource.update({ quantity: receiverResource.quantity + quantity });
    } else {
      await UserResource.create({
        UserId: receiver.id,
        ResourceId: resource.id,
        quantity
      });
    }

    // Логируем транзакцию
    await Transaction.create({
      SenderId: sender.id,
      ReceiverId: receiver.id,
      ResourceId: resource.id,
      quantity
    });

    res.json({ message: 'Перевод выполнен успешно' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при переводе ресурсов' });
  }
});


// Пользователь: Получить курсы обмена
router.get('/exchange-rates', async (req, res) => {
  try {
    const exchangeRates = await ExchangeRate.findAll({
      include: [
        { model: Resource, as: 'fromResource' },
        { model: Resource, as: 'toResource' }
      ]
    });
    
    res.json(exchangeRates);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка при получении курсов обмена' });
  }
});

// 🔹 Пользователь: Получить историю курса между двумя ресурсами
router.get('/exchange-rate-history', authMiddleware, async (req, res) => {
  try {
    const { from, to } = req.query;

    const [fromResource, toResource] = await Promise.all([
      findResourceByName(from),
      findResourceByName(to)
    ]);

    if (!fromResource || !toResource) {
      return res.status(404).json({ error: 'Ресурсы не найдены' });
    }

    const exchangeRate = await ExchangeRate.findOne({
      where: {
        fromResourceId: fromResource.id,
        toResourceId: toResource.id
      }
    });

    if (!exchangeRate) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    const history = await exchangeRate.getExchangeRateHistories({
      order: [['timestamp', 'ASC']]
    });

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Ошибка при получении истории курса' });
  }
});


router.get('/search', authMiddleware, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  const users = await User.findAll({
    where: {
      username: { [Op.iLike]: `%${q}%` },
      id: { [Op.ne]: req.user.id } // Исключаем текущего пользователя
    },
    limit: 10
  });

  res.json(users.map(u => ({ id: u.id, username: u.username })));
});


router.get('/resourcessearch', authMiddleware, async (req, res) => {

  const resources = await Resource.findAll({
    limit: 50
  });

  res.json(resources.map(r => ({ id: r.id, name: r.name })));
});

module.exports = router;