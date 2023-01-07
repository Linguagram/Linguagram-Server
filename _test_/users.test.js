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

    const res = await request(app)
        .post('/users/login')
        .send({
            email: "nmatusovsky2@mlb.com",
            password: "gHWHJB",
        })

    access_token = res.body.access_token
    linkVerified = res.body.access_token


    linkUnverified = signToken({id:8})
    linkFakeId = signToken({id:80})
    access_token = signToken({id:1})
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


describe("test api user", () => {

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

    describe.only("PUT /users/@me", () => {
        test("succeed on updating user's profile and response 200", () => {
            return request(app)
                .put('/users/@me')
                .set("access_token", access_token)
                .send({
                    email : "sforrest0@chron.com",
                    password : "WDbnhZZ63W1",
                    newPassword : "WDbnhZZ63W1",
                    confirmNewPassword : "WDbnhZZ63W1",
                    username : "Sissie Forrest",
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
                    password : "WDbnhZZ63W1",
                    newPassword : "WDbnhZZ63W1",
                    confirmNewPassword : "WDbnhZZ63W1",
                    username : "Sissie Forrest",
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Email is required')
                })
        })


        test("failed on updating user's profile because no password sent and response 400", () => {
            return request(app)
                .put('/users/@me')
                .set("access_token", access_token)
                .send({
                    email : "sforrest0@chron.com",                    
                    username : "Sissie Forrest",
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
                    email : "sforrest0@chron.com",
                    password : "WDbnhZZ63W1",
                    newPassword : "WDbnhZZ63W1",
                    confirmNewPassword : "WDbnhZZ63W1f",
                    username : "Sissie Forrest",
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
                    email : "sforrest0@chron.com",
                    password : "WDbnhZZ63W1",
                    newPassword : "WDbnhZZ63W1",
                    confirmNewPassword : "WDbnhZZ63W1",
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
                    email : "sforrest0fsd",
                    password : "WDbnhZZ63W1",
                    newPassword : "WDbnhZZ63W1",
                    confirmNewPassword : "WDbnhZZ63W1",
                    username : "Sissie Forrest",
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
                    email : "sforrest0@chron.com",
                    password : "WDbnhZZ63W1",
                    newPassword : "fsdf",
                    confirmNewPassword : "fsdf",
                    username : "Sissie Forrest",
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Password must have at least 8 characters')
                })
        })
    })



})

