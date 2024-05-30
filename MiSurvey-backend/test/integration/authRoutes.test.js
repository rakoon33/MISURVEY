const supertest = require('supertest');
const app = require('../../server');
const expect = require('chai').expect;

describe('Authentication Routes', function() {
  describe('POST /api/login', function() {
    it('should authenticate user and return token', function(done) {
      supertest(app)
        .post('/api/login')
        .send({ username: 'testuser', password: 'password123' })
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.have.property('status', true);
          expect(res.body).to.have.property('message', 'User login successful');
          expect(res.headers).to.have.property('set-cookie');
          done(err);
        });
    });

    it('should return 400 for invalid credentials', function(done) {
      supertest(app)
        .post('/api/login')
        .send({ username: 'testuser', password: 'wrongpassword' })
        .expect(400, done);
    });
  });

  describe('POST /api/logout', function() {
    it('should log out a user and clear the session cookie', function(done) {
      supertest(app)
        .post('/api/logout')
        .expect(200)
        .end(function(err, res) {
          expect(res.headers['set-cookie'][0]).to.include('jwt=;');
          done(err);
        });
    });
  });

  describe('POST /api/register', function() {
    it('should register a user', function(done) {
      supertest(app)
        .post('/api/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          companyName: 'NewCo',
          email: 'john.doe@example.com',
          username: 'johndoe',
          password: 'password123'
        })
        .expect(201)
        .end(function(err, res) {
          expect(res.body).to.have.property('status', true);
          expect(res.body).to.have.property('message', 'Registration successful');
          done(err);
        });
    });
  });

  describe('GET /api/checkpermissions/:userId', function() {
    it('should retrieve permissions for a specific user', function(done) {
      supertest(app)
        .get('/api/checkpermissions/1') // Assuming '1' is a valid user ID
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.have.property('userDetails');
          expect(res.body.permissions).to.be.an('array');
          done(err);
        });
    });
  });
});
