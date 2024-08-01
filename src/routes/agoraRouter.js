import express from 'express';
import dotenv from 'dotenv';

// Import the CommonJS module using the default import syntax
import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } = pkg;

dotenv.config();
const { APP_ID, APP_CERTIFICATE } = process.env;

const router = express.Router();

// Middleware to set no-cache headers
const nocache = (_, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
};

// Route handler for ping
const ping = (req, resp) => resp.send({ message: 'pong' });

// Route handler for test
const test = (req, resp) => resp.send({ message: 'Welcome to astropush agora server' });

// Route handler to generate RTC token
const generateRTCToken = (req, resp) => {
    console.log("generateRTCToken", {
        channel: req.params.channel,
        uid: req.params.uid,
        role: req.params.role,
        tokentype: req.params.tokentype,
        APP_ID,
        APP_CERTIFICATE,
    });

    // Set response header
    resp.header('Access-Control-Allow-Origin', '*');

    // Get channel name
    const channelName = req.params.channel;
    if (!channelName) {
        return resp.status(400).json({ error: 'channel is required' });
    }

    // Get uid
    const uid = req.params.uid;
    if (!uid || uid === '') {
        return resp.status(400).json({ error: 'uid is required' });
    }

    // Get role
    const role = req.params.role === 'publisher' ? RtcRole.PUBLISHER : 
                  req.params.role === 'audience' ? RtcRole.SUBSCRIBER : 
                  null;
    if (!role) {
        return resp.status(400).json({ error: 'role is incorrect' });
    }

    // Get the expire time
    let expireTime = req.query.expiry;
    expireTime = expireTime ? parseInt(expireTime, 10) : 36000;

    // Calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    // Build the token
    let token;
    if (req.params.tokentype === 'userAccount') {
        token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    } else if (req.params.tokentype === 'uid') {
        token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    } else {
        return resp.status(400).json({ error: 'token type is invalid' });
    }

    // Return the token
    return resp.json({ rtcToken: token });
};

// Route handler to generate RTM token
const generateRTMToken = (req, resp) => {
    // Set response header
    resp.header('Access-Control-Allow-Origin', '*');

    // Get uid
    const uid = req.params.uid;
    if (!uid || uid === '') {
        return resp.status(400).json({ error: 'uid is required' });
    }

    // Get role
    const role = RtmRole.Rtm_User;

    // Get the expire time
    let expireTime = req.query.expiry;
    expireTime = expireTime ? parseInt(expireTime, 10) : 3600;

    // Calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    // Build the token
    console.log(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpireTime);
    const token = RtmTokenBuilder.buildToken(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpireTime);

    // Return the token
    return resp.json({ rtmToken: token });
};

// Route handler to generate RTC and RTM tokens
const generateRTEToken = (req, resp) => {
    // Set response header
    resp.header('Access-Control-Allow-Origin', '*');

    // Get channel name
    const channelName = req.params.channel;
    if (!channelName) {
        return resp.status(400).json({ error: 'channel is required' });
    }

    // Get uid
    const uid = req.params.uid;
    if (!uid || uid === '') {
        return resp.status(400).json({ error: 'uid is required' });
    }

    // Get role
    const role = req.params.role === 'publisher' ? RtcRole.PUBLISHER : 
                  req.params.role === 'audience' ? RtcRole.SUBSCRIBER : 
                  null;
    if (!role) {
        return resp.status(400).json({ error: 'role is incorrect' });
    }

    // Get the expire time
    let expireTime = req.query.expiry;
    expireTime = expireTime ? parseInt(expireTime, 10) : 3600;

    // Calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    // Build the tokens
    const rtcToken = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    const rtmToken = RtmTokenBuilder.buildToken(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpireTime);

    // Return the tokens
    return resp.json({ rtcToken, rtmToken });
};

// Define routes
router.get('/', nocache, test);
router.get('/ping', nocache, ping);
router.get('/rtc/:channel/:role/:tokentype/:uid', nocache, generateRTCToken);
router.get('/rtm/:uid/', nocache, generateRTMToken);
router.get('/rte/:channel/:role/:tokentype/:uid', nocache, generateRTEToken);

export default router;
