import express from 'express';
import { checkAuth } from '../checkAuth.js';
import { meetingValidation } from '../validations.js';
import {createMeeting,getMeetings} from '../controllers/meetingController.js';

const router_meeting = express.Router();

router_meeting.post('/',checkAuth,meetingValidation,createMeeting);
router_meeting.get('',getMeetings)

export default router_meeting