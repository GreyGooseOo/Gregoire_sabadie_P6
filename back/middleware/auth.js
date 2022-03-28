//appel des plugins pour le bon fonctionnement du middleware
const jwt = require('jsonwebtoken');
require('dotenv').config();

//vérifacation du token pour validation de l'authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_JWT);
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw res.status(403).json({ error: 'unauthorized request' });
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};