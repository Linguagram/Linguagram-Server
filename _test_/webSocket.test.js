const io = require('socket.io-client');
const { io: server } = require("../app");
const { SOCKET_EVENTS } = require("../util/ws");
let friendships = require('../data/friendships.json')
let groupMembers = require('../data/groupMembers.json')
let groups = require('../data/groups.json')
const { sequelize } = require('../models')
const media = require('../data/media.json')
const users = require('../data/users.json')
const messages = require('../data/messages.json')
const languages = require('../data/languages.json')
const schedules = require('../data/schedules.json')
const userLanguages = require('../data/userLanguages.json')
const userSchedules = require('../data/userSchedules.json')
const interests = require('../data/interests.json')
const userInterests = require('../data/userInterests.json');
const { generateHash } = require('../helpers/bcryptjs');


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
  // await sequelize.queryInterface.bulkDelete('Media', {}, {
  //     truncate: true, restartIdentity: true, cascade: true
  // })

  // await sequelize.queryInterface.bulkDelete('Users', {}, {
  //     truncate: true, restartIdentity: true, cascade: true
  // })

  // await sequelize.queryInterface.bulkDelete('Friendships', {}, {
  //     truncate: true, restartIdentity: true, cascade: true
  // })

  // await sequelize.queryInterface.bulkDelete('Groups', {}, {
  //     truncate: true, restartIdentity: true, cascade: true
  // })

  // await sequelize.queryInterface.bulkDelete('Messages', {}, {
  //     truncate: true, restartIdentity: true, cascade: true
  // })

  // await sequelize.queryInterface.bulkDelete('GroupMembers', {}, {
  //     truncate: true, restartIdentity: true, cascade: true
  // })

  // await sequelize.queryInterface.bulkDelete('Languages', {}, {
  //     truncate: true, restartIdentity: true, cascade: true
  // })

  // await sequelize.queryInterface.bulkDelete('Schedules', {}, {
  //     truncate: true, restartIdentity: true, cascade: true
  // })

  // await sequelize.queryInterface.bulkDelete('UserLanguages', {}, {
  //     truncate: true, restartIdentity: true, cascade: true
  // })

  // await sequelize.queryInterface.bulkDelete('UserSchedules', {}, {
  //     truncate: true, restartIdentity: true, cascade: true
  // })

  // await sequelize.queryInterface.bulkDelete('Interests', {}, {
  //     truncate: true, restartIdentity: true, cascade: true
  // })

  // await sequelize.queryInterface.bulkDelete('UserInterests', {}, {
  //     truncate: true, restartIdentity: true, cascade: true
  // })


})

describe("Suite of unit tests", function () {
  server.attach(3010);
  let socket;

  beforeEach(function (done) {
    // Setup
    socket = io("http://localhost:3010");

    socket.on("connect", function () {
      console.log("worked...");
      done();
    });
    socket.on("disconnect", function () {
      console.log("disconnected...");
    });
  });

  afterEach(function (done) {
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

  afterAll(function (done) {
    socket.disconnect();
    server.close();
    done();
  });


  jest.useRealTimers('legacy')
  describe("Chat tests", function () {
    test('should communicate', (done) => {
      // once connected, emit Hello World
      
      server.once(SOCKET_EVENTS.MESSAGE, (payload) => {
        // Check that the message matches
        console.log(payload, '<<<');
        expect(payload).toEqual(expect.any(Object));
        expect(payload).toHaveProperty("UserIds");
        expect(payload).toHaveProperty("GroupId");;
        done();
      });
      
      socket.emit(SOCKET_EVENTS.MESSAGE, {
        content: "Hello World",
        UserId: 1,
        GroupId: 1,
      });
      

    



      // server.on('connection', (mySocket) => {
      //   expect(mySocket).toBeDefined();
      // });
    });




    test.skip("should work", (done) => {
      socket.emit("message", {
        content: "Hello World",

      });

      socket.on("message", (payload) => {
        try {
          console.log(payload);
          expect(payload).toHaveProperty("content");
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe.skip("Video call", () => {

    test("success receive incoming call notification from caller", () => {
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

    test("success cancel call", () => {
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


    test("success decline call", () => {
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

    test("user leaves call", () => {
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

    test("user makes a video call connection", () => {
      socket.emit(SOCKET_EVENTS.CALL, {
        userToCall: 2,
        signalData: 'P24asdAKUs141yssAsd',
        from: 1,
      });

      socket.on(SOCKET_EVENTS.CALL_CONNECT, (payload) => {
        try {
          expect(payload).toHaveProperty("signal", expect.any(String));
          expect(payload).toHaveProperty("from", expect.any(Number));
          done();
        } catch (err) {
          done(err);
        }
      });
    })

    test("user accepts video call connection", () => {
      socket.emit(SOCKET_EVENTS.ACCEPT_VIDEO, {
        signal: 'P24asdAKUs141yssAsd',
        incomingCaller: 1,
      });

      socket.on(SOCKET_EVENTS.CONFIRM_ACCEPT_VIDEO, (payload) => {
        try {
          expect(payload).toHaveProperty("from", expect.any(Number));
          done();
        } catch (err) {
          done(err);
        }
      });
    })


  })


});
