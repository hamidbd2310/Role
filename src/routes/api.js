const express = require('express');
const UsersController=require('../controllers/UserController/UsersController');
const TaskController=require('../controllers/TasksController');
const BusinessController=require('../controllers/BusinessController/BusinessController');

const AuthVerification=require('../middlewares/AuthVerifyMiddleware');

const router = express.Router();

router.post('/registration',UsersController.registration);
router.get('/login',UsersController.login);
router.post('/profileUpdate',AuthVerification,UsersController.profileUpdate);


//Task
router.post('/createTask',AuthVerification,TaskController.createTask);
router.get('/AllTasks',AuthVerification,TaskController.AllTasks);
router.get('/readTasks/:id',AuthVerification,TaskController.readTasks);
router.post('/updateTask/:id',AuthVerification,TaskController.updateTask);
router.post('/deleteTask/:id',AuthVerification,TaskController.deleteTask);
router.get('/getTasksByStatus/:status',AuthVerification,TaskController.getTasksByStatus);
router.get('/countTasksByStatus',AuthVerification,TaskController.countTasksByStatus);

//Business

router.post('/addBusiness',AuthVerification,BusinessController.addBusiness);









module.exports = router;