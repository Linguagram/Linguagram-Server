const io = require('socket.io-client');
const { io: server } = require("../app");
const { SOCKET_EVENTS } = require("../util/ws");


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

  describe("Chat tests", function () {
    test('should communicate', (done) => {
      // once connected, emit Hello World
      server.emit('message', {
        content: "Hello World",
        UserId: 1,
        GroupId: 1,
      });
      
      socket.once('message', (payload) => {
        // Check that the message matches
        console.log(payload,'<<<');
        expect(payload).toEqual(expect.any(Object));
        expect(payload).toHaveProperty("UserIds");
        expect(payload).toHaveProperty("GroupId");;
        done();
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
