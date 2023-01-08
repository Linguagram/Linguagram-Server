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
let access_token2;
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
    access_token2 = signToken({ id: 1 })
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


describe.skip("test api user", () => {

    describe("post /users/register", () => {
        test("success create user and response 201", () => {
            return request(app)
                .post('/users/register')
                .send({
                    username: 'sipri',
                    email: "sipri34@gmail.com",
                    password: "12345678",
                    confirmPassword: "12345678"
                })
                .then(res => {
                    expect(res.status).toBe(201)
                    expect(res.body).toHaveProperty("access_token", expect.any(String))
                    expect(res.body).toHaveProperty("user", expect.any(Object))
                    expect(res.body.user).toHaveProperty("email", expect.any(String))
                    expect(res.body.user).toHaveProperty("id", expect.any(Number))
                    expect(res.body.user.password).toEqual(undefined)
                })
        })

        test("failed create user and response 400 because no email was provided", () => {
            return request(app)
                .post('/users/register')
                .send({
                    username: 'sipri',
                    password: "12345678",
                    confirmPassword: "12345678"
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("error", expect.any(Boolean))
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Email is required')
                })
        })


        test("failed create user and response 400 because no password was provided", () => {
            return request(app)
                .post('/users/register')
                .send({
                    username: 'sipri',
                    email: "sipri34@gmail.com",
                    confirmPassword: "12345678"
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("error", expect.any(Boolean))
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Password is required')
                })
        })

        test("failed create user and response 400 because email has already been registered", () => {
            return request(app)
                .post('/users/register')
                .send({
                    username: 'sipri',
                    password: "12345678",
                    email: "sforrest0@chron.com",
                    confirmPassword: "12345678"
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("error", expect.any(Boolean))
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Email has already been registered')
                })
        })

        test("failed create user and response 400 because username was not provided", () => {
            return request(app)
                .post('/users/register')
                .send({
                    password: "12345678",
                    email: "sipri34@gmail.com",
                    confirmPassword: "12345678"
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("error", expect.any(Boolean))
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Username is required')
                })
        })

        test("failed create user and response 400 because email format is invalid", () => {
            return request(app)
                .post('/users/register')
                .send({
                    username: 'sipri',
                    password: "12345678",
                    email: "sipri34tesd",
                    confirmPassword: "12345678"
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("error", expect.any(Boolean))
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Invalid email format')
                })
        })

        test("failed create user and response 400 because password is too short", () => {
            return request(app)
                .post('/users/register')
                .send({
                    username: 'sipri',
                    password: "12345",
                    email: "sipri34@gmail.com",
                    confirmPassword: "12345"
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("error", expect.any(Boolean))
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Password must have at least 8 characters')
                })
        })

        test("failed create user and response 400 because password was not provided", () => {
            return request(app)
                .post('/users/register')
                .send({
                    username: 'sipri',
                    email: "sipri34@gmail.com",
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("error", expect.any(Boolean))
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Password is required')
                })
        })


        test("failed create user and response 400 because password and confirm password do not match", () => {
            return request(app)
                .post('/users/register')
                .send({
                    username: 'sipri',
                    email: "sipri34@gmail.com",
                    password: "12345",
                    confirmPassword: "12345678"
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("error", expect.any(Boolean))
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Password do not match')
                })
        })
    })

    describe("post /users/login", () => {
        test("success login and response 200", () => {
            return request(app)
                .post('/users/login')
                .send({
                    email: "sforrest0@chron.com",
                    password: "WDbnhZZ63W1",
                })
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res.body).toHaveProperty("access_token", expect.any(String))
                    expect(res.body.user).toHaveProperty("email", expect.any(String))
                    expect(res.body.user).toHaveProperty("id", expect.any(Number))
                    expect(res.body.user).toHaveProperty("id", expect.any(Number))
                    expect(res.body.user.password).toEqual(undefined)
                })
        })

        test("failed login and response 400 because email was not provided", () => {
            return request(app)
                .post('/users/login')
                .send({
                    password: "WDbnhZZ63W1",
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("error", expect.any(Boolean))
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Email is required')
                })
        })

        test("failed login and response 400 because password was not provided", () => {
            return request(app)
                .post('/users/login')
                .send({
                    email: "sforrest0@chron.com",
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("error", expect.any(Boolean))
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Password is required')
                })
        })

        test("failed login and response 400 because password is invalid", () => {
            return request(app)
                .post('/users/login')
                .send({
                    password: "WDbnhZZ6fa3W1",
                    email: "sforrest0@chron.com",
                })
                .then(res => {
                    expect(res.status).toBe(401)
                    expect(res.body).toHaveProperty("error", expect.any(Boolean))
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Invalid email/password')
                })
        })

        test("failed login and response 400 because email is invalid", () => {
            return request(app)
                .post('/users/login')
                .send({
                    email: "sforrestf0@chron.com",
                    password: "WDbnhZZ63W1",
                })
                .then(res => {
                    expect(res.status).toBe(401)
                    expect(res.body).toHaveProperty("error", expect.any(Boolean))
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Invalid email/password')
                })
        })
    })

    describe("post /users/verify", () => {
        test("success verify and response 200", () => {
            return request(app)
                .post(`/users/verify?verification=${linkUnverified}`)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(undefined)
                })
        })

        test("failed and response 401 because link is invalid", () => {
            return request(app)
                .post(`/users/verify?verification=`)
                .then(res => {
                    expect(res.status).toBe(401)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid Link')

                })
        })

        test("failed and response 401 because link is invalid", () => {
            return request(app)
                .post(`/users/verify?verification=${linkFakeId}`)
                .then(res => {
                    expect(res.status).toBe(401)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid Link')

                })
        })

        test("failed and response 401 because token within the verification query is invalid", () => {
            return request(app)
                .post('/users/verify?verification=test')
                .then(res => {
                    expect(res.status).toBe(401)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid Token')

                })
        })

        test("failed and response 400 because the email has been verified", () => {
            return request(app)
                .post(`/users/verify?verification=${linkVerified}`)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.error).toEqual(true)
                    expect(res.body.message).toEqual('Your email address has been verified')
                })
        })
    })

    describe("PUT /users/@me", () => {
        test("succeed on updating user's profile and response 200", () => {
            return request(app)
                .put('/users/@me')
                .set("access_token", access_token)
                .send({
                    email: "sforrest0@chron.com",
                    password: "WDbnhZZ63W1",
                    newPassword: "WDbnhZZ63W1",
                    confirmNewPassword: "WDbnhZZ63W1",
                    username: "Sissie Forrest",
                })
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Object))
                    expect(res.body).toHaveProperty('id', expect.any(Number))
                    expect(res.body).toHaveProperty('username', expect.any(String))
                    expect(res.body).toHaveProperty('email', expect.any(String))
                    expect(res.body).toHaveProperty('country', expect.any(String))
                    expect(res.body).toHaveProperty('verified', expect.any(Boolean))
                    expect(res.body).toHaveProperty('UserLanguages', expect.any(Array))
                    expect(res.body).toHaveProperty('UserInterests', expect.any(Array))
                })
        })

        test("failed on updating user's profile because no email sent and response 400", () => {
            return request(app)
                .put('/users/@me')
                .set("access_token", access_token)
                .send({
                    password: "WDbnhZZ63W1",
                    newPassword: "WDbnhZZ63W1",
                    confirmNewPassword: "WDbnhZZ63W1",
                    username: "Sissie Forrest",
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Email is required')
                })
        })

        test("failed on updating user's profile because sent password is wrong and response 401", () => {
            return request(app)
                .put('/users/@me')
                .set("access_token", access_token)
                .send({
                    email: "sforrest0@chron.com",
                    password: "WDbnhZZ63Wf1",
                    newPassword: "WDbnhZZ63W1",
                    confirmNewPassword: "WDbnhZZ63W1",
                    username: "Sissie Forrest",
                })
                .then(res => {
                    expect(res.status).toBe(401)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid old password')
                })
        })


        test("failed on updating user's profile because no password sent and response 400", () => {
            return request(app)
                .put('/users/@me')
                .set("access_token", access_token)
                .send({
                    email: "sforrest0@chron.com",
                    username: "Sissie Forrest",
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Password is required')
                })
        })

        test("failed on updating user's profile because no new password and confirm new password do not match and response 400", () => {
            return request(app)
                .put('/users/@me')
                .set("access_token", access_token)
                .send({
                    email: "sforrest0@chron.com",
                    password: "WDbnhZZ63W1",
                    newPassword: "WDbnhZZ63W1",
                    confirmNewPassword: "WDbnhZZ63W1f",
                    username: "Sissie Forrest",
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('New password do not match')
                })
        })

        test("failed on updating user's profile because no username sent and response 400", () => {
            return request(app)
                .put('/users/@me')
                .set("access_token", access_token)
                .send({
                    email: "sforrest0@chron.com",
                    password: "WDbnhZZ63W1",
                    newPassword: "WDbnhZZ63W1",
                    confirmNewPassword: "WDbnhZZ63W1",
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Username is required')
                })
        })

        test("failed on updating user's profile because email sent has an invalid format and response 400", () => {
            return request(app)
                .put('/users/@me')
                .set("access_token", access_token)
                .send({
                    email: "sforrest0fsd",
                    password: "WDbnhZZ63W1",
                    newPassword: "WDbnhZZ63W1",
                    confirmNewPassword: "WDbnhZZ63W1",
                    username: "Sissie Forrest",
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid email format')
                })
        })

        test("failed on updating user's profile because new password is less than 8 character and response 400", () => {
            return request(app)
                .put('/users/@me')
                .set("access_token", access_token)
                .send({
                    email: "sforrest0@chron.com",
                    password: "WDbnhZZ63W1",
                    newPassword: "fsdf",
                    confirmNewPassword: "fsdf",
                    username: "Sissie Forrest",
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Password must have at least 8 characters')
                })
        })
    })

    describe("POST /users/avatar", () => {
        test("succeed on posting avatar and response 201", () => {
            return request(app)
                .post('/users/avatar')
                .set("access_token", access_token)
                .attach('avatar', '_test_/testFile.png')
                .then(res => {
                    expect(res.status).toBe(201)
                    expect(res).toHaveProperty("body", expect.any(Object))
                    expect(res.body).toHaveProperty('id', expect.any(Number))
                    expect(res.body).toHaveProperty('username', expect.any(String))
                    expect(res.body).toHaveProperty('email', expect.any(String))
                    expect(res.body).toHaveProperty('country', expect.any(String))
                    expect(res.body).toHaveProperty('AvatarId', expect.any(Number))
                    expect(res.body).toHaveProperty('isOnline', expect.any(Boolean))
                })
        })

        test("failed posting avatar and response 400 because there is no file sent", () => {
            return request(app)
                .post('/users/avatar')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('avatar is required')
                })
        })

    })


    describe("GET /users/:userId", () => {
        test("succeed on getting info of a user and response 200", () => {
            return request(app)
                .get('/users/1')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Object))
                    expect(res.body).toHaveProperty('id', expect.any(Number))
                    expect(res.body).toHaveProperty('username', expect.any(String))
                    expect(res.body).toHaveProperty('email', expect.any(String))
                    expect(res.body).toHaveProperty('country', expect.any(String))
                    expect(res.body).toHaveProperty('AvatarId', expect.any(Number))
                    expect(res.body).toHaveProperty('isOnline', expect.any(Boolean))
                    expect(res.body).toHaveProperty('Avatar', expect.any(Object))
                    expect(res.body).toHaveProperty('UserLanguages', expect.any(Array))
                    expect(res.body).toHaveProperty('UserInterests', expect.any(Array))
                    res.body.UserInterests.forEach(el => {
                        expect(el).toHaveProperty('InterestId', expect.any(Number))
                        expect(el).toHaveProperty('Interest', expect.any(Object))
                        expect(el.Interest).toHaveProperty('name', expect.any(String))
                        expect(el.Interest).toHaveProperty('id', expect.any(Number))

                    })

                    res.body.UserLanguages.forEach(el => {
                        expect(el).toHaveProperty('LanguageId', expect.any(Number))
                        expect(el).toHaveProperty('Language', expect.any(Object))
                        expect(el.Language).toHaveProperty('name', expect.any(String))
                        expect(el.Language).toHaveProperty('id', expect.any(Number))

                    })

                })


        })



        test("failed on getting info of a user and response 400 because the inserted user id is not a number", () => {
            return request(app)
                .get('/users/test')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid userId')
                })
        })

        test("succeed on getting info of a user and response 200", () => {
            return request(app)
                .get('/users/100')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown user')
                })
        })
    })


    describe("GET /users/@me", () => {
        test("succeed on getting user's profile and response 200", () => {
            return request(app)
                .get('/users/@me')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Object))
                    expect(res.body).toHaveProperty("username", expect.any(String))
                    expect(res.body).toHaveProperty("email", expect.any(String))
                    expect(res.body).toHaveProperty("country", expect.any(String))
                    expect(res.body).toHaveProperty("phoneNumber", expect.any(String))
                    expect(res.body).toHaveProperty("verified", expect.any(Boolean))
                    expect(res.body).toHaveProperty("AvatarId", expect.any(Number))
                    expect(res.body).toHaveProperty("status", expect.any(String))
                    expect(res.body).toHaveProperty("status", expect.any(String))
                })
        })
    })

    describe("DELETE /users/avatar", () => {
        test("succeed on deleting user's avatar and response 200", () => {
            return request(app)
                .delete('/users/avatar')
                .set("access_token", access_token2)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Object))
                    expect(res.body).toHaveProperty("username", expect.any(String))
                    expect(res.body).toHaveProperty("email", expect.any(String))
                    expect(res.body).toHaveProperty("country", expect.any(String))
                    expect(res.body).toHaveProperty("status", expect.any(String))
                    expect(res.body).toHaveProperty("verified", expect.any(Boolean))
                    expect(res.body).toHaveProperty("isOnline", expect.any(Boolean))

                })
        })
    })

    describe("PATCH /users/status", () => {
        test("succeed on updating user's status and response 200", () => {
            return request(app)
                .patch('/users/status')
                .set("access_token", access_token)
                .send({
                    status: "test update status"
                })
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Object))
                    expect(res.body).toHaveProperty("username", expect.any(String))
                    expect(res.body).toHaveProperty("email", expect.any(String))
                    expect(res.body).toHaveProperty("country", expect.any(String))
                    expect(res.body).toHaveProperty("status", expect.any(String))
                    expect(res.body).toHaveProperty("phoneNumber]", expect.any(String))
                    expect(res.body).toHaveProperty("verified]", expect.any(Boolean))
                    expect(res.body).toHaveProperty("isOnline", expect.any(Boolean))
                })
        })
    })

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

})

