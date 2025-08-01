const mongoose = require('mongoose');
const models = require('../models/dynamic');

const connections = {};

const getPanelDb = (panel) => {
  if (!panel) throw new Error('Panel is required');

  const dbName = {
    event: 'Poornam-event',
    travel: 'Travel',
  }[panel];

  if (!dbName) throw new Error('Invalid panel');

  if (connections[dbName]) return connections[dbName];

  const db = mongoose.connection.useDb(dbName, { useCache: true });

  const registeredModels = {};
  for (const [key, schema] of Object.entries(models)) {
    registeredModels[key] = db.model(key, schema);
  }

  connections[dbName] = registeredModels;
  return registeredModels;
};

module.exports = getPanelDb;
