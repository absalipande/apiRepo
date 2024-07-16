import express from 'express';
import { getGeoLocation, addGeoLocation, getHistory, deleteHistories, getUserGeoLocation } from '../controllers/geoLocationController.js';

const router = express.Router();

router.get('/geoinfo/:ip', getGeoLocation);
router.post('/geoinfo', addGeoLocation);
router.get('/history', getHistory);
router.delete('/history', deleteHistories);
router.get('/geoinfo/user', getUserGeoLocation);

export default router;
