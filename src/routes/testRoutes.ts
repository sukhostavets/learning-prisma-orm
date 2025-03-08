import express from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Testing
 *   description: Testing utilities API
 */

/**
 * @swagger
 * /api/test/seed:
 *   post:
 *     summary: Seed the database with test data
 *     tags: [Testing]
 *     responses:
 *       200:
 *         description: Database seeded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                     posts:
 *                       type: array
 *                     comments:
 *                       type: array
 */
router.post('/seed', async (req, res) => {
  try {
    // Clear existing data
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});

    // Create test users
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'john@example.com',
          name: 'John Doe',
          password: await bcrypt.hash('password123', 10),
        },
      }),
      prisma.user.create({
        data: {
          email: 'jane@example.com',
          name: 'Jane Smith',
          password: await bcrypt.hash('password123', 10),
        },
      }),
      prisma.user.create({
        data: {
          email: 'bob@example.com',
          name: 'Bob Johnson',
          password: await bcrypt.hash('password123', 10),
        },
      }),
    ]);

    // Create test posts
    const posts = await Promise.all([
      prisma.post.create({
        data: {
          title: 'First Post',
          content: 'This is the first test post content.',
          published: true,
          authorId: users[0].id,
        },
      }),
      prisma.post.create({
        data: {
          title: 'Second Post',
          content: 'This is the second test post content.',
          published: true,
          authorId: users[1].id,
        },
      }),
      prisma.post.create({
        data: {
          title: 'Draft Post',
          content: 'This is a draft post that is not published yet.',
          published: false,
          authorId: users[0].id,
        },
      }),
    ]);

    // Create test comments
    const comments = await Promise.all([
      prisma.comment.create({
        data: {
          content: 'Great post!',
          postId: posts[0].id,
          authorId: users[1].id,
        },
      }),
      prisma.comment.create({
        data: {
          content: 'I learned a lot from this.',
          postId: posts[0].id,
          authorId: users[2].id,
        },
      }),
      prisma.comment.create({
        data: {
          content: 'Looking forward to more content like this!',
          postId: posts[1].id,
          authorId: users[0].id,
        },
      }),
    ]);

    res.json({
      message: 'Database seeded successfully',
      data: {
        users,
        posts,
        comments,
      },
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

/**
 * @swagger
 * /api/test/clear:
 *   post:
 *     summary: Clear all data from the database
 *     tags: [Testing]
 *     responses:
 *       200:
 *         description: Database cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/clear', async (req, res) => {
  try {
    // Clear all data
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});

    res.json({ message: 'Database cleared successfully' });
  } catch (error) {
    console.error('Error clearing database:', error);
    res.status(500).json({ error: 'Failed to clear database' });
  }
});

export default router; 
