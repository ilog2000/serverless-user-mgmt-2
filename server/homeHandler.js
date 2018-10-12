const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Repository = require('./db/repository.js');
const util = require('./util.js');

const repo = new Repository('users');

module.exports.ping = async () => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: new Date().toLocaleString(),
  };
};

module.exports.register = async (event) => {
  const user = JSON.parse(event.body);

  if (!user.email || !user.password) {
    return util.errorResponse(500, 'Email & password cannot be empty');
  }

  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(user.password, salt);
  user.password_hash = hash;
  delete user.password;
  user.picture = `${process.env.IMG_URL}/unknown.png`;
  user.role = 'none';
  user.active = false;

  try {
    const newUser = await repo.put(user);

    return util.successResponse(newUser);
  } catch (err) {
    return util.errorResponse(500, err.message);
  }
};

module.exports.login = async (event) => {
  // console.log(JSON.stringify(event, null, 2));
  // console.log(JSON.stringify(context, null, 2));

  const body = JSON.parse(event.body);
  if (!body.email || !body.password) {
    return util.errorResponse(500, 'Email & password cannot be empty');
  }

  try {
    const result = await repo.findByField('email', body.email);
    if (result.Items.length === 0) {
      return util.errorResponse(500, 'Invalid credentials');
    }

    const dbUser = result.Items[0];
    const valid = await bcrypt.compare(body.password, dbUser.password_hash);
    if (!valid) {
      return util.errorResponse(500, 'Invalid credentials');
    }

    const token = jwt.sign(
      { id: dbUser.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return util.successResponse({ token });
  } catch (err) {
    return util.errorResponse(500, err.message);
  }
};

module.exports.refreshToken = async (event) => {
  const auth = event.headers['authorization'] || event.headers['Authorization'];
  if (!auth) {
    return util.errorResponse(500, 'Invalid access token');
  }
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return util.errorResponse(500, 'Invalid access token');
  }

  try {
    const decoded = jwt.decode(parts[1]);
    const id = decoded.id;
    const user = await repo.getById(id);
    if (!user) {
      return util.errorResponse(500, 'Invalid access token');
    }

    const token = jwt.sign(
      { id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return util.successResponse({ token });
  } catch (err) {
    return util.errorResponse(500, err.message);
  }
};

module.exports.changePassword = async (event) => {
  const { id, oldpassword, newpassword } = JSON.parse(event.body);

  if (!id || !oldpassword || !newpassword) {
    return util.errorResponse(500, 'Invalid parameters');
  }

  try {
    const result = await repo.getById(id);
    if (!result.Item) {
      return util.errorResponse(500, 'Invalid parameters');
    }

    const dbUser = result.Item;
    const valid = await bcrypt.compare(oldpassword, dbUser.password_hash);
    if (!valid) {
      return util.errorResponse(500, 'Invalid parameters');
    }

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(newpassword, salt);
    const expression = 'set password_hash = :hash';
    const values = { ':hash': hash };
    const result2 = await repo.update(id, expression, values);


    return util.successResponse(result2);
  } catch (err) {
    return util.errorResponse(500, err.message);
  }
};

