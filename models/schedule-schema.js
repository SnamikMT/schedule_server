const mongoose = require('mongoose');

// Определение схемы для модели ScheduleData
const scheduleDataSchema = new mongoose.Schema({
  data: {
    type: Array,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Создание модели ScheduleData на основе схемы
const ScheduleData = mongoose.model('ScheduleData', scheduleDataSchema);

module.exports = ScheduleData;
