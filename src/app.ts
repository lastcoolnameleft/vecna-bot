'use strict';
import * as builder from 'botbuilder';
import * as argv from 'yargs';
import * as Roll from 'roll';

var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID ? process.env.MICROSOFT_APP_ID : argv.id,
  appPassword: process.env.MICROSOFT_APP_PASSWORD ? process.env.MICROSOFT_APP_PASSWORD : argv.password
});

var bot = new builder.UniversalBot(connector, function(session) {
  session.send('Try one of these commands: help');
});

// Answer help related questions like "what can I say?"
bot.dialog('helpDialog', function (session) {
  let sendStr = "Supported Commands:\n\n"
    + "* roll <xdy>: Roll a die. (e.g. roll 3d6)\n"
    + "* character: Create a new character\n";
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
    session.dialogData.character = {};
    builder.Prompts.text(session, 'What do you want to name your character?');
  },
  (session, results) => {
    console.log(results.response);
    session.dialogData.character.name = results.response;
    session.send('Welcome, ' + session.dialogData.character.name);
    builder.Prompts.choice(session, "What race?", 'Human|Dwarf|Elf');
  },
  (session, results) => {
    console.log(results.response);
    session.dialogData.character.race = results.response.entity;
    session.send(session.dialogData.character.race + ' is a good choice.');
    builder.Prompts.choice(session, "What class?", 'Wizard|Rogue|Warrior');
  },
  (session, results) => {
    console.log(results.response);
    session.dialogData.character.class = results.response.entity;
    session.send(session.dialogData.character.class + ' is a good choice.');
    console.log(session.dialogData);
    session.endDialogWithResult({ response: session.dialogData });
  }
]).triggerAction({ matches: /character/i });

bot.dialog('whoami', (session) => {
  console.log(session.dialogData);
  if (!session.dialogData.character) {
    session.endDialog('You need to create a character first.  Type: character');
  } else {
    let response = 'name: ' + session.dialogData.character.name + "\n"
      + 'race: ' + session.dialogData.character.race + "\n"
      + 'class: ' + session.dialogData.character.class + "\n";
      session.endDialogWithResult(response);
  }
}).triggerAction({ matches: /whoami/i });

var restify = require('restify');
var server = restify.createServer();
server.listen(3978, function () {
  console.log('test bot endpont at http://localhost:3978/api/messages');
});
server.post('/api/messages', connector.listen());
