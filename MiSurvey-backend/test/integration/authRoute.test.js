const supertest = require('supertest');
const app = require('../../app');
const chai = require('chai');
const expect = chai.expect;

describe('Authentication Routes', function() {
    describe('POST /api/login', function() {
        it('should authenticate user and return token', function(done) {
        supertest(app)
            .post('/api/login')
            .send({ username: 'admin1', password: 'Admin123#' })
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
            const uniqueSuffix = Date.now();
            const userData = {
                firstName: 'Test',
                lastName: 'User',
                companyName: 'TestCompany',
                email: `testuser${uniqueSuffix}@example.com`,
                username: `testuser${uniqueSuffix}`,
                password: 'password123'
            };
            supertest(app)
            .post('/api/register')
            .send(userData)
            .expect(201)
            .end(function(err, res) {
                expect(res.body).to.have.property('status', true);
                expect(res.body).to.have.property('message', 'Registration successful');
                done(err);
            });
        });
    });

    describe('GET /api/getPermissions/:userId', function() {
        it('should retrieve permissions for a specific user', function(done) {
        supertest(app)
            .get('/api/getPermissions/2')
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.have.property('companyUserId');
                expect(res.body.permissions).to.be.an('array');
                done(err);
            });
        });
    });
});
