const request = require('supertest');
const app = require('../index');
const agent = request.agent(app);

describe('toDoList tests', () => {

    it('first request', done => {
        agent.get('/').expect(200).end((err, res) => {
            if (err) { return done(err); }
            else {
                // console.log('res.headers', res.headers);
                // console.log('res.body', res.body)
                done();
            }
        });
    });

    describe('POST /signup', () => {
        test('signup success', async (done) => {
            const response = await request(app).post('/signup').send({
                email: 'praconfi@gmail.com',
                username: 'neda',
                password: 'dksld'
            })
            expect(response.status).toBe(200);
            expect(response.body).not.toBe(undefined);
            done();
        })
    })

    describe('POST /login', () => {
        test('login success', async (done) => {
            const response = await request(app).post('/login').send({
                "email": "praconfi@gmail.com",
                "password": "dksld",
            })
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', 'email', 'username');
            done();
        }, 30000);
    })
    describe('POST /login', () => {
        test('login unauthorized', async (done) => {
            const response = await request(app).post('/login').send({
                "email": "pppppp@gmail.com",
                "password": "dksld",
            })
            expect(response.status).toBe(401);
            expect(response.body).toStrictEqual({ error: '401 Unauthorized' });
            done();
        }, 30000);
    })

    describe('POST /logout', () => {
        test('logout success', async (done) => {
            const response = await request(app).post('/logout')
            expect(response.status).toBe(400);
            done();
        }, 30000);
    })

})
