const { ExchangeRateHistory } = require('../models');

async function logExchangeRateChange(exchangeRateId, rate) {
  await ExchangeRateHistory.create({
    exchangeRateId,
    rate,
    timestamp: new Date()
  });
}

module.exports = logExchangeRateChange;