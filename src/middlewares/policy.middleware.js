const apiError = require('../utils/apiError');
const RETURN_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

const sameId = (a, b) => String(a) === String(b);

const POLICIES = {
  User: {
    read: (actor, target) =>
      actor.role === 'admin' ||
      sameId(actor._id, target._id) ||
      'This profile is not yours',

    manage: (actor, target) => {
      if (sameId(actor._id, target._id)) return 'You cannot block or delete your own account';
      if (target.role === 'admin') return 'An admin account cannot be modified from here';
      return true;
    },
  },

  Product: {
    update: (actor, product) =>
      actor.role === 'admin' ||
      sameId(product.seller, actor._id) ||
      'You can only edit your own products',

    delete: (actor, product) =>
      actor.role === 'admin' ||
      sameId(product.seller, actor._id) ||
      'You can only remove your own products',
  },

  Order: {
    read: (actor, order) =>
      actor.role === 'admin' ||
      sameId(order.user, actor._id) ||
      (actor.role === 'seller' && order.items.some((item) => sameId(item.seller, actor._id))) ||
      'This order is not yours',

    cancel: (actor, order) =>
      actor.role === 'admin' ||
      sameId(order.user, actor._id) ||
      'This order is not yours',

    fulfil: (actor, order) =>
      actor.role === 'admin' ||
      order.items.some((item) => sameId(item.seller, actor._id)) ||
      'None of the items in this order are yours',

    createReturn: (actor, order, req) => {
      if (!sameId(order.user, actor._id)) return 'This order is not yours';

      const item = order.items.id(req.params.itemId);
      if (!item) return 'That item is not in this order';

      if (item.status !== 'delivered') return 'Only a delivered item can be returned';
      if (item.returnRequested) return 'A return has already been raised for this item';
      if (!item.deliveredAt) return 'This item has no delivery date yet';

      const elapsed = Date.now() - new Date(item.deliveredAt).getTime();
      if (elapsed > RETURN_WINDOW_MS) {
        return 'The 2-day return window for this item has closed';
      }

      return true;
    },
  },

  Return: {
    read: (actor, ret) =>
      actor.role === 'admin' ||
      sameId(ret.user, actor._id) ||
      sameId(ret.seller, actor._id) ||
      'This return is not yours',

    // Only the seller of the returned product may move it forward.
    manage: (actor, ret) =>
      actor.role === 'admin' ||
      sameId(ret.seller, actor._id) ||
      'This return is for another seller\'s product',
  },
};

const policy = (action, model) => (req, _res, next) => {
  const rule = POLICIES[model]?.[action];
  if (!rule) throw apiError(500, `No policy defined for ${model}.${action}`);

  // loadResource must have run before this middleware.
  if (!req.resource) throw apiError(500, `policy('${action}','${model}') ran without loadResource`);

  const verdict = rule(req.user, req.resource, req);
  if (verdict !== true) {
    throw apiError(403, typeof verdict === 'string' ? verdict : 'Forbidden');
  }

  next();
};

module.exports = { policy, POLICIES };