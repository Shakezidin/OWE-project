const express = require("express");
const cors = require("cors");

const { WebClient } = require("@slack/web-api");
const { App } = require("@slack/bolt");
const http = require("http");
const { Server } = require("socket.io");

const createUniqueChannelName = require("./src/utils/createUniqueChannelName");
const getSupportChannel = require("./src/utils/getSupportChannel");

const { startChatSchema } = require("./src/validations");
const config = require("./src/config");
const schedule = require("node-schedule");
const ms = require("ms");

const { Client } = require("pg");

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST2,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
});

const app = express();
const port = process.env.PORT;

app.use(cors({ origin: "*" }));
// Create an HTTP server for socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const web = new WebClient(config.botToken);

// Database
const channels = {};
const userSockets = new Map();
const jobs = {};

const slackApp = new App({
  appToken: config.slackAppToken,
  socketMode: true,
  token: config.botToken,
});

slackApp.event("member_joined_channel", async ({ event }) => {
  console.log("User joined channel:", event);
});

slackApp.event("channel_joined", async ({ event }) => {
  console.log("Channel joined:", event);
});

slackApp.event("channel_deleted", async ({ event }) => {
  console.log("Channel deleted:", event);
  if (event.type === "channel_deleted") {
    delete channels[event.channel];
    if (!userSockets.get(event.channel)) {
      console.log("Channel does not exists");
      return;
    }
    io.to(userSockets.get(event.channel)).emit("success", {
      event_name: "channel_deleted",
    });
  }
});

slackApp.message(async ({ message }) => {
  console.log(message);
  if (message.subtype === undefined) {
    console.log("Message received:", message);
    const job = jobs[message.channel];
    if (job) {
      job.cancel();
      console.log(jobs);
      delete jobs[message.channel];
      console.log(jobs);
    }

    if (!userSockets.get(message.channel)) {
      console.log("Channel does not exists");
      return;
    }
    io.to(userSockets.get(message.channel)).emit("success", {
      event_name: "new_message",
      message: message.text,
    });
  }
});

slackApp.start();

client.connect();

io.on("connection", (socket) => {
  console.log("Connection", socket.id);
  // Handle incoming chat messages from the client
  socket.on("start-chat", async (data) => {
    try {
      console.log("start-chat", data);
      const { name, email, message, issueType, project_id } = data;

      console.log("DATA", data);
      startChatSchema.validateSync(data);

      const channelName = createUniqueChannelName(name, email);

      console.log(channelName);

      // Create a new Slack channel
      if (!channels[channelName]) {
        // get info
        const result = await web.conversations.list();

        // Filter channels by name
        const channel = result.channels.find((c) => c.name === channelName);

        console.log("Channel List not found", channel);
        if (channel) {
          channels[channelName] = channel;
        } else {
          const result = await web.conversations.create({
            name: channelName,
            is_private: false,
          });

          channels[channelName] = result.channel;
        }
      }
      console.log(channels);
      const channelId = channels[channelName].id;

      // Send a message to the created Slack channel
      // await web.chat.postMessage({
      //   channel: channelId,
      //   text: message,
      // });

      userSockets.set(channelId, socket.id);

      console.log("channelId", channelId);

      const queryText = `SELECT unique_id, home_owner, customer, podio_link, primary_sales_rep  FROM sales_metrics_schema where unique_id = '${project_id}' AND primary_sales_rep='${primary_sales_rep}';`;

      const res = await client.query(queryText);
      if (res?.rows?.length) {
        // Notify a designated Slack channel about the new message
        const data = res.rows.pop();
        await web.chat.postMessage({
          channel: getSupportChannel(issueType),
          text: `${data.primary_sales_rep} wants to query ${data.unique_id}  for customer ${data.customer} and  pod link is ${data.podio_link} 
          Reply : <#${channelId}|${channelName}>`,
        });
      } else {
        throw new Error("Project not found");
      }

      const runAt = new Date(Date.now() + ms(config.noReplyRespondTime)); // 2 minutes in the future

      // Schedule the job
      const job = schedule.scheduleJob(runAt, () => {
        // Send a message to the created Slack channel
        socket.emit("success", {
          event_name: "new_message",
          message:
            "Currently, no one availble to respond, we will connect you soon! Thank you for your patience",
        });
      });

      jobs[channelId] = job;

      // Emit the message to all connected socket.io clients
      socket.emit("success", {
        event_name: "start-chat",
        message: "Chat Started Successfully",
        data: {
          channelName,
        },
      });
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  // Handle incoming general messages from the client
  socket.on("send-message", async (data) => {
    const { message, channelName } = data;

    try {
      const channelId = channels[channelName]?.id;

      if (!channelId) {
        throw new Error("No Chanel Found");
      }

      // Send a message to the created Slack channel
      await web.chat.postMessage({
        channel: channelId,
        text: message,
      });

      socket.emit("success", {
        event_name: "send-message",
        message: "Message Sent Successfully",
      });
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Start the server with socket.io
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
