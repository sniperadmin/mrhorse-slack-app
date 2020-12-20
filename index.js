require('dotenv').config();
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message(/hello|hi|welcome/, async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    text: `Hey there <@${message.user}>! This is Mr. horse :sunglasses:`,
    channel: message.channel
  });
});

app.message('how are you', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`I am all right! <@${message.user}>!`);
});

app.event('app_mention', async ({ event, client }) => {
  try {
    // Call chat.postMessage with the built-in client
    const result = await client.chat.postMessage({
      channel: event.channel,
      text: `Mr. horse is here, <@${event.user}>! How can I help?`,
      "blocks": [
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Connect account",
                "emoji": true
              },
              "value": "click_me_123"
            }
          ]
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Here are my list of commands:"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "• `/echo` + some text \n • `/list` \n"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Great to see you here!"
          }
        }
      ]
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

app.command('/echo', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  await say(`${command.text}`);
});

app.command('/list', async ({ command, ack, say }) => {
  await ack();
  await say({
    
  })
});

app.action('actionId-0', async ({ body, ack, say }) => {
  await ack();
  await say(`Nice! ${body.user} clicked button!`);
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
