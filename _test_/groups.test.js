const request = require('supertest')
const app = require('../app')
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
const fs = require('fs')


const { generateHash } = require('../helpers/bcryptjs')

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

    const res = await request(app)
        .post('/login')
        .send({
            email: "admin@admin.com",
            password: "1234567890",
        })

    console.log(res.body, "<<<<RES");
    access_token = res.body.access_token
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


describe.skip("test API groups", () => {

    describe("GET /groups/:groupId/messages", () => {
        test("success getting all message of one group and response 200", () => {
            return request(app)
                .get('/groups/1/messages')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Array))
                    expect(res.body[0]).toHaveProperty("content", expect.any(String))
                    expect(res.body[0]).toHaveProperty("UserId", expect.any(Number))
                    expect(res.body[0]).toHaveProperty("GroupId", expect.any(Number))
                    expect(res.body[0]).toHaveProperty("User", expect.any(Object))
                    expect(res.body[0]).toHaveProperty("Group", expect.any(Object))
                    expect(res.body[0].User).toHaveProperty("id", expect.any(Number))
                    expect(res.body[0].User).toHaveProperty("UserLanguages", expect.any(Array))
                    expect(res.body[0].User).toHaveProperty("Avatar", expect.any(Object))
                })
        })

        test("failed getting messsages and response 404 because the user is not a member of the group", () => {
            return request(app)
                .get('/groups/21/messages')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown Group')
                })
        })

        test("failed getting messsages and response 400 because the parameter group id is not a number", () => {
            return request(app)
                .get('/groups/test/messages')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid groupId')
                })
        })

    })



    describe("POST /groups/:groupId/messages", () => {
        test.skip("success sending message with content and a file to one group and response 200", () => {
            return request(app)
                .post('/groups/1/messages')
                .set({ "access_token": access_token })
                .field('content', 'test content')
                .attach('attachment', '_test_/testFile.png')
                .then(res => {
                    expect(res.status).toBe(201)
                    expect(res.body).toHaveProperty("deleted", expect.any(Boolean))
                    expect(res.body).toHaveProperty("Medium", expect.any(Object))
                    expect(res.body).toHaveProperty("content", expect.any(String))
                    expect(res.body).toHaveProperty("GroupId", expect.any(Number))
                    expect(res.body).toHaveProperty("User", expect.any(Object))
                    expect(res.body.User).toHaveProperty("id", expect.any(Number))
                    expect(res.body.User).toHaveProperty("UserLanguages", expect.any(Array))
                    expect(res.body.User).toHaveProperty("Avatar", expect.any(Object))
                    expect(res.body.User.Avatar).toHaveProperty("url", expect.any(String))
                    expect(res.body.Medium).toHaveProperty("url", expect.any(String))

                })
        })

        test("failed posting a messsage and response 404 because the user is not a member of the group", () => {
            return request(app)
                .post('/groups/21/messages')
                .set("access_token", access_token)
                .then(res => {
                    console.log(access_token, "<<<<bawah");

                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown Group')
                })
        })

        test("failed getting messsages and response 400 because the parameter group id is not a number", () => {
            return request(app)
                .post('/groups/test/messages')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid groupId')
                })
        })

        test("failed getting messsages and response 400 because there is no file or text content was sent", () => {
            return request(app)
                .post('/groups/1/messages')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('One upload or text content is required')
                })
        })

    })

    describe("GET /groups/:groupId/messages/:messageId", () => {
        test("success getting all message of one group and response 200", () => {
            return request(app)
                .get('/groups/1/messages/1')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Object))
                    expect(res.body).toHaveProperty("content", expect.any(String))
                    expect(res.body).toHaveProperty("UserId", expect.any(Number))
                    expect(res.body).toHaveProperty("GroupId", expect.any(Number))
                    expect(res.body).toHaveProperty("User", expect.any(Object))
                    expect(res.body).toHaveProperty("Group", expect.any(Object))
                    expect(res.body.User).toHaveProperty("id", expect.any(Number))
                    expect(res.body.Group).toHaveProperty("id", expect.any(Number))
                    expect(res.body.User).toHaveProperty("UserLanguages", expect.any(Array))
                    expect(res.body.User).toHaveProperty("Avatar", expect.any(Object))
                })
        })

        test("failed getting messsages and response 404 because the user is not a member of the group", () => {
            return request(app)
                .get('/groups/21/messages/12')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown Group')
                })
        })

        test("failed getting messsages and response 400 because the parameter group id is not a number", () => {
            return request(app)
                .get('/groups/test/messages/12')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid groupId')
                })
        })

        test("failed getting messsages and response 400 because the parameter group id is not a number", () => {
            return request(app)
                .get('/groups/1/messages/12')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown message')
                })
        })
    })


    describe("PUT /groups/:groupId/messages/:messageId", () => {
        test("success getting all message of one group and response 200", () => {
            return request(app)
                .get('/groups/1/messages/1')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Object))
                    expect(res.body).toHaveProperty("content", expect.any(String))
                    expect(res.body).toHaveProperty("UserId", expect.any(Number))
                    expect(res.body).toHaveProperty("GroupId", expect.any(Number))
                    expect(res.body).toHaveProperty("User", expect.any(Object))
                    expect(res.body).toHaveProperty("Group", expect.any(Object))
                    expect(res.body.User).toHaveProperty("id", expect.any(Number))
                    expect(res.body.Group).toHaveProperty("id", expect.any(Number))
                    expect(res.body.User).toHaveProperty("UserLanguages", expect.any(Array))
                    expect(res.body.User).toHaveProperty("Avatar", expect.any(Object))
                })
        })

        test("failed getting messsages and response 404 because the user is not a member of the group", () => {
            return request(app)
                .get('/groups/21/messages/12')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown Group')
                })
        })

        test("failed getting messsages and response 400 because the parameter group id is not a number", () => {
            return request(app)
                .get('/groups/test/messages/12')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid groupId')
                })
        })

        test("failed getting messsages and response 400 because the parameter group id is not a number", () => {
            return request(app)
                .get('/groups/1/messages/12')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown message')
                })
        })
    })
})
