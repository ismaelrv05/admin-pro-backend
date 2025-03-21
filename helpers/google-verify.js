const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID_SECRET);

async function googleVerify( token ) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_ID,  

  });
  const payload = ticket.getPayload();
  const { name, email, picture } = payload;
  return { name, email, picture };

  return payload;
}


module.exports = {
  googleVerify,
}   