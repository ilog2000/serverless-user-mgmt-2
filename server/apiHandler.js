const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Repository = require('./db/repository.js');
const util = require('./util.js');

const repo = new Repository('users');

function setPermissions(role) {
  switch (role.toLowerCase()) {
    case 'admin':
      return ['C', 'R', 'U', 'D'];
    case 'developer':
      return ['C', 'R', 'U'];
    case 'editor':
      return ['R'];
    case 'none':
    default:
      return [];
  }
}

async function authorized(event, context) {
  const auth = event.headers['authorization'] || event.headers['Authorization'];
  if (!auth) {
    return false;
  }
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return false;
  }

  const token = parts[1];
  const decoded = jwt.decode(token);
  const id = decoded.id;
  const record = await repo.getById(id);
  context.user = {
    id: id,
    role: record.Item.role,
    permissions: setPermissions(record.Item.role)
  };

  return true;
}

module.exports.getUsers = async (event, context) => {
  if (!await authorized(event, context)) {
    return util.errorResponse(401, 'Not authenticated');
  }

  if (!context.user || !context.user.permissions.includes('R')) {
    return util.errorResponse(403, 'Forbidden');
  }

  try {
    const result = await repo.getAll();
    return util.successResponse(result);
  } catch (err) {
    return util.errorResponse(500, err.message);
  }
};

module.exports.getUser = async (event, context) => {
  if (!await authorized(event, context)) {
    return util.errorResponse(401, 'Not authenticated');
  }

  if (!context.user || !context.user.permissions.includes('R')) {
    return util.errorResponse(403, 'Forbidden');
  }
  
  const id = event.pathParameters.id;

  try {
    const result = await repo.getById(id);
    return util.successResponse(result);
  } catch (err) {
    return util.errorResponse(500, err.message);
  }
};

module.exports.postUser = async (event, context) => {
  if (!await authorized(event, context)) {
    return util.errorResponse(401, 'Not authenticated');
  }

  if (!context.user || !context.user.permissions.includes('C')) {
    return util.errorResponse(403, 'Forbidden');
  }
  
  const user = JSON.parse(event.body);

  try {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);
    user.password_hash = hash;
    delete user.password;
    user.picture = `${process.env.IMG_URL}/${user.picture}`;

    const result = await repo.put(user);
    return util.successResponse(result);
  } catch (err) {
    return util.errorResponse(500, err.message);
  }
};

module.exports.putUser = async (event, context) => {
  if (!await authorized(event, context)) {
    return util.errorResponse(401, 'Not authenticated');
  }

  const id = event.pathParameters.id;

  if (!context.user || (!context.user.permissions.includes('U') && context.user.id !== id)) {
    return util.errorResponse(403, 'Forbidden');
  }
  
  const user = JSON.parse(event.body);

  try {
    const expression = 'set picture = :picture, #role = :role, active = :active';
    const values = { ':picture': user.picture, ':role': user.role, ':active': user.active };
    const names = { '#role': 'role' };

    const result = await repo.update(id, expression, values, names);
    return util.successResponse(result);
  } catch (err) {
    return util.errorResponse(500, err.message);
  }
};

module.exports.deleteUser = async (event, context) => {
  if (!await authorized(event, context)) {
    return util.errorResponse(401, 'Not authenticated');
  }

  if (!context.user || !context.user.permissions.includes('D')) {
    return util.errorResponse(403, 'Forbidden');
  }

  const id = event.pathParameters.id;

  try {
    const result = await repo.delete(id);
    return util.successResponse(result);
  } catch (err) {
    return util.errorResponse(500, err.message);
  }
};
