'use strict';
var builder = require('botbuilder');
var Roll = require('roll');
var config = require('./config');
var express = require('express');

const app = express();

// Setup Express Server
app.listen(process.env.port || process.env.PORT || 3978, '::', () => {
    console.log('Server Up');
});
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
app.post('/api/messages', connector.listen());

// Create endpoint for agent / call center
app.use('/webchat', express.static('public'));

var bot = new builder.UniversalBot(connector, function(session) {
  session.send('Try one of these commands: help');
});

// Answer help related questions like "what can I say?"
bot.dialog('helpDialog', function (session) {
  let sendStr = "Supported Commands:\n\n"
    + "* roll <xdy>: Roll a die. (e.g. roll 3d6)\n"
    + "* character: Create a new character\n"
    + "* whoami: See character details";
  session.send(sendStr);
  // Send help message and end dialog.
  session.endDialog('Help complete');
}).triggerAction({ matches: /help/i });

bot.dialog('rollDialog', (session, args) => {
  try { 
    let inputSplit = args.intent.matched.input.split(' ');
    let roll = new Roll();
    let result = roll.roll(inputSplit[1]).result;
    session.endDialog('You rolled the following die: ' + inputSplit[1] + '.  Result: ' + result);
  } catch (e) {
    session.endDialog('I do not understand the command.  Try "roll 3d6"');
  }
}).triggerAction({ matches: /roll/i });

bot.dialog('createCharacterDialog', [
  (session) => {
    session.userData.character = {};
    builder.Prompts.text(session, 'What do you want to name your character?');
  },
  (session, results) => {
    session.userData.character.name = results.response;
    session.send('Welcome, ' + session.userData.character.name);
    builder.Prompts.choice(session, "What race?", Object.keys(config.races));
  },
  (session, results) => {
    session.userData.character.race = results.response.entity;
    session.send(session.userData.character.race + ' is a good choice.');
    builder.Prompts.choice(session, "What class?", Object.keys(config.classes));
  },
  (session, results) => {
    session.userData.character.class = results.response.entity;
    session.endDialog(session.userData.character.class + ' is a good choice.');
  }
]).triggerAction({ matches: /character/i });


bot.dialog('whoami', (session) => {
  if (!session.userData.character) {
    session.endDialog('You need to create a character first.  Type: character');
  } else {
    let response = 'name: ' + session.userData.character.name + "\n\n"
      + 'race: ' + session.userData.character.race + "\n\n"
      + 'class: ' + session.userData.character.class;
      session.endDialog(response);
  }
}).triggerAction({ matches: /whoami/i });

/*
bot.dialog('card', (session) => {
    let card = new builder.AnimationCard(session)
        .title('Microsoft Bot Framework')
        .subtitle('Animation Card')
        .media([
            { url: 'http://i.giphy.com/Ki55RUbOV5njy.gif' }
        ]);
    var msg = new builder.Message(session).addAttachment(card);
    session.send(msg);
}).triggerAction({ matches: /card/i });
*/
/*
var restify = require('restify');
var server = restify.createServer();
server.listen(3978, function () {
  console.log('test bot endpont at http://localhost:3978/api/messages');
});
server.post('/api/messages', connector.listen());
*/