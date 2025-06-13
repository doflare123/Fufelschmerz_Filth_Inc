const express = require('express');
const router = express.Router();
const { User, Resource, ExchangeRate, UserResource, BankResource, ExchangeRateHistory  } = require('../models');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const logExchangeRateChange = require('../utils/logExchangeHistory');

// 🔹 Получение ресурса по имени
async function findResourceByName(name) {
  console.log("Список ресурсов")
  return await Resource.findOne({ where: { name } });
}

// 🔹 Получение пользователя по имени
async function findUserByName(username) {
  console.log("Список пользоватлей")
  return await User.findOne({ where: { username } });
}

// 🔹 Админ: Добавить новый ресурс (с автоматическим созданием записи в банке)
router.post('/resources', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { name } = req.body;
    console.log("Новый ресурс: " + name);
    
    
    // Создаем ресурс
    const resource = await Resource.create({ name });
    
    // Автоматически создаем запись в банке с количеством 0
    await BankResource.create({
      resourceId: resource.id,
      quantity: 0
    });
    
    res.json({ message: 'Ресурс добавлен и создана запись в банке' });
  } catch (err) {
    console.error('Ошибка при добавлении ресурса:', err);
    res.status(400).json({ error: 'Ошибка при добавлении ресурса' });
  }
});

// 🔹 Админ: Добавить ресурсы в банк
router.post('/bank-resources', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { resourceName, quantity } = req.body;
    console.log("Добавление ресов в банк: " + resourceName, " " + quantity)

    if (!resourceName || quantity === undefined) {
      return res.status(400).json({ error: 'Необходимо указать имя ресурса и количество' });
    }

    const resource = await findResourceByName(resourceName);
    if (!resource) {
      return res.status(404).json({ error: 'Ресурс не найден' });
    }

    // Ищем существующую запись в банке
    const bankResource = await BankResource.findOne({
      where: { ResourceId: resource.id }
    });

    if (bankResource) {
      // Обновляем количество
      await bankResource.update({ 
        quantity: bankResource.quantity + parseInt(quantity) 
      });
      res.json({ 
        message: `Добавлено ${quantity} единиц ресурса "${resourceName}" в банк. Общее количество: ${bankResource.quantity + parseInt(quantity)}` 
      });
    } else {
      // Создаем новую запись
      await BankResource.create({
        ResourceId: resource.id,
        quantity: parseInt(quantity)
      });
      res.json({ 
        message: `Добавлено ${quantity} единиц ресурса "${resourceName}" в банк` 
      });
    }
  } catch (err) {
    console.error('Ошибка при добавлении ресурсов в банк:', err);
    res.status(400).json({ error: 'Ошибка при добавлении ресурсов в банк' });
  }
});

// 🔹 Админ: Установить количество ресурсов в банке (альтернативный метод)
router.put('/bank-resources/:resourceName', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { resourceName } = req.params;
    const { quantity } = req.body;
    console.log("Установка количества ресов: " + resourceName, " " + quantity)

    if (quantity === undefined) {
      return res.status(400).json({ error: 'Необходимо указать количество' });
    }

    const resource = await findResourceByName(resourceName);
    if (!resource) {
      return res.status(404).json({ error: 'Ресурс не найден' });
    }

    const bankResource = await BankResource.findOne({
      where: { resourceId: resource.id }
    });

    if (bankResource) {
      await bankResource.update({ quantity: parseInt(quantity) });
    } else {
      await BankResource.create({
        resourceId: resource.id,
        quantity: parseInt(quantity)
      });
    }

    res.json({ 
      message: `Количество ресурса "${resourceName}" в банке установлено: ${quantity}` 
    });
  } catch (err) {
    console.error('Ошибка при установке количества ресурсов в банке:', err);
    res.status(400).json({ error: 'Ошибка при установке количества ресурсов в банке' });
  }
});

router.post('/exchange-rates', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { from, to, ratePayYou, rateGetYou } = req.body;
    console.log("Добавление курса: ", from, to, ratePayYou, rateGetYou);

    if (!ratePayYou || !rateGetYou) {
      return res.status(400).json({ error: 'Нужно указать ratePayYou и rateGetYou' });
    }

    const [fromResource, toResource] = await Promise.all([
      findResourceByName(from),
      findResourceByName(to)
    ]);

    if (!fromResource || !toResource) {
      return res.status(400).json({ error: 'Ресурсы не найдены' });
    }

    // Обратный курс
    const reverseRatePayYou = rateGetYou;
    const reverseRateGetYou = ratePayYou;

    const [direct, reverse] = await Promise.all([
      ExchangeRate.findOne({ where: { fromResourceId: fromResource.id, toResourceId: toResource.id } }),
      ExchangeRate.findOne({ where: { fromResourceId: toResource.id, toResourceId: fromResource.id } }),
    ]);

    if (direct) {
      await direct.update({ ratePayYou, rateGetYou });
      await logExchangeRateChange(direct.id, rateGetYou / ratePayYou);
    } else {
      const newDirect = await ExchangeRate.create({
        fromResourceId: fromResource.id,
        toResourceId: toResource.id,
        ratePayYou,
        rateGetYou
      });
      await logExchangeRateChange(newDirect.id, rateGetYou / ratePayYou);
    }

    if (reverse) {
      await reverse.update({
        ratePayYou: reverseRatePayYou,
        rateGetYou: reverseRateGetYou
      });
      await logExchangeRateChange(reverse.id, reverseRateGetYou / reverseRatePayYou);
    } else {
      const newReverse = await ExchangeRate.create({
        fromResourceId: toResource.id,
        toResourceId: fromResource.id,
        ratePayYou: reverseRatePayYou,
        rateGetYou: reverseRateGetYou
      });
      await logExchangeRateChange(newReverse.id, reverseRateGetYou / reverseRatePayYou);
    }

    res.json({ message: 'Курс обмена добавлен/обновлён в обе стороны' });
  } catch (err) {
    console.error('Ошибка при работе с курсом обмена:', err);
    res.status(400).json({ error: 'Ошибка при работе с курсом обмена' });
  }
});


// 🔹 Админ: Изменить курс обмена по id (двусторонне)
router.put('/exchange-rates/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const exchangeRate = await ExchangeRate.findByPk(req.params.id);

    console.log("Изменение курса курса: " + exchangeRate)
    if (!exchangeRate) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    const { rate } = req.body;

    // Исправлено: убрано дублирование обновления
    const reverse = await ExchangeRate.findOne({
      where: {
        fromResourceId: exchangeRate.toResourceId,
        toResourceId: exchangeRate.fromResourceId
      }
    });

    await exchangeRate.update({ rate });
    await logExchangeRateChange(exchangeRate.id, rate);

    if (reverse) {
      await reverse.update({ rate: 1 / rate });
      await logExchangeRateChange(reverse.id, 1 / rate);
    }

    res.json({ message: 'Курс обновлён в обе стороны' });
  } catch (err) {
    console.error('Ошибка при обновлении курса:', err);
    res.status(400).json({ error: 'Ошибка при обновлении курса' });
  }
});

// 🔹 Админ: Добавить ресурсы пользователю (по имени пользователя и ресурса)
router.post('/users/:username/resources/:resourceName', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { username, resourceName } = req.params;
    const { quantity } = req.body;
    console.log("Добаваление ресов юзеру: " + username, " " + resourceName + " " + quantity)

    const [user, resource] = await Promise.all([
      findUserByName(username),
      findResourceByName(resourceName)
    ]);

    if (!user || !resource) {
      return res.status(404).json({ error: 'Пользователь или ресурс не найдены' });
    }

    const userResource = await UserResource.findOne({
      where: {
        UserId: user.id,
        ResourceId: resource.id
      }
    });

    if (userResource) {
      await userResource.update({ quantity: userResource.quantity + quantity });
    } else {
      await UserResource.create({
        UserId: user.id,
        ResourceId: resource.id,
        quantity
      });
    }

    res.json({ message: 'Ресурсы добавлены пользователю' });
  } catch (err) {
    console.error('Ошибка при добавлении ресурсов пользователю:', err);
    res.status(400).json({ error: 'Ошибка при добавлении ресурсов пользователю' });
  }
});

// 🔹 Админ: Получить все ресурсы банка
router.get('/bank-resources', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    console.log("Сколько ресов у банка?")
    const bankResources = await BankResource.findAll({
      include: [{
        model: Resource,
        attributes: ['name']
      }]
    });
    
    // Форматируем ответ для удобства
    const formattedResources = bankResources
      .filter(br => br.Resource)
      .map(br => ({
        name: br.Resource.name,
        totalQuantity: br.quantity
      }));
    console.log(formattedResources)
    res.json(formattedResources);
  } catch (err) {
    console.error('Ошибка при получении ресурсов банка:', err);
    res.status(400).json({ error: 'Ошибка при получении ресурсов банка' });
  }
});

module.exports = router;