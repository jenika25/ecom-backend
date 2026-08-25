const bcrypt = require("bcrypt");
const SALT_ROUNDS = Number.parseInt(process.env.SALT_ROUNDS, 10) || 10;

const hashPassword = async (plain) =>
    await bcrypt.hash(plain, SALT_ROUNDS);

const verifyPassword = async (plain, hash) =>
    await bcrypt.compare(plain, hash);

module.exports = {
    hashPassword,
    verifyPassword,
};
