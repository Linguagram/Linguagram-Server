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
const { generateHash } = require('../helpers/bcryptjs')
const { signToken } = require('../helpers/jwt')
let access_token;
let fakeaccess_token;
let access_token5;
const io = require("socket.io-client");
const { io: server } = require("../app");
const { SOCKET_EVENTS } = require('../util/ws')

server.attach(3000);
let socket;
// jest.setTimeout(20000);
beforeEach(function(done) {
    // Setup
    socket = io("http://localhost:3000");

    socket.on("connect", function() {
        console.log("worked...");
        done();
    });
    socket.on("disconnect", function() {
        console.log("disconnected...");
    });
});

afterEach(function(done) {
    // Cleanup
    if (socket.connected) {
        console.log("disconnecting...");
        socket.disconnect();
    } else {
        // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
        console.log("no connection to break...");
    }
    done();
});

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
    fakeaccess_token = signToken({ id: 100 })
    access_token5 = signToken({ id: 5 })



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

    socket?.disconnect();
    return server.close();
})


describe.skip("test API groups", () => {
    describe("POST /groups/:groupId/messages", () => {
        test("success sending message with content and a file to one group and response 200", () => {       

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

                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown Group')
                })
        })

        test("failed posting messsages and response 400 because the parameter group id is not a number", () => {
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

        test("failed posting messsages and response 400 because there is no file or text content sent", () => {
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


    describe("GET /groups/:groupId/messages", () => {
        test("failed getting all message of one group and response 401 because token is invalid", () => {
            return request(app)
                .get('/groups/1/messages')
                .set("access_token", "test")
                .then(res => {
                    expect(res.status).toBe(401)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid Token')
                })
        })

        test("failed getting all message of one group and response 401 because user that was signed into the token is not found in database", () => {
            return request(app)
                .get('/groups/1/messages')
                .set("access_token", fakeaccess_token)
                .then(res => {
                    expect(res.status).toBe(401)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid Token')
                })
        })

        test("failed getting all message of one group and response 401 because there was no access token sent", () => {
            return request(app)
                .get('/groups/1/messages')
                .then(res => {
                    expect(res.status).toBe(401)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid Token')
                })
        })

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
        test("success sending message with content and a file to one group and response 200", (done) => {                  

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

                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown Group')
                })
        })

        test("failed posting messsages and response 400 because the parameter group id is not a number", () => {
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

        test("failed posting messsages and response 400 because there is no file or text content sent", () => {
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

    describe("GET /groups/:userId", () => {
        test("succeed on getting dm group list and response 200", () => {
            return request(app)
                .get('/groups/2')
                .set({ "access_token": access_token })
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res.body.error).toEqual(undefined)
                    expect(res.body).toHaveProperty("name", expect.any(String))
                    expect(res.body).toHaveProperty("id", expect.any(Number))
                    expect(res.body).toHaveProperty("type", expect.any(String))
                    expect(res.body).toHaveProperty("GroupMembers", expect.any(Object))
                    expect(res.body.type).toEqual('dm')                    
                    expect(res.body.GroupMembers.some(el=> el.UserId == 1)).toEqual(true)
                    expect(res.body.GroupMembers.some(el=> el.UserId == 2)).toEqual(true)
                })
        })

        test("failed on getting dm group list and response 400 because user id is not a number", () => {
            return request(app)
                .get('/groups/test')
                .set({ "access_token": access_token })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid userId')
                })
        })
    })

    describe("PATCH /groups/:groupId/messages/:messageId", () => {
        test("succeed on patching the status of a message to isRead true and response 200", () => {
            return request(app)
                .patch('/groups/4/messages')
                .set({ "access_token": access_token })
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res.body.error).toEqual(undefined)
                    expect(res.body).toHaveProperty("isRead", expect.any(Boolean))
                    expect(res.body.isRead).toEqual(true)
                })
        })

        test("failed on patching the status of a message to isRead true and response 404 because the user is not a member of the group", () => {
            return request(app)
                .patch('/groups/12/messages')
                .set({ "access_token": access_token })                
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown Group')
                })
        })

        test("failed on patching the status of a message to isRead true and response 404 because the group id is not a number", () => {
            return request(app)
                .patch('/groups/test/messages')
                .set({ "access_token": access_token })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid groupId')
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

        test("failed getting a messsage and response 404 because the user is not a member of the group", () => {
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

        test("failed getting a messsage and response 400 because the parameter group id is not a number", () => {
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

        test("failed getting a message and response 404 because the message doesn't exist", () => {
            return request(app)
                .get('/groups/1/messages/120')
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
        test("succeed on updating a message of one group and response 200", () => {
            return request(app)
                .put('/groups/1/messages/1')
                .set("access_token", access_token)
                .send({
                    content: 'testing'
                })
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Object))
                    expect(res.body).toHaveProperty("content", expect.any(String))
                    expect(res.body).toHaveProperty("UserId", expect.any(Number))
                    expect(res.body).toHaveProperty("GroupId", expect.any(Number))
                    expect(res.body).toHaveProperty("User", expect.any(Object))
                    expect(res.body).toHaveProperty("Group", expect.any(Object))
                    expect(res.body.User).toHaveProperty("id", expect.any(Number))
                    expect(res.body.User).toHaveProperty("UserLanguages", expect.any(Array))
                    expect(res.body.Group).toHaveProperty("id", expect.any(Number))
                    expect(res.body.Medium).toEqual(undefined)
                })
        })

        test("failed on updating a messsage and response 404 because the user is not a member of the group", () => {
            return request(app)
                .put('/groups/21/messages/12')
                .set("access_token", access_token)
                .send({
                    content: 'testing'
                })
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown Group')
                })
        })

        test("failed on updating a messsage and response 404 because the user is not the one who wrote the message", () => {
            return request(app)
                .put('/groups/4/messages/25')
                .set("access_token", access_token)
                .send({
                    content: 'testing'
                })
                .then(res => {
                    expect(res.status).toBe(403)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Forbidden')
                })
        })

        test("failed on updating a messsage and response 400 because there is no file or text content was sent", () => {
            return request(app)
                .put('/groups/1/messages/1')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Content is required to edit message')
                })
        })

        test("failed on updating messsages and response 400 because the parameter group id is not a number", () => {
            return request(app)
                .put('/groups/test/messages/1')
                .set("access_token", access_token)
                .send({
                    content: 'testing'
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid groupId')
                })
        })

        test("failed on deleting a message and response 404 because the message doesn't exist in the first place", () => {
            return request(app)
                .put('/groups/1/messages/120')
                .set("access_token", access_token)
                .send({
                    content: 'testing'
                })
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown message')
                })
        })



    })

    describe("DELETE /groups/:groupId/messages/:messageId", () => {

        test("failed on deleting a messsage and response 404 because the user is not a member of the group", () => {
            return request(app)
                .delete('/groups/3/messages/9')
                .set("access_token", access_token5)
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown Group')
                })
        })

        test("failed on deleting a messsage and response 403 because the user is not the one who wrote the message", () => {
            return request(app)
                .delete('/groups/4/messages/25')
                .set("access_token", access_token5)
                .then(res => {
                    expect(res.status).toBe(403)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Forbidden')
                })
        })

        test("failed on deleting a messsage and response 400 because the parameter group id is not a number", () => {
            return request(app)
                .delete('/groups/test/messages/12')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid groupId')
                })
        })

        test("failed on deleting a messsage and response 400 because the message has already been deleted", () => {
            return request(app)
                .delete('/groups/1/messages/3')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('This message has already been deleted')
                })
        })

        test("failed on deleting a message and response 404 because the message doesn't exist", () => {
            return request(app)
                .delete('/groups/1/messages/120')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown message')
                })
        })

        test("succeed on deleting a message of one group and response 200", () => {
            return request(app)
                .delete('/groups/1/messages/1')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Object))
                    expect(res.body).toHaveProperty("UserId", expect.any(Number))
                    expect(res.body).toHaveProperty("User", expect.any(Object))
                    expect(res.body).toHaveProperty("Group", expect.any(Object))
                    expect(res.body.User).toHaveProperty("id", expect.any(Number))
                    expect(res.body.User).toHaveProperty("UserLanguages", expect.any(Array))
                    expect(res.body.Group).toHaveProperty("id", expect.any(Number))
                    expect(res.body.Medium).toEqual(undefined)
                    expect(res.body.MediaId).toEqual(undefined)
                    expect(res.body.content).toEqual(undefined)
                })
        })
    })

    describe("GET /groups/@me", () => {
        test("succeed on getting group list the user is a member of and response 200", () => {
            return request(app)
                .get('/groups/@me')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res).toHaveProperty("body", expect.any(Array))
                    expect(res.body[0]).toHaveProperty('id', expect.any(Number))
                    expect(res.body[0]).toHaveProperty('unreadMessageCount', expect.any(Number))
                    expect(res.body[0]).toHaveProperty('GroupMembers', expect.any(Object))
                    expect(res.body[0].GroupMembers[0]).toHaveProperty('id', expect.any(Number))
                    expect(res.body[0].GroupMembers[0]).toHaveProperty('User', expect.any(Object))
                    expect(res.body[0].GroupMembers[0].User).toHaveProperty('id', expect.any(Number))
                    expect(res.body[0].GroupMembers[0].User).toHaveProperty('username', expect.any(String))
                    expect(res.body[0].GroupMembers[0].User).toHaveProperty('email', expect.any(String))
                    expect(res.body[0].GroupMembers[0].User).toHaveProperty('country', expect.any(String))
                    expect(res.body[0].GroupMembers[0].User).toHaveProperty('AvatarId', expect.any(Number))
                    expect(res.body[0].GroupMembers[0].User).toHaveProperty('isOnline', expect.any(Boolean))
                })
        })

    })

    describe("POST /groups/:groupId/messages", () => {
        test("success sending message with content and a file to one group and response 200", () => {
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

                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown Group')
                })
        })

        test("failed posting messsages and response 400 because the parameter group id is not a number", () => {
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

        test("failed posting messsages and response 400 because there is no file or text content sent", () => {
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

    describe("POST /groups/:groupId/join", () => {
        test("succeed on joining a group and response 200", () => {
            return request(app)
                .post('/groups/11/join')
                .set({ "access_token": access_token })
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res.body).toHaveProperty("id", expect.any(Number))
                    expect(res.body).toHaveProperty("GroupId", expect.any(Number))
                    expect(res.body).toHaveProperty("UserId", expect.any(Number))

                })
        })

        test("failed on joining a group and response 404 because the group doesn't exist", () => {
            return request(app)
                .post('/groups/100/join')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Group not found')
                })
        })

        test("failed on joining a group and response 400 because the parameter group id is not a number", () => {
            return request(app)
                .post('/groups/test/join')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid groupId')
                })
        })

        test("failed posting messsages and response 400 because there is no file or text content sent", () => {
            return request(app)
                .post('/groups/4/join')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Already a member')
                })
        })
    })

    describe("PUT /groups/:groupId", () => {
        test("succeed on editing group name and response 200", () => {
            return request(app)
                .put('/groups/4')
                .set({ "access_token": access_token })
                .send({
                    name: 'new name'
                })
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res.body).toHaveProperty("id", expect.any(Number))
                    expect(res.body).toHaveProperty("name", expect.any(String))
                    expect(res.body).toHaveProperty("type", expect.any(String))
                    expect(res.body).toHaveProperty("GroupMembers", expect.any(Object))
                    res.body.GroupMembers.forEach(el => {
                        expect(el).toHaveProperty("id", expect.any(Number))
                        expect(el).toHaveProperty("GroupId", expect.any(Number))
                        expect(el).toHaveProperty("UserId", expect.any(Number))
                    })
                })
        })

        test("failed on editing group name because group id is not a number and response 400", () => {
            return request(app)
                .put('/groups/test')
                .set({ "access_token": access_token })
                .send({
                    name: 'new name'
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid groupId')
                })
        })

        test("failed on editing group name because user is not a member of the group  and response 400", () => {
            return request(app)
                .put('/groups/12')
                .set({ "access_token": access_token })
                .send({
                    name: 'new name'
                })
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown Group')
                })
        })

        test("failed on editing group name because user didn't provide any new name  and response 400", () => {
            return request(app)
                .put('/groups/4')
                .set({ "access_token": access_token })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Group name is required')
                })
        })


    })

    describe("DELETE /groupmembers/:groupId", () => {
        test("succeed on leaving a group and response 200", () => {
            return request(app)
                .delete('/groupmembers/4')
                .set({ "access_token": access_token })
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res.body).toHaveProperty("id", expect.any(Number))
                    expect(res.body).toHaveProperty("GroupId", expect.any(Number))
                    expect(res.body).toHaveProperty("UserId", expect.any(Number))
                    expect(res.body).toHaveProperty("Group", expect.any(Object))
                    expect(res.body.Group).toHaveProperty("name", expect.any(String))
                    expect(res.body.Group).toHaveProperty("type", expect.any(String))
                    expect(res.body.Group.type).toEqual('group')
                })
        })

        test("failed on leaving a group and response 400 because the parameter group id is not a number", () => {
            return request(app)
                .delete('/groupmembers/test')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Invalid groupId')
                })
        })


        test("failed on leaving a group and response 400 because the user was not a member of the group ", () => {
            return request(app)
                .delete('/groupmembers/100')
                .set("access_token", access_token)
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Unknown Group')
                })
        })
    })

    describe("POST /groups", () => {
        test("succeed on creating a group and response 200", () => {
            return request(app)
                .post('/groups')
                .set({ "access_token": access_token })
                .send({
                    name : "test name"
                })
                .then(res => {
                    expect(res.status).toBe(201)
                    expect(res).toHaveProperty("body", expect.any(Object))
                    expect(res.body).toHaveProperty("id", expect.any(Number))
                    expect(res.body).toHaveProperty("name", expect.any(String))
                    expect(res.body).toHaveProperty("type", expect.any(String))
                    expect(res.body).toHaveProperty("GroupMembers", expect.any(Array))
                    expect(res.body.type).toEqual('group')                   
                })
        })

        test("failed on creating a group and response 400 because no group name was provided", () => {
            return request(app)
                .post('/groups')
                .set({ "access_token": access_token })
                .send({
                })
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toEqual(true)
                    expect(res.body).toHaveProperty("message", expect.any(String))
                    expect(res.body.message).toEqual('Group name is required')
                   
                })
        })
    })






})
