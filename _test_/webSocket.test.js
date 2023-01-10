const io = require("socket.io-client");
const { io: server } = require("../app");
const { SOCKET_EVENTS } = require("../util/ws");

describe("Suite of unit tests", function() {
  server.attach(5000);
  let socket;

  beforeEach(function(done) {
    // Setup
    socket = io("http://localhost:5000");

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

  afterAll(function(done) {
    socket.disconnect();
    server.close();
    done();
  });

  describe.skip("Chat tests", function() {
    test("should work", (done) => {
      socket.emit("message", {
        content: "Hello World",
        UserId: 1,
        GroupId: 1,
      });

      socket.on("message", (payload) => {
        try {
          console.log(payload);
          expect(payload).toHaveProperty("User");
          expect(payload).toHaveProperty("message");
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
