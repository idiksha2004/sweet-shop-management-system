import request from 'supertest';
import { getConnection } from 'typeorm';
import app from '../src/app';
import { User } from '../src/models/User';
import { Sweet } from '../src/models/Sweet';

describe('Sweet API', () => {
  let adminToken: string;
  let userToken: string;
  let testSweet: Sweet;

  beforeAll(async () => {
    // Create test users
    const userRepository = getConnection().getRepository(User);
    
    // Create admin user
    const admin = userRepository.create({
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.hashPassword();
    await userRepository.save(admin);

    // Create regular user
    const user = userRepository.create({
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    await user.hashPassword();
    await userRepository.save(user);

    // Login to get tokens
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    adminToken = adminLogin.body.data.token;

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'user123' });
    userToken = userLogin.body.data.token;
  });

  afterAll(async () => {
    // Clean up test data
    await getConnection().dropDatabase();
    await getConnection().close();
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet (admin only)', async () => {
      const newSweet = {
        name: 'Chocolate Bar',
        description: 'Delicious milk chocolate',
        price: 2.99,
        quantity: 100,
        category: 'Chocolate'
      };

      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newSweet);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe(newSweet.name);
      
      // Save for later tests
      testSweet = res.body.data;
    });

    it('should return 403 for non-admin users', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Forbidden Sweet',
          price: 1.99,
          quantity: 50,
          category: 'Candy'
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets', async () => {
      const res = await request(app).get('/api/sweets');
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should filter sweets by category', async () => {
      const res = await request(app)
        .get('/api/sweets')
        .query({ category: 'Chocolate' });

      expect(res.status).toBe(200);
      expect(res.body.data.every((s: any) => 
        s.category.toLowerCase() === 'chocolate'
      )).toBe(true);
    });
  });

  describe('GET /api/sweets/:id', () => {
    it('should get a sweet by id', async () => {
      const res = await request(app)
        .get(`/api/sweets/${testSweet.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(testSweet.id);
    });

    it('should return 404 for non-existent sweet', async () => {
      const res = await request(app)
        .get('/api/sweets/non-existent-id');

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    it('should update a sweet (admin only)', async () => {
      const updates = {
        name: 'Updated Chocolate Bar',
        price: 3.49
      };

      const res = await request(app)
        .put(`/api/sweets/${testSweet.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(updates.name);
      expect(res.body.data.price).toBe(updates.price);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should reduce sweet quantity', async () => {
      const purchase = { quantity: 5 };
      const initialQuantity = testSweet.quantity;

      const res = await request(app)
        .post(`/api/sweets/${testSweet.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchase);

      expect(res.status).toBe(200);
      expect(res.body.data.quantity).toBe(initialQuantity - purchase.quantity);
    });

    it('should not allow purchasing more than available', async () => {
      const res = await request(app)
        .post(`/api/sweets/${testSweet.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1000 });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    it('should increase sweet quantity (admin only)', async () => {
      const restock = { quantity: 20 };
      const beforeRestock = (await request(app).get(`/api/sweets/${testSweet.id}`)).body.data;

      const res = await request(app)
        .post(`/api/sweets/${testSweet.id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restock);

      expect(res.status).toBe(200);
      expect(res.body.data.quantity).toBe(beforeRestock.quantity + restock.quantity);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    it('should delete a sweet (admin only)', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${testSweet.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);

      // Verify sweet is deleted
      const getRes = await request(app).get(`/api/sweets/${testSweet.id}`);
      expect(getRes.status).toBe(404);
    });
  });
});