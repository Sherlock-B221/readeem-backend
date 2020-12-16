import * as express from 'express';
import {editUser, getUserById, getUsers} from '../controllers/user-controller.js'
import checkAuth from "../middlewares/check-auth";

const router = express.Router();

router.get('/get', getUsers);

router.get('/get/:id', getUserById);

router.patch('/patch/:id',checkAuth ,editUser);

export default router;