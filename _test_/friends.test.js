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
let access_token3;
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
    access_token3 = signToken({ id: 3 })
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

describe.skip("test api friends", () => {

    describe("GET /friends", () => {
        test("success get friend list and response 200", () => {
            return request(app)
                .get('/friends')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Array))
                    res.body.forEach(el => {
                        expect(el).toHaveProperty("UserId", expect.any(Number))
                        expect(el).toHaveProperty("FriendId", expect.any(Number))
                        expect(el).toHaveProperty("User", expect.any(Object))
                        expect(el).toHaveProperty("Friend", expect.any(Object))
                        expect(el.User).toHaveProperty("username", expect.any(String))
                        expect(el.User).toHaveProperty("email", expect.any(String))
                        expect(el.Friend).toHaveProperty("username", expect.any(String))
                        expect(el.Friend).toHaveProperty("email", expect.any(String))
                    })
                })
        })
    })

    describe("POST /friends/:friendId", () => {
        test("success sending friend request and response 200", () => {
            return request(app)
                .post('/friends/4')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res.body).toHaveProperty("UserId", expect.any(Number))
                    expect(res.body).toHaveProperty("FriendId", expect.any(Number))
                    expect(res.body).toHaveProperty("isAccepted", expect.any(Boolean))
                    expect(res.body).toHaveProperty("User", expect.any(Object))
                    expect(res.body).toHaveProperty("Friend", expect.any(Object))
                    expect(res.body.User).toHaveProperty("username", expect.any(String))
                    expect(res.body.User).toHaveProperty("email", expect.any(String))
                    expect(res.body.Friend).toHaveProperty("username", expect.any(String))
                    expect(res.body.Friend).toHaveProperty("email", expect.any(String))
                })
        })
    })

    describe("PATCH /friendships/:userId", () => {
        test("success accepting friend request and response 200", () => {
            return request(app)
                .patch('/friendships/1')
                .set("access_token", access_token3)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res.body).toHaveProperty("UserId", expect.any(Number))
                    expect(res.body).toHaveProperty("FriendId", expect.any(Number))
                    expect(res.body).toHaveProperty("isAccepted", expect.any(Boolean))
                    expect(res.body).toHaveProperty("User", expect.any(Object))
                    expect(res.body).toHaveProperty("Friend", expect.any(Object))
                    expect(res.body.User).toHaveProperty("username", expect.any(String))
                    expect(res.body.User).toHaveProperty("email", expect.any(String))
                    expect(res.body.Friend).toHaveProperty("username", expect.any(String))
                    expect(res.body.Friend).toHaveProperty("email", expect.any(String))
                })
        })

        test("failed accepting friend request because user id is not a number and response 400", () => {
            return request(app)
                .patch('/friendships/test')
                .set("access_token", access_token3)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid userId')
                })
        })

        test("failed accepting friend request because friend request is already accepted and response 400", () => {
            return request(app)
                .patch('/friendships/2')
                .set("access_token", access_token3)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Friend request already accepted')
                })
        })

        test("failed accepting friend request because friend request is already accepted and response 403", () => {
            return request(app)
                .patch('/friendships/2')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(403)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Forbidden')
                })
        })

        test("failed accepting friend request because friend request was not found and response 404", () => {
            return request(app)
                .patch('/friendships/5')
                .set("access_token", access_token3)
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual("Friendship not found")
                })
        })
    })

    describe("DELETE /friendships/:friendId", () => {
        test("success deleting friendship and response 200", () => {
            return request(app)
                .delete('/friendships/2')
                .set("access_token", access_token3)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res.body).toHaveProperty("UserId", expect.any(Number))
                    expect(res.body).toHaveProperty("FriendId", expect.any(Number))
                    expect(res.body).toHaveProperty("isAccepted", expect.any(Boolean))
                    expect(res.body).toHaveProperty("User", expect.any(Object))
                    expect(res.body).toHaveProperty("Friend", expect.any(Object))
                    expect(res.body.User).toHaveProperty("username", expect.any(String))
                    expect(res.body.User).toHaveProperty("email", expect.any(String))
                    expect(res.body.Friend).toHaveProperty("username", expect.any(String))
                    expect(res.body.Friend).toHaveProperty("email", expect.any(String))
                })
        })

        test("failed deleting friendship because user id is not a number and response 400", () => {
            return request(app)
                .delete('/friendships/test')
                .set("access_token", access_token3)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid userId')
                })
        })

        test("failed deleting friendship because user id is not a number and response 400", () => {
            return request(app)
                .delete('/friendships/test')
                .set("access_token", access_token3)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid userId')
                })
        })

        test("failed deleting friendship because friendship was not found and response 404", () => {
            return request(app)
                .delete('/friendships/5')
                .set("access_token", access_token3)
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual("Friendship not found")
                })
        })

        test("failed deleting friendship and response 403 because the friend id is the same with user id", () => {
            return request(app)
                .delete('/friendships/3')
                .set("access_token", access_token3)
                .then(res => {
                    expect(res.status).toBe(403)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual("Forbidden")
                })
        })

    })


})