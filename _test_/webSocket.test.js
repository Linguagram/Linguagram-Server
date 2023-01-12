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

describe("Suite of unit tests", function () {
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
      if (res.ok) done();
    });

    socket.on(SOCKET_EVENTS.ERROR, (res) => {
      console.log("[ERROR]", res);
    });

    socket.emit(SOCKET_EVENTS.IDENTIFY, {
      userId: 2,
    });

    socket1 = io("http://localhost:3010");

    socket1.on("connect", function () {
      console.log("worked...");
    });

    socket1.on("disconnect", function () {
      console.log("disconnected...");
    });

    socket1.on(SOCKET_EVENTS.IDENTIFY, (res) => {
      console.log("[IDENTIFY]", res);
      if (res.ok) done();
    });

    socket1.on(SOCKET_EVENTS.ERROR, (res) => {
      console.log("[ERROR]", res);
    });

    socket1.emit(SOCKET_EVENTS.IDENTIFY, {
      userId: 1,
    });



  });

  afterEach(function (done) {
    // Cleanup
    if (socket.connected) {
      console.log("disconnecting...");
      socket.disconnect();
      socket1.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log("no connection to break...");
    }
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

      socket.emit(SOCKET_EVENTS.MESSAGE_EDIT,  {
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
          console.log(payload,'<<<<PAYLOAD');
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
        expect(payload).toHaveProperty("message",  "User is offline");
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
        expect(payload).toHaveProperty("message",  "User is offline");
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
        expect(payload).toHaveProperty("message",  "User is offline");
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
        expect(payload).toHaveProperty("message",  "User is offline");
        done();
      });

      socket.emit(SOCKET_EVENTS.ACCEPT_VIDEO, {
        userToReceive: 3,
        from: 2,
      });
    });

    

    const signal = {
      "type": "offer",
      "sdp": "v=0\r\n" +
        "o=- 7883923864475113062 2 IN IP4 127.0.0.1\r\n" +
        "s=-\r\n" +
        "t=0 0\r\n" +
        "a=group:BUNDLE 0 1 2\r\n" +
        "a=extmap-allow-mixed\r\n" +
        "a=msid-semantic: WMS hGNJpMn3jKRSYUcJANgWbZaVNpmqGxVZteeM\r\n" +
        "m=audio 47877 UDP/TLS/RTP/SAVPF 111 63 103 104 9 0 8 106 105 13 110 112 113 126\r\n" +
        "c=IN IP4 180.254.14.51\r\n" +
        "a=rtcp: 9 IN IP4 0.0.0.0\r\n" +
        "a=candidate: 405768686 1 udp 2122260223 192.168.1.7 47877 typ host generation 0 network-id 1 network-cost 10\r\n" +
        "a=candidate: 3274484143 1 udp 1686052607 180.254.14.51 47877 typ srflx raddr 192.168.1.7 rport 47877 generation 0 network-id 1 network-cost 10\r\n" +
        "a=candidate: 3867499898 1 tcp 1518280447 192.168.1.7 9 typ host tcptype active generation 0 network-id 1 network-cost 10\r\n" +
        "a=ice-ufrag:SeOE\r\n" +
        "a=ice-pwd:sX59JNWURgC07AsysvMm+vbc\r\n" +
        "a=fingerprint:sha-256 F7:EF: 17: 75: 47:D0:D1: 06: 99: 89: 66:0E: 74:2E:DA:F5:AC:EE: 92:EE: 10:C3: 50: 41: 43:EE: 8B: 92: 68:F0: 03: 14\r\n" +
        "a=setup:actpass\r\n" +
        "a=mid: 0\r\n" +
        "a=extmap: 1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n" +
        "a=extmap: 2 http: //www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n" +
        "a=extmap: 3 http: //www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\n" +
        "a=extmap: 4 urn:ietf:params:rtp-hdrext:sdes:mid\r\n" +
        "a=sendrecv\r\n" +
        "a=msid:hGNJpMn3jKRSYUcJANgWbZaVNpmqGxVZteeM 31ad48b6-2d88-43d2-a247-b5a283064e12\r\n" +
        "a=rtcp-mux\r\n" +
        "a=rtpmap: 111 opus/48000/2\r\n" +
        "a=rtcp-fb: 111 transport-cc\r\n" +
        "a=fmtp: 111 minptime=10;useinbandfec=1\r\n" +
        "a=rtpmap: 63 red/48000/2\r\n" +
        "a=fmtp: 63 111/111\r\n" +
        "a=rtpmap: 103 ISAC/16000\r\n" +
        "a=rtpmap: 104 ISAC/32000\r\n" +
        "a=rtpmap: 9 G722/8000\r\n" +
        "a=rtpmap: 0 PCMU/8000\r\n" +
        "a=rtpmap: 8 PCMA/8000\r\n" +
        "a=rtpmap: 106 CN/32000\r\n" +
        "a=rtpmap: 105 CN/16000\r\n" +
        "a=rtpmap: 13 CN/8000\r\n" +
        "a=rtpmap: 110 telephone-event/48000\r\n" +
        "a=rtpmap: 112 telephone-event/32000\r\n" +
        "a=rtpmap: 113 telephone-event/16000\r\n" +
        "a=rtpmap: 126 telephone-event/8000\r\n" +
        "a=ssrc: 3619500373 cname:/0AiJmxPFwQUirp2\r\n" +
        "a=ssrc: 3619500373 msid:hGNJpMn3jKRSYUcJANgWbZaVNpmqGxVZteeM 31ad48b6-2d88-43d2-a247-b5a283064e12\r\n" +
        "m=video 46980 UDP/TLS/RTP/SAVPF 96 97 102 122 127 121 125 107 108 109 124 120 39 40 45 46 98 99 100 101 114 115 116\r\n" +
        "c=IN IP4 180.254.14.51\r\n" +
        "a=rtcp: 9 IN IP4 0.0.0.0\r\n" +
        "a=candidate: 405768686 1 udp 2122260223 192.168.1.7 46980 typ host generation 0 network-id 1 network-cost 10\r\n" +
        "a=candidate: 3274484143 1 udp 1686052607 180.254.14.51 46980 typ srflx raddr 192.168.1.7 rport 46980 generation 0 network-id 1 network-cost 10\r\n" +
        "a=candidate: 3867499898 1 tcp 1518280447 192.168.1.7 9 typ host tcptype active generation 0 network-id 1 network-cost 10\r\n" +
        "a=ice-ufrag:SeOE\r\n" +
        "a=ice-pwd:sX59JNWURgC07AsysvMm+vbc\r\n" +
        "a=fingerprint:sha-256 F7:EF: 17: 75: 47:D0:D1: 06: 99: 89: 66:0E: 74:2E:DA:F5:AC:EE: 92:EE: 10:C3: 50: 41: 43:EE: 8B: 92: 68:F0: 03: 14\r\n" +
        "a=setup:actpass\r\n" +
        "a=mid: 1\r\n" +
        "a=extmap: 14 urn:ietf:params:rtp-hdrext:toffset\r\n" +
        "a=extmap: 2 http: //www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n" +
        "a=extmap: 13 urn: 3gpp:video-orientation\r\n" +
        "a=extmap: 3 http: //www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\n" +
        "a=extmap: 5 http: //www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\n" +
        "a=extmap: 6 http: //www.webrtc.org/experiments/rtp-hdrext/video-content-type\r\n" +
        "a=extmap: 7 http: //www.webrtc.org/experiments/rtp-hdrext/video-timing\r\n" +
        "a=extmap: 8 http: //www.webrtc.org/experiments/rtp-hdrext/color-space\r\n" +
        "a=extmap: 4 urn:ietf:params:rtp-hdrext:sdes:mid\r\n" +
        "a=extmap: 10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\r\n" +
        "a=extmap: 11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\n" +
        "a=sendrecv\r\n" +
        "a=msid:hGNJpMn3jKRSYUcJANgWbZaVNpmqGxVZteeM 6985f785-1f43-48ab-9458-ad4ec157dcf0\r\n" +
        "a=rtcp-mux\r\n" +
        "a=rtcp-rsize\r\n" +
        "a=rtpmap: 96 VP8/90000\r\n" +
        "a=rtcp-fb: 96 goog-remb\r\n" +
        "a=rtcp-fb: 96 transport-cc\r\n" +
        "a=rtcp-fb: 96 ccm fir\r\n" +
        "a=rtcp-fb: 96 nack\r\n" +
        "a=rtcp-fb: 96 nack pli\r\n" +
        "a=rtpmap: 97 rtx/90000\r\n" +
        "a=fmtp: 97 apt=96\r\n" +
        "a=rtpmap: 102 H264/90000\r\n" +
        "a=rtcp-fb: 102 goog-remb\r\n" +
        "a=rtcp-fb: 102 transport-cc\r\n" +
        "a=rtcp-fb: 102 ccm fir\r\n" +
        "a=rtcp-fb: 102 nack\r\n" +
        "a=rtcp-fb: 102 nack pli\r\n" +
        "a=fmtp: 102 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f\r\n" +
        "a=rtpmap: 122 rtx/90000\r\n" +
        "a=fmtp: 122 apt=102\r\n" +
        "a=rtpmap: 127 H264/90000\r\n" +
        "a=rtcp-fb: 127 goog-remb\r\n" +
        "a=rtcp-fb: 127 transport-cc\r\n" +
        "a=rtcp-fb: 127 ccm fir\r\n" +
        "a=rtcp-fb: 127 nack\r\n" +
        "a=rtcp-fb: 127 nack pli\r\n" +
        "a=fmtp: 127 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f\r\n" +
        "a=rtpmap: 121 rtx/90000\r\n" +
        "a=fmtp: 121 apt=127\r\n" +
        "a=rtpmap: 125 H264/90000\r\n" +
        "a=rtcp-fb: 125 goog-remb\r\n" +
        "a=rtcp-fb: 125 transport-cc\r\n" +
        "a=rtcp-fb: 125 ccm fir\r\n" +
        "a=rtcp-fb: 125 nack\r\n" +
        "a=rtcp-fb: 125 nack pli\r\n" +
        "a=fmtp: 125 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\n" +
        "a=rtpmap: 107 rtx/90000\r\n" +
        "a=fmtp: 107 apt=125\r\n" +
        "a=rtpmap: 108 H264/90000\r\n" +
        "a=rtcp-fb: 108 goog-remb\r\n" +
        "a=rtcp-fb: 108 transport-cc\r\n" +
        "a=rtcp-fb: 108 ccm fir\r\n" +
        "a=rtcp-fb: 108 nack\r\n" +
        "a=rtcp-fb: 108 nack pli\r\n" +
        "a=fmtp: 108 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f\r\n" +
        "a=rtpmap: 109 rtx/90000\r\n" +
        "a=fmtp: 109 apt=108\r\n" +
        "a=rtpmap: 124 H264/90000\r\n" +
        "a=rtcp-fb: 124 goog-remb\r\n" +
        "a=rtcp-fb: 124 transport-cc\r\n" +
        "a=rtcp-fb: 124 ccm fir\r\n" +
        "a=rtcp-fb: 124 nack\r\n" +
        "a=rtcp-fb: 124 nack pli\r\n" +
        "a=fmtp: 124 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=4d001f\r\n" +
        "a=rtpmap: 120 rtx/90000\r\n" +
        "a=fmtp: 120 apt=124\r\n" +
        "a=rtpmap: 39 H264/90000\r\n" +
        "a=rtcp-fb: 39 goog-remb\r\n" +
        "a=rtcp-fb: 39 transport-cc\r\n" +
        "a=rtcp-fb: 39 ccm fir\r\n" +
        "a=rtcp-fb: 39 nack\r\n" +
        "a=rtcp-fb: 39 nack pli\r\n" +
        "a=fmtp: 39 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=4d001f\r\n" +
        "a=rtpmap: 40 rtx/90000\r\n" +
        "a=fmtp: 40 apt=39\r\n" +
        "a=rtpmap: 45 AV1/90000\r\n" +
        "a=rtcp-fb: 45 goog-remb\r\n" +
        "a=rtcp-fb: 45 transport-cc\r\n" +
        "a=rtcp-fb: 45 ccm fir\r\n" +
        "a=rtcp-fb: 45 nack\r\n" +
        "a=rtcp-fb: 45 nack pli\r\n" +
        "a=rtpmap: 46 rtx/90000\r\n" +
        "a=fmtp: 46 apt=45\r\n" +
        "a=rtpmap: 98 VP9/90000\r\n" +
        "a=rtcp-fb: 98 goog-remb\r\n" +
        "a=rtcp-fb: 98 transport-cc\r\n" +
        "a=rtcp-fb: 98 ccm fir\r\n" +
        "a=rtcp-fb: 98 nack\r\n" +
        "a=rtcp-fb: 98 nack pli\r\n" +
        "a=fmtp: 98 profile-id=0\r\n" +
        "a=rtpmap: 99 rtx/90000\r\n" +
        "a=fmtp: 99 apt=98\r\n" +
        "a=rtpmap: 100 VP9/90000\r\n" +
        "a=rtcp-fb: 100 goog-remb\r\n" +
        "a=rtcp-fb: 100 transport-cc\r\n" +
        "a=rtcp-fb: 100 ccm fir\r\n" +
        "a=rtcp-fb: 100 nack\r\n" +
        "a=rtcp-fb: 100 nack pli\r\n" +
        "a=fmtp: 100 profile-id=2\r\n" +
        "a=rtpmap: 101 rtx/90000\r\n" +
        "a=fmtp: 101 apt=100\r\n" +
        "a=rtpmap: 114 red/90000\r\n" +
        "a=rtpmap: 115 rtx/90000\r\n" +
        "a=fmtp: 115 apt=114\r\n" +
        "a=rtpmap: 116 ulpfec/90000\r\n" +
        "a=ssrc-group:FID 435125703 17807130\r\n" +
        "a=ssrc: 435125703 cname:/0AiJmxPFwQUirp2\r\n" +
        "a=ssrc: 435125703 msid:hGNJpMn3jKRSYUcJANgWbZaVNpmqGxVZteeM 6985f785-1f43-48ab-9458-ad4ec157dcf0\r\n" +
        "a=ssrc: 17807130 cname:/0AiJmxPFwQUirp2\r\n" +
        "a=ssrc: 17807130 msid:hGNJpMn3jKRSYUcJANgWbZaVNpmqGxVZteeM 6985f785-1f43-48ab-9458-ad4ec157dcf0\r\n" +
        "m=application 43195 UDP/DTLS/SCTP webrtc-datachannel\r\n" +
        "c=IN IP4 180.254.14.51\r\n" +
        "a=candidate: 405768686 1 udp 2122260223 192.168.1.7 43195 typ host generation 0 network-id 1 network-cost 10\r\n" +
        "a=candidate: 3274484143 1 udp 1686052607 180.254.14.51 43195 typ srflx raddr 192.168.1.7 rport 43195 generation 0 network-id 1 network-cost 10\r\n" +
        "a=candidate: 3867499898 1 tcp 1518280447 192.168.1.7 9 typ host tcptype active generation 0 network-id 1 network-cost 10\r\n" +
        "a=ice-ufrag:SeOE\r\n" +
        "a=ice-pwd:sX59JNWURgC07AsysvMm+vbc\r\n" +
        "a=fingerprint:sha-256 F7:EF: 17: 75: 47:D0:D1: 06: 99: 89: 66:0E: 74:2E:DA:F5:AC:EE: 92:EE: 10:C3: 50: 41: 43:EE: 8B: 92: 68:F0: 03: 14\r\n" +
        "a=setup:actpass\r\n" +
        "a=mid: 2\r\n" +
        "a=sctp-port: 5000\r\n" +
        "a=max-message-size: 262144\r\n"
    }

    test.skip("user fails to accept  call request", (done) => {
      socket1.on(SOCKET_EVENTS.CALL_ACCEPT, (payload) => {
        console.log(payload, '<<<<<PAYLOAD');
        done();
      });

      socket.emit(SOCKET_EVENTS.ACCEPT_CALL, {
        to: 1,
        signal : {sdp :'test'}
      });

    })


    

   
  })
});
