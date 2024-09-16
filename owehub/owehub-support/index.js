const express = require("express");
const cors = require("cors");

const { WebClient } = require("@slack/web-api");
const { App } = require("@slack/bolt");
const http = require("http");
const { Server } = require("socket.io");

const createUniqueChannelName = require("./src/utils/createUniqueChannelName");

const { startChatSchema } = require("./src/validations");
const config = require("./src/config");
const schedule = require("node-schedule");
const ms = require("ms");

const { Client } = require("pg");

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
});
const client2 = new Client({
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

function startSlackListner(slackAppToken, botToken) {
  if (!slackAppToken || !botToken) return;
  const slackApp = new App({
    appToken: slackAppToken,
    socketMode: true,
    token: botToken,
  });

  slackApp.event("member_joined_channel", async ({ event }) => {
    console.log("User joined channel:", event);
  });

  slackApp.event("channel_joined", async ({ event }) => {
    console.log("Channel joined:", event);
  });

  slackApp.event("channel_deleted", async ({ event }) => {
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
    if (message.subtype === undefined) {
      console.log("Message received:", message);
      const job = jobs[message.channel];
      if (job) {
        job.cancel();
        delete jobs[message.channel];
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
}
let allChannels = null;

async function getChannels() {
  allChannels = await client.query(
    "SELECT * from slackconfig where is_archived=false"
  );
  allChannels = allChannels?.rows;
}
(async () => {
  try {
    await client.connect();
    await client2.connect();
    await getChannels();
    if (allChannels?.length)
      startSlackListner(
        allChannels[0].slack_app_token,
        allChannels[0].bot_token
      );
  } catch (error) {
    console.log(error);
  }
})();

function getChannelID(issueType) {
  if (!allChannels) {
    throw new Error("No channels are found");
  }
  const channel = allChannels.find((c) => c.issue_type === issueType);
  if (channel) {
    return channel.channel_id;
  }
  throw new Error("No channels are found");
}

io.on("connection", (socket) => {
  console.log("Connection", socket.id);
  // Handle incoming chat messages from the client

  socket.on("update-channels", async () => {
    await getChannels();
    console.log("update-channels");
    socket.emit("success", {
      event_name: "update-channels",
      message: allChannels?.length
        ? allChannels.map((c) => {
            return { name: c.channel_name, issueType: c.issue_type };
          })
        : [],
    });
  });

  socket.on("channels", () => {
    socket.emit("success", {
      event_name: "channels",
      message: allChannels?.length
        ? allChannels.map((c) => {
            return { name: c.channel_name, issueType: c.issue_type };
          })
        : [],
    });
  });

  socket.on("start-chat", async (data) => {
    try {
      console.log("start-chat", data);

      const { name, email, issueType, project_id } = data;

      console.log("DATA", data);
      startChatSchema.validateSync(data);

      const channelName = createUniqueChannelName(name, email);

      console.log(channelName);

      // Create a new Slack channel
      if (!channels[channelName]) {
        // get info
        const result = await web.conversations.list();

        console.log(result);
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
      const channelId = channels[channelName].id;

      // Send a message to the created Slack channel
      // await web.chat.postMessage({
      //   channel: channelId,
      //   text: "Hi",
      // });

      console.log(issueType);
      userSockets.set(channelId, socket.id);

      console.log("channelId", channelId);
      const userExists = await client.query(
        `SELECT * from user_details where email_id='${email}'`
      );

      if (!userExists?.rows?.length) {
        throw new Error("User not found");
      }

      const user = userExists?.rows?.pop();

      if (issueType === "Technical Support") {
        await web.chat.postMessage({
          channel: getChannelID(issueType),
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `:warning: *Need Technical Support*\n*Sales Rep:* ${user.name}\n*Email:* ${user.email_id}\n\nReply in channel: <#${channelId}|${channelName}>`,
              },
            },
          ],
          text: `${user.name} need technical support.`,
        });
      } else {
        const res =
          await client2.query(`SELECT unique_id, home_owner, customer, podio_link, primary_sales_rep  
                            FROM sales_metrics_schema 
                            where unique_id = '${project_id}' AND primary_sales_rep='${user.name}'`);
        if (res?.rows?.length) {
          // Notify a designated Slack channel about the new message
          const data = res.rows.pop();
          await web.chat.postMessage({
            channel: getChannelID(issueType),
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `:warning: *Issue in Project*\n*Sales Rep:* ${data.primary_sales_rep}\n*Project ID:* ${data.unique_id}\n*Customer:* ${data.customer}\n*Podio Link:* <${data.podio_link}|Project Podio>\n\nReply in channel: <#${channelId}|${channelName}>`,
                },
              },
            ],
            text: `${data.primary_sales_rep} has an issue in project ${data.unique_id}.`,
          });
        } else {
          socket.emit("success", {
            event_name: "new_message",
            message:
              "Sorry, We did'nt find any project with the provided Id, please try again.",
          });
          return;
        }
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
