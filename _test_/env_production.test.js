const request = require('supertest')
const app = require('../app').server
const { sequelize } = require('../models')
let friendships = require('./data/friendships.json')
let groupMembers = require('./data/groupMembers.json')
let groups = require('./data/groups.json')
const media = require('./data/media.json')
const users = require('./data/users.json')
const messages = require('./data/messages.json')
const languages = require('./data/languages.json')
const schedules = require('./data/schedules.json')
const userLanguages = require('./data/userLanguages.json')
const userSchedules = require('./data/userSchedules.json')
const interests = require('./data/interests.json')
const userInterests = require('./data/userInterests.json')
let access_token;
let access_token6;





const { generateHash } = require('../helpers/bcryptjs')
const { signToken, verifyToken } = require('../helpers/jwt')

beforeAll(async () => {


    await sequelize.queryInterface.bulkInsert('Media', media.map(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el
    }))

    await sequelize.queryInterface.bulkInsert('Users', users.map(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        el.password = generateHash(el.password)
        return el
    }))

    access_token = signToken({ id: 1 })
    linkVerified = access_token


    linkUnverified = signToken({ id: 8 })
    linkFakeId = signToken({ id: 80 })
    access_token6 = signToken({ id: 6 })
    const payload = verifyToken(linkUnverified)
})

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete('Media', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })

    await sequelize.queryInterface.bulkDelete('Users', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })
})

describe('environmental variables', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules() // Most important - it clears the cache
        process.env = { ...OLD_ENV }; // Make a copy
        process.env.CLIENT_URI = "https://linguagram-h8.web.app"
        process.env.DATABASE_URL = OLD_ENV.DATABASE_URL
        // process.env.JWT_SECRET_KEY = 'test'
        process.env.NODE_ENV = 'production'
    });

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });

    test('will receive process.env variables', () => {
        // Set the variables



        // const testedModule = require('../.env').default

        return request(require('../app').server)
            .post('/translate')
            .set("access_token", access_token6)
            .send({
                "text": "test translate",
                "from": "English"
            })
            .then(res => {
                console.log(res.body,"<<<<");
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty("translated", expect.any(String))
            })
    });
});
