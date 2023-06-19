const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const path = require('path');
const ScheduleData = require('../models/schedule-schema');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.get('/schedule', (req, res) => {
  const schedulePath = path.join(__dirname, '../../client/public/schedule.html');
  res.sendFile(schedulePath);
});
router.post('/save-data', (req, res) => {
  const data = req.body.data; // Получаем данные из запроса

  console.log('Received data:', data); // Отладочное сообщение

  // Создаем новый объект ScheduleData и сохраняем данные в базу данных
  const scheduleData = new ScheduleData({ data });
  scheduleData.save()
    .then(() => {
      res.json({ message: 'Данные сохранены успешно' });
      console.log('Сохраненные данные:', data);
    })
    .catch((error) => {
      console.error('Ошибка при сохранении данных:', error); // Отладочное сообщение
      res.status(500).json({ error: 'Произошла ошибка при сохранении данных' });
    });
});

router.get('/schedule-data', (req, res) => {
  ScheduleData.findOne().sort({ _id: -1 }).exec()
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({ error: 'Произошла ошибка при получении данных' });
    });
});



module.exports = router