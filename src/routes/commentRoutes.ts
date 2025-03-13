import express from 'express'
import { Context } from '../prepareContext'

export const getCommentRouter = (context: Context) => {
  const router = express.Router()
  const { prisma } = context

  /**
   * @swagger
   * components:
   *   schemas:
   *     Comment:
   *       type: object
   *       required:
   *         - content
   *         - postId
   *         - authorId
   *       properties:
   *         id:
   *           type: integer
   *           description: The auto-generated id of the comment
   *         content:
   *           type: string
   *           description: The content of the comment
   *         postId:
   *           type: integer
   *           description: The id of the post
   *         authorId:
   *           type: integer
   *           description: The id of the author
   *         createdAt:
   *           type: string
   *           format: date-time
   *           description: The date the comment was created
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           description: The date the comment was last updated
   *       example:
   *         id: 1
   *         content: This is a great post!
   *         postId: 1
   *         authorId: 2
   *         createdAt: 2023-01-01T00:00:00.000Z
   *         updatedAt: 2023-01-01T00:00:00.000Z
   */

  /**
   * @swagger
   * tags:
   *   name: Comments
   *   description: Comment management API
   */

  /**
   * @swagger
   * /api/comments:
   *   get:
   *     summary: Returns the list of all comments
   *     tags: [Comments]
   *     parameters:
   *       - in: query
   *         name: postId
   *         schema:
   *           type: integer
   *         description: Filter by post ID
   *     responses:
   *       200:
   *         description: The list of comments
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Comment'
   */
  router.get('/', async (req, res) => {
    try {
      const { postId } = req.query

      const where: any = {}
      if (postId) {
        where.postId = Number(postId)
      }

      const comments = await prisma.comment.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      })

      res.json(comments)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments' })
    }
  })

  /**
   * @swagger
   * /api/comments/{id}:
   *   get:
   *     summary: Get a comment by id
   *     tags: [Comments]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The comment id
   *     responses:
   *       200:
   *         description: The comment description by id
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *       404:
   *         description: The comment was not found
   */
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params
      const comment = await prisma.comment.findUnique({
        where: { id: Number(id) },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      })

      if (!comment) {
        res.status(404).json({ error: 'Comment not found' })
        return
      }

      res.json(comment)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comment' })
    }
  })

  /**
   * @swagger
   * /api/comments:
   *   post:
   *     summary: Create a new comment
   *     tags: [Comments]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - content
   *               - postId
   *               - authorId
   *             properties:
   *               content:
   *                 type: string
   *               postId:
   *                 type: integer
   *               authorId:
   *                 type: integer
   *     responses:
   *       201:
   *         description: The comment was successfully created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *       400:
   *         description: Invalid input
   *       404:
   *         description: Post or Author not found
   */
  router.post('/', async (req, res) => {
    try {
      const { content, postId, authorId } = req.body

      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: Number(postId) },
      })

      if (!post) {
        res.status(404).json({ error: 'Post not found' })
        return
      }

      // Check if author exists
      const author = await prisma.user.findUnique({
        where: { id: Number(authorId) },
      })

      if (!author) {
        res.status(404).json({ error: 'Author not found' })
        return
      }

      // Create comment
      const comment = await prisma.comment.create({
        data: {
          content,
          postId: Number(postId),
          authorId: Number(authorId),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      })

      res.status(201).json(comment)
    } catch (error) {
      res.status(400).json({ error: 'Failed to create comment' })
    }
  })

  /**
   * @swagger
   * /api/comments/{id}:
   *   put:
   *     summary: Update a comment by id
   *     tags: [Comments]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The comment id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               content:
   *                 type: string
   *     responses:
   *       200:
   *         description: The comment was updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *       404:
   *         description: The comment was not found
   *       400:
   *         description: Invalid input
   */
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params
      const { content } = req.body

      // Check if comment exists
      const existingComment = await prisma.comment.findUnique({
        where: { id: Number(id) },
      })

      if (!existingComment) {
        res.status(404).json({ error: 'Comment not found' })
        return
      }

      // Update comment
      const comment = await prisma.comment.update({
        where: { id: Number(id) },
        data: {
          content,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      })

      res.json(comment)
    } catch (error) {
      res.status(400).json({ error: 'Failed to update comment' })
    }
  })

  /**
   * @swagger
   * /api/comments/{id}:
   *   delete:
   *     summary: Delete a comment by id
   *     tags: [Comments]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The comment id
   *     responses:
   *       200:
   *         description: The comment was deleted
   *       404:
   *         description: The comment was not found
   */
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params

      // Check if comment exists
      const existingComment = await prisma.comment.findUnique({
        where: { id: Number(id) },
      })

      if (!existingComment) {
        res.status(404).json({ error: 'Comment not found' })
        return
      }

      // Delete comment
      await prisma.comment.delete({
        where: { id: Number(id) },
      })

      res.json({ message: 'Comment deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete comment' })
    }
  })

  return router
}
