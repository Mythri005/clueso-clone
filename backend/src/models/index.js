// This file exports all Prisma models for easier imports
const { prisma } = require('../config/database');

module.exports = {
  User: prisma.user,
  Project: prisma.project,
  Video: prisma.video
};