const io = require('socket.io-client');
const { io: server } = require("../app");
const { SOCKET_EVENTS } = require("../util/ws");
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
let access_token3;
let linkUnverified;
let linkVerified;
let linkFakeId;

const { generateHash } = require('../helpers/bcryptjs')
const { signToken, verifyToken } = require('../helpers/jwt')

server.attach(3010);
let socket;
let socket1;

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

beforeEach(function (done) {
  // Setup
  socket = io("http://localhost:3010");

  socket.on("connect", function () {
    console.log("worked...");
  });

  socket.on("disconnect", function () {
    console.log("disconnected...");
  });

  socket.on(SOCKET_EVENTS.IDENTIFY, (res) => {
    console.log("[IDENTIFY]", res);
    if (res.ok)  done();
  });

  socket.on(SOCKET_EVENTS.ERROR, (res) => {
    console.log("[ERROR]", res);
  });

  socket.emit(SOCKET_EVENTS.IDENTIFY, {
    userId: 2,
  });




});

afterEach(function (done) {
  // Cleanup
  // if (socket.connected) {
  //   console.log("disconnecting...");
  //   socket.disconnect();
  // }
  done();
});

afterAll(async function () {


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

  return server.close();

});


// jest.useRealTimers('legacy')
describe("Message tests", function () {
  test('Success on sending a message', (done) => {
    // once connected, emit Hello World

    socket.on(SOCKET_EVENTS.MESSAGE, (payload) => {
      // Check that the message matches
      // console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("deleted", expect.any(Boolean))
      expect(payload).toHaveProperty("content", expect.any(String))
      expect(payload).toHaveProperty("GroupId", expect.any(Number))
      expect(payload).toHaveProperty("User", expect.any(Object))
      expect(payload.User).toHaveProperty("id", expect.any(Number))
      expect(payload.User).toHaveProperty("UserLanguages", expect.any(Array))
      expect(payload.User).toHaveProperty("Avatar", expect.any(Object))
      expect(payload.User.Avatar).toHaveProperty("url", expect.any(String))
      done();
    });

    socket.emit(SOCKET_EVENTS.MESSAGE, {
      content: "Hello World",
      UserId: 1,
      GroupId: 4,
      MediaId: 2
    });

    // server.on('connection', (mySocket) => {
    //   expect(mySocket).toBeDefined();
    // });
  });

  test('Send a message', (done) => {
    // once connected, emit Hello World

    socket.on(SOCKET_EVENTS.MESSAGE, (payload) => {
      // Check that the message matches
      // console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("deleted", expect.any(Boolean))
      expect(payload).toHaveProperty("content", expect.any(String))
      expect(payload).toHaveProperty("GroupId", expect.any(Number))
      expect(payload).toHaveProperty("User", expect.any(Object))
      expect(payload.User).toHaveProperty("id", expect.any(Number))
      expect(payload.User).toHaveProperty("UserLanguages", expect.any(Array))
      expect(payload.User).toHaveProperty("Avatar", expect.any(Object))
      expect(payload.User.Avatar).toHaveProperty("url", expect.any(String))
      done();
    });

    socket.emit(SOCKET_EVENTS.MESSAGE, {
      content: "Hello World",
      UserId: 1,
      GroupId: 4,
      MediaId: 2
    });

    // server.on('connection', (mySocket) => {
    //   expect(mySocket).toBeDefined();
    // });
  });

  test('Edit message success', (done) => {
    // once connected, emit Hello World

    socket.on(SOCKET_EVENTS.MESSAGE_EDIT, (payload) => {
      // Check that the message matches
      console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("deleted", expect.any(Boolean))
      expect(payload).toHaveProperty("content", expect.any(String))
      expect(payload).toHaveProperty("GroupId", expect.any(Number))
      expect(payload).toHaveProperty("User", expect.any(Object))
      expect(payload.User).toHaveProperty("id", expect.any(Number))
      expect(payload.User).toHaveProperty("UserLanguages", expect.any(Array))
      expect(payload.User).toHaveProperty("Avatar", expect.any(Object))
      expect(payload.User.Avatar).toHaveProperty("url", expect.any(String))
      done();
    });

    socket.emit(SOCKET_EVENTS.MESSAGE_EDIT, {
      content: "Hello Worldfsd",
      UserId: 2,
      GroupId: 1,
      MessageId: 2
    });


  });

  test('Failed on editing a message because the message does not exist', (done) => {
    // once connected, emit Hello World

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      // Check that the message matches
      console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("status", 404);
      expect(payload).toHaveProperty("message", "Unknown message");
      done();
    });

    socket.emit(SOCKET_EVENTS.MESSAGE_EDIT, {
      content: "Hello Worldfsd",
      UserId: 2,
      GroupId: 1,
      MessageId: 200
    });

  });

  test('Failed on edit a message because there is nothing sent', (done) => {
    // once connected, emit Hello World

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      // Check that the message matches
      console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", "data can't be empty");
      done();
    });

    socket.emit(SOCKET_EVENTS.MESSAGE_EDIT, null);

  });

  test('Failed on edit a message because there is no content', (done) => {
    // once connected, emit Hello World

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      // Check that the message matches
      console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", "Content is required to edit message");
      done();
    });

    socket.emit(SOCKET_EVENTS.MESSAGE_EDIT, {
      UserId: 2,
      GroupId: 1,
      MessageId: 200
    });

  });

  test('Failed on deleting a message because there is nothing sent', (done) => {
    // once connected, emit Hello World

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      // Check that the message matches
      console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", "data can't be empty");
      done();
    });

    socket.emit(SOCKET_EVENTS.MESSAGE_DELETE, null);

  });

  test('Failed on IDENTIFY', (done) => {
    // once connected, emit Hello World

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      // Check that the message matches
      console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", "Invalid userId");
      done();
    });

    socket.emit(SOCKET_EVENTS.IDENTIFY, {
      userId: 'test',
    });

  });

  test('Success on deleting a message ', (done) => {
    // once connected, emit Hello World

    socket.on(SOCKET_EVENTS.MESSAGE_DELETE, (payload) => {
      // Check that the message matches
      console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("deleted", expect.any(Boolean))
      expect(payload).toHaveProperty("content", expect.any(String))
      expect(payload).toHaveProperty("GroupId", expect.any(Number))
      expect(payload).toHaveProperty("User", expect.any(Object))
      expect(payload.User).toHaveProperty("id", expect.any(Number))
      expect(payload.User).toHaveProperty("UserLanguages", expect.any(Array))
      expect(payload.User).toHaveProperty("Avatar", expect.any(Object))
      expect(payload.User.Avatar).toHaveProperty("url", expect.any(String))
      done();
    });

    socket.emit(SOCKET_EVENTS.MESSAGE_DELETE, {
      content: "Hello Worldfsd",
      UserId: 2,
      GroupId: 1,
      MessageId: 2
    });

  });

  test('Failed on deleting a message because the message has already been deleted', (done) => {
    // once connected, emit Hello World

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      // Check that the message matches
      console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", "This message has already been deleted");
      done();
    });

    socket.emit(SOCKET_EVENTS.MESSAGE_DELETE, {
      content: "Hello Worldfsd",
      UserId: 2,
      GroupId: 1,
      MessageId: 2
    });

  });

  test("no groupid", (done) => {
    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      // console.log(payload, "<<<<< ERROR");
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", "Invalid groupId");
      done();
    });

    socket.emit("message", {
      content: "Hello World",
    });
  });

  test("invalid groupid", (done) => {
    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      // console.log(payload, "<<<<< ERROR");
      expect(payload).toHaveProperty("status", 404);
      expect(payload).toHaveProperty("message", "Unknown Group");
      done();
    });

    socket.emit("message", {
      content: "Hello World",
      GroupId: 4,
      UserId: 100
    });
  });

  test("no content", (done) => {
    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      console.log(payload, "<<<<< ERROR");
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", "One upload or text content is required");
      done();
    });

    socket.emit("message", {
      GroupId: 4,
      UserId: 2
    });
  });
});

describe("Video call", () => {
  test("success receive incoming call notification from caller", (done) => {
    socket.emit(SOCKET_EVENTS.CLICK_CALL, {
      userToCall: 2,
      from: 1,
    });

    socket.on(SOCKET_EVENTS.INCOMING_CALL, (payload) => {
      try {
        expect(payload).toHaveProperty("from", expect.any(Number));
        done();
      } catch (err) {
        done(err);
      }
    });
  })

  test("success receive incoming call notification from caller", (done) => {
    socket.emit(SOCKET_EVENTS.CLICK_CALL, {
      userToCall: 2,
      from: 1,
    });

    socket.on(SOCKET_EVENTS.INCOMING_CALL, (payload) => {
      expect(payload).toHaveProperty("from", expect.any(Number));
      done();
    });
  })

  test("failed receive incoming call notification from caller", (done) => {
    socket.emit(SOCKET_EVENTS.CLICK_CALL, {
      userToCall: 3,
      from: 1,
    });

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      console.log(payload, '<<<<PAYLOAD');
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", "User is offline");
      expect(payload).toHaveProperty("data", expect.any(Object));

      done();
    });
  })

  test("success cancel call", (done) => {
    socket.emit(SOCKET_EVENTS.CANCEL_CALL, {
      userToCall: 2,
      from: 1,
    });

    socket.on(SOCKET_EVENTS.CALL_IS_CANCELLED, (payload) => {
      try {
        expect(payload).toHaveProperty("from", expect.any(Number));
        done();
      } catch (err) {
        done(err);
      }
    });
  })

  test('Failed cancel call', (done) => {
    // once connected, emit Hello World

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      // Check that the message matches
      console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", "User is offline");
      done();
    });

    socket.emit(SOCKET_EVENTS.CANCEL_CALL, {
      userToCall: 3,
      from: 2,
    });

  });


  test("success decline call", (done) => {
    socket.emit(SOCKET_EVENTS.DECLINE_CALL, {
      userToDecline: 2,
      from: 1,
    });

    socket.on(SOCKET_EVENTS.CALL_IS_DECLINED, (payload) => {
      try {
        expect(payload).toHaveProperty("from", expect.any(Number));
        done();
      } catch (err) {
        done(err);
      }
    });
  })

  test('Failed decline call', (done) => {
    // once connected, emit Hello World

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      // Check that the message matches
      console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", "User is offline");
      done();
    });

    socket.emit(SOCKET_EVENTS.DECLINE_CALL, {
      userToDecline: 'test',
      from: 2,
    });

  });



  test("user leaves call", (done) => {
    socket.emit(SOCKET_EVENTS.LEAVE_CALL, {
      userToInform: 2,
      from: 1,
    });

    socket.on(SOCKET_EVENTS.USER_LEAVES_THE_CALL, (payload) => {
      try {
        expect(payload).toHaveProperty("from", expect.any(Number));
        done();
      } catch (err) {
        done(err);
      }
    });
  })

  test("failed leaves call", (done) => {
    socket.emit(SOCKET_EVENTS.LEAVE_CALL, {
      userToInform: 3,
      from: 2,
    });

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", 'User already left the call');
      done();
    });
  })

  test("user makes a video call connection", (done) => {

    socket.on(SOCKET_EVENTS.CALL_CONNECT, (payload) => {
      try {
        expect(payload).toHaveIn
        expect(payload.signal).toHaveProperty("type", expect.any(String));
        expect(payload.signal).toHaveProperty("sdp", expect.any(String));
        expect(payload).toHaveProperty("from", expect.any(Number));
        done();
      } catch (err) {
        done(err);
      }
    });

    socket.emit(SOCKET_EVENTS.CALL, {
      userToCall: 2,
      signalData: {
        type: 'offer',
        sdp: 'asdbkasuydas'
      },
      from: 1,
    });
  })

  test("failed to call because receiver is offline", (done) => {

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      // Check that the message matches
      console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", "User is offline");
      done();
    });

    socket.emit(SOCKET_EVENTS.CALL, {
      userToCall: 3,
      from: 2,
    });
  });


  test("user accepts video call connection", (done) => {
    socket.on(SOCKET_EVENTS.CONFIRM_ACCEPT_VIDEO, (payload) => {
      console.log(payload, '<<<<<PAYLOAD');
      expect(payload).toHaveProperty("from", 2);
      done();
    });

    socket.emit(SOCKET_EVENTS.ACCEPT_VIDEO, {
      userToReceive: 2,
      from: 2,
    });


  })

  test("failed because receiver is offline", (done) => {

    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      // Check that the message matches
      console.log(payload, '<<<< PAYLOAD');
      expect(payload).toHaveProperty("status", 400);
      expect(payload).toHaveProperty("message", "User is offline");
      done();
    });

    socket.emit(SOCKET_EVENTS.ACCEPT_VIDEO, {
      userToReceive: 3,
      from: 2,
    });
    // socket.disconnect();

  });


  test("user succeed to accept  call request", (done) => {
    socket.on(SOCKET_EVENTS.CALL_ACCEPT, (payload) => {
      console.log(payload, '<<<<<PAYLOAD');
      done();
    });

    socket.emit(SOCKET_EVENTS.ACCEPT_CALL, {
      to: 2,
      signal: { sdp: 'test' }
    });

  })

  test("user failed to accept  call request because target is offline", (done) => {
    socket.on(SOCKET_EVENTS.ERROR, (payload) => {
      console.log(payload, '<<<<<PAYLOAD');
      done();
    });

    socket.emit(SOCKET_EVENTS.ACCEPT_CALL, {
      to: 3,
      signal: { sdp: 'test' }
    });

  })





})
