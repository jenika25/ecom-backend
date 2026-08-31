import { ROLES } from './roles.js';
export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'user:read:any', 'user:manage:any',
    'product:read', 'product:create', 'product:update:any', 'product:delete:any',
    'category:manage', 'brand:manage', 'banner:manage',
    // An admin is also a person who can shop. Day 7 needs these.
    'cart:manage:own', 'wishlist:manage:own',
    'order:create', 'order:read:own', 'order:read:any',
    'return:create:own', 'return:manage:any',
    'dashboard:admin',
  ],

  [ROLES.SELLER]: [
    'user:read:own', 'user:manage:own',
    'product:read', 'product:create', 'product:update:own', 'product:delete:own',
    'cart:manage:own', 'wishlist:manage:own',
    'order:create', 'order:read:own',
    'return:create:own', 'return:manage:own',
    'dashboard:seller',
  ],

  [ROLES.USER]: [
    'user:read:own', 'user:manage:own',
    'product:read',
    'cart:manage:own', 'wishlist:manage:own',
    'order:create', 'order:read:own',
    'return:create:own',
  ],
};

export const hasPermission = (role, required) => {
  const granted = PERMISSIONS[role] ?? [];
  return (
    granted.includes(required) ||
    granted.includes(`${required}:own`) ||
    granted.includes(`${required}:any`)
  );
};