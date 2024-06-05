const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.login = async (req, res, next) => {
    const emailId = req.body.emailId;
    const password = req.body.password;
};