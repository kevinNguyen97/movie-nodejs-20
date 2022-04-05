const { decodeToken } = require('../../services/auth');
const { getUserById } = require('../../services/users');

const authenticate = async (req, res, next) => {
  try {
    // const token = req.header('Authorization').split(' ')[1];
    const token = req.header('Authorization').replace('Bearer ', '');

    const data = decodeToken(token);
    const user = await getUserById(data.id);

    if (!user) {
      return res.status(401).send('invalid token');
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(500).send('server errors');
  }
};

// const checkRole = (role) => {
//   const handler = (req, res, next) => {
//     const user = req.user;

//     if (user.role !== role) {
//       return res.status(401).send('can not access');
//     }
//     next();
//   };
//   return handler;
// };

const checkRole = (role) => (req, res, next) => {
  const user = req.user;

  if (user.role !== role) {
    return res.status(401).send('can not access');
  }
  next();
};

module.exports = {
  authenticate,
  checkRole,
};
