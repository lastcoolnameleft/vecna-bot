# vecna-bot
A D&amp;D bot using MS BotFramework.  

I was going to call it the "Gaze-bot/Gazebo-t, after [my favorite D&D story](http://www.netfunny.com/rhf/jokes/98/Jul/gazebo.html), but was concerned the name wouldn't read well in text as it does in my head.

## Background

This bot is uses the [MS BotFramework](https://dev.botframework.com/) to build a simple D&D character builder.  It's not very impressive yet.  I haven't even told my mom about it.

## F%#@-it!  We'll do it live!

Check out my live implementation of it running on Azure App Service for Linux using Docker: [Click here](https://vecna-bot.azurewebsites.net/webchat/?s=NLmdeZuEgUU.cwA.fpA.oHDBKRnwOno6wfCFFfasLHMtyREPp73-1NWGAYOeOBU)

*NOTE* If it's not running, I must have broken something as I'm still experimenting.  Feel free to open an issue and/or clone and run locally.

## Install

* Download and run the MS Bot Framework Emulator
  * https://docs.botframework.com/en-us/tools/bot-framework-emulator/
```
git clone git@github.com:lastcoolnameleft/vecna-bot.git
cd vecna-bot
npm install
```


## Run

```
npm run build-watch
npm run run-watch
```

* Start the Bot Framework Emulator
* Use the default settings
* Type "help" to get the system primed.
  
