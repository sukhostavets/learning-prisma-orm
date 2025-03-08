import request from 'supertest';
import { seedDatabase, clearDatabase, app } from '../setup';

describe('Post API Endpoints', () => {
  let testData: any;

  // Seed the database before tests
  beforeAll(async () => {
    testData = await seedDatabase();
  });

  // Clear the database after tests
  afterAll(async () => {
    await clearDatabase();
  });

  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      const response = await request(app).get('/api/posts');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
      
      // Check if the response contains the expected posts
      const titles = response.body.map((post: any) => post.title);
      expect(titles).toContain('First Post');
      expect(titles).toContain('Second Post');
      expect(titles).toContain('Draft Post');
    });

    it('should filter posts by published status', async () => {
      const response = await request(app).get('/api/posts?published=true');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      
      // All returned posts should be published
      response.body.forEach((post: any) => {
        expect(post.published).toBe(true);
      });
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return a post by ID', async () => {
      const postId = testData.posts[0].id;
      const response = await request(app).get(`/api/posts/${postId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(postId);
      expect(response.body.title).toBe('First Post');
      expect(response.body.content).toBe('This is the first test post content.');
      expect(response.body.published).toBe(true);
      
      // Check author information
      expect(response.body.author).toBeDefined();
      expect(response.body.author.name).toBe('John Doe');
      
      // Check comments
      expect(Array.isArray(response.body.comments)).toBe(true);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app).get('/api/posts/9999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Post not found');
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const newPost = {
        title: 'Test Post',
        content: 'This is a test post content.',
        published: true,
        authorId: testData.users[0].id,
      };

      const response = await request(app)
        .post('/api/posts')
        .send(newPost);
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newPost.title);
      expect(response.body.content).toBe(newPost.content);
      expect(response.body.published).toBe(newPost.published);
      expect(response.body.authorId).toBe(newPost.authorId);
    });

    it('should return 404 for non-existent author', async () => {
      const newPost = {
        title: 'Test Post',
        content: 'This is a test post content.',
        published: true,
        authorId: 9999, // Non-existent author
      };

      const response = await request(app)
        .post('/api/posts')
        .send(newPost);
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Author not found');
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update a post', async () => {
      const postId = testData.posts[1].id;
      const updatedData = {
        title: 'Updated Post Title',
        content: 'Updated content for the post.',
        published: false,
      };

      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .send(updatedData);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(postId);
      expect(response.body.title).toBe(updatedData.title);
      expect(response.body.content).toBe(updatedData.content);
      expect(response.body.published).toBe(updatedData.published);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .put('/api/posts/9999')
        .send({ title: 'Updated Title' });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Post not found');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post', async () => {
      const postId = testData.posts[2].id;

      const response = await request(app)
        .delete(`/api/posts/${postId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Post deleted successfully');

      // Verify the post is deleted
      const getResponse = await request(app).get(`/api/posts/${postId}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .delete('/api/posts/9999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Post not found');
    });
  });
}); 
