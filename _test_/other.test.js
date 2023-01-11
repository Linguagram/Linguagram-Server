const request = require('supertest')
const app = require('../app').server
const { sequelize } = require('../models')
let friendships = require('../data/friendships.json')
let groupMembers = require('../data/groupMembers.json')
let groups = require('../data/groups.json')
const media = require('../data/media.json')
const users = require('../data/users.json')
const messages = require('../data/messages.json')
const languages = require('../data/languages.json')
const schedules = require('../data/schedules.json')
const userLanguages = require('../data/userLanguages.json')
const userSchedules = require('../data/userSchedules.json')
const interests = require('../data/interests.json')
const userInterests = require('../data/userInterests.json')
let access_token;
let access_token6;
let linkUnverified;
let linkVerified;
let linkFakeId;



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



    await sequelize.queryInterface.bulkInsert('Friendships', friendships.map(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el
    }))

    await sequelize.queryInterface.bulkInsert('Groups', groups.map(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el
    }))

    await sequelize.queryInterface.bulkInsert('Messages', messages.map(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el
    }))

    await sequelize.queryInterface.bulkInsert('GroupMembers', groupMembers.map(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el
    }))

    await sequelize.queryInterface.bulkInsert('Languages', languages.map(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el
    }))

    await sequelize.queryInterface.bulkInsert('Schedules', schedules.map(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el
    }))

    await sequelize.queryInterface.bulkInsert('UserLanguages', userLanguages.map(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el
    }))

    await sequelize.queryInterface.bulkInsert('UserSchedules', userSchedules.map(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el
    }))

    await sequelize.queryInterface.bulkInsert('Interests', interests.map(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el
    }))

    await sequelize.queryInterface.bulkInsert('UserInterests', userInterests.map(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el
    }))






})

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete('Media', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })

    await sequelize.queryInterface.bulkDelete('Users', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })

    await sequelize.queryInterface.bulkDelete('Friendships', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })

    await sequelize.queryInterface.bulkDelete('Groups', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })

    await sequelize.queryInterface.bulkDelete('Messages', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })

    await sequelize.queryInterface.bulkDelete('GroupMembers', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })

    await sequelize.queryInterface.bulkDelete('Languages', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })

    await sequelize.queryInterface.bulkDelete('Schedules', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })

    await sequelize.queryInterface.bulkDelete('UserLanguages', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })

    await sequelize.queryInterface.bulkDelete('UserSchedules', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })

    await sequelize.queryInterface.bulkDelete('Interests', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })

    await sequelize.queryInterface.bulkDelete('UserInterests', {}, {
        truncate: true, restartIdentity: true, cascade: true
    })


})

describe("test API", () => {

    describe("GET /languages/@me", () => {
        test("succeed on getting user's languages list and response 200", () => {
            return request(app)
                .get('/languages/@me')
                .set("access_token", access_token)
                .then(res => {
                    console.log(res.body, '<<<res');

                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Array))
                    res.body.forEach(el => {
                        expect(el).toHaveProperty('id', expect.any(Number))
                        expect(el).toHaveProperty('type', expect.any(String))
                        expect(el).toHaveProperty('UserId', expect.any(Number))
                        expect(el).toHaveProperty('Language', expect.any(Object))
                        expect(el.Language).toHaveProperty('name', expect.any(String))
                        expect(el.Language).toHaveProperty('id', expect.any(Number))
                    })
                })
        })
    })

    describe("GET /languages", () => {
        test("succeed on getting languages list and response 200", () => {
            return request(app)
                .get('/languages')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Array))
                    res.body.forEach(el => {
                        expect(el).toHaveProperty('id', expect.any(Number))
                        expect(el).toHaveProperty('name', expect.any(String))
                    })
                })
        })
    })


    describe(" POST /translate", () => {
        test("succeed on translating a text and response 200", () => {
            return request(app)
                .post('/translate')
                .set("access_token", access_token)
                .send({
                    "text": "test translate",
                    "from": "English",
                    "to": "Indonesian"
                })
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res.body.error).toEqual(undefined)
                    expect(res.body).toHaveProperty("translated", expect.any(String))
                })
        })

        test("failed on translating a text and response 400 because the target language or origin language is not in api's language list", () => {
            return request(app)
                .post('/translate')
                .set("access_token", access_token)
                .send({
                    "text": "test translate",
                    "from": "English",
                    "to": "Indonesia"
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                })
        })

        test("failed on translating a text and response 400 because there is no text sent", () => {
            return request(app)
                .post('/translate')
                .set("access_token", access_token)
                .send({
                    "from": "English",
                    "to": "Indonesia"
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual("Text is required")
                })
        })

        test("failed on translating a text and response 400 because there is no target language provided and user didn't input any native language", () => {
            return request(app)
                .post('/translate')
                .set("access_token", access_token6)
                .send({
                    "text": "test translate",
                    "from": "English"
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual("No target language specified")
                })
        })
    })

    describe("GET /interests", () => {
        test("succeed on getting interest list and response 200", () => {
            return request(app)
                .get('/interests')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Array))
                    res.body.forEach(el => {
                        expect(el).toHaveProperty('id', expect.any(Number))
                        expect(el).toHaveProperty('name', expect.any(String))
                    })
                })
        })
    })

    describe("GET /explore/users", () => {
        test("succeed on getting list of people who has native language that matched with user's interest language  and response 200", () => {
            return request(app)
                .get('/explore/users')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Array))
                    res.body.forEach(el => {
                        expect(el).toHaveProperty('id', expect.any(Number))
                        expect(el).toHaveProperty('username', expect.any(String))
                        expect(el).toHaveProperty('UserLanguages', expect.any(Array))
                        el.UserLanguages.forEach(lang => {
                            expect(lang).toHaveProperty('type', expect.any(String))
                            expect(lang.type).toEqual('native')
                        })
                    })
                })
        })
    })

    describe("GET /explore/groups", () => {
        test("succeed on getting list of with type 'group'  and response 200", () => {
            return request(app)
                .get('/explore/groups')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Array))
                    res.body.forEach(el => {
                        expect(el).toHaveProperty('id', expect.any(Number))
                        expect(el).toHaveProperty('name', expect.any(String))
                        expect(el).toHaveProperty('type', expect.any(String))
                        expect(el.type).toEqual('group')
                        expect(el).toHaveProperty('GroupMembers', expect.any(Array))
                        el.GroupMembers.forEach(mem => {
                            expect(mem).toHaveProperty('GroupId', expect.any(Number))
                            expect(mem).toHaveProperty('UserId', expect.any(Number))
                            expect(mem).toHaveProperty('User', expect.any(Object))
                        })
                    })
                })
        })
    })

    
})
