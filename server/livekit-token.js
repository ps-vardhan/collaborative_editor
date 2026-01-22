const { AccessToken } = require('livekit-server-sdk');
const dotenv = require('dotenv');
dotenv.config();

const createToken = async (roomName, participantName) => {
    const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
            identity: participantName,
        },
    );
    at.addGrant({ roomJoin: true, roomName: roomName });
    return await at.toJwt();
};

module.exports = { createToken };