const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');

chai.should();

chai.use(chaiHttp);

const server = 'http://localhost:5000/api/users/';


// test for login
describe('POST /login', () => {
    it('it should return success: true, message :"Login Successful", and token', (done) => {
        const user = {
            email: 'loyd@gmail.com',
            password: 'diabolic22'
        }
        chai
            .request(server)
            .post('/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('message').eql('Login successful');
                res.body.should.have.property('token');
                done(err);
            });
    });
});

// test for failed login
describe('POST /login', () => {
    it('it should return Email is invalid ', (done) => {
        const user = {
            email: 'loydmail.com',
            password: 'diabolic22'
        }
        chai
            .request(server)
            .post('/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('email').eql('Email is invalid');
                done(err);
            });
    });
});

describe('POST /login', () => {
    it('it should return password incorrect ', (done) => {
        const user = {
            email: 'loyd@gmail.com',
            password: 'diabolic2',
        }
        chai
            .request(server)
            .post('/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('password').eql('Password is incorrect');
                done(err);
            });
    });
});

describe('POST /login', () => {
    it('it should return email not found ', (done) => {
        const user = {
            email: 'loyd22@gmail.com',
            password: 'diabolic2'
        }
        chai
            .request(server)
            .post('/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('email').eql('User not found');
                done(err);
            });
    });
});

// test for register
describe('POST /register', () => {
    it('it should return success: false, message :"Email already exists"', (done) => {
        const user = {
            firstName: 'Loyd',
            lastName: 'Mwenda',
            email: 'mwenda@gmail.com',
            password: 'diabolic22',
            confirmPassword: 'diabolic22'
        }
        chai
            .request(server)
            .post('/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('email').eql('Email already exists');
                done(err);
            });
    });
});
// test for register
describe('POST /register', () => {
    it('it should return success: false, message password at least 6 character.', (done) => {
        const user = {
            firstName: 'Loyd',
            lastName: 'Mwenda',
            email: 'mwendaloyd@gmail.com',
            password: 'dia',
            confirmPassword: 'dia'
        }
        chai
            .request(server)
            .post('/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('password').eql('Password must be at least 6 characters');
                done(err);
            });
    });
});

// accessing id without token should return error
describe('GET /users/:id', () => {
    it('it should return error auth failed', (done) => {
        chai
            .request(server)
            .get('/hnGpxuPp7VpMbBhpilEi')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message').eql('Auth failed');
                done(err);
            });
    });
});
describe('GET /users/:id', () => {
    it('it should return user data', (done) => {
        const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTG95ZCIsImVtYWlsIjoibG95ZEBnbWFpbC5jb20iLCJpYXQiOjE2NTM4NjYxMzksImV4cCI6MTY1Mzg2ODI5NH0.25Dxrnb4JPyQFkIk4eKtdqAPSoaA_Sef0npl6QUhoIA'
        chai
            .request(server)
            .get('/hnGpxuPp7VpMbBhpilEi')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('message').eql('User found');
                done(err);
            });
    });
});

// test for register
describe('POST /register', () => {
    it('it should return success: true, message :"User created successfully"', (done) => {
        const user = {
            firstName: 'Alfaro',
            lastName: 'Mwenda',
            email: 'alfaro@gmail.com',
            password: 'diabolic22',
            confirmPassword: 'diabolic22'
        }
        chai
            .request(server)
            .post('/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('message').eql('User created successfully');
                done(err);
            });
    });
});

//test for update user
describe('PATCH /users/:id', () => {
    it('it should return success: true, message :"User updated successfully"', (done) => {
        const user = {
            firstName: 'Anya',
            lastName: 'Forger',
            email: 'anya@gmail.com',
            password: 'diabolic22'
        }
        const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTG95ZCIsImVtYWlsIjoibG95ZEBnbWFpbC5jb20iLCJpYXQiOjE2NTM4NjYxMzksImV4cCI6MTY1Mzg2ODI5NH0.25Dxrnb4JPyQFkIk4eKtdqAPSoaA_Sef0npl6QUhoIA'
        chai 
            .request(server)
            .patch('/hnGpxuPp7VpMbBhpilEi')
            .auth(token, { type: 'bearer' })
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                done(err);
            }
        );
    });
});

