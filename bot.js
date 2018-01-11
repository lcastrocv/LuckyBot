const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
bot.botSettings = botSettings;
const InvCache = require("./modules/invites.js");
bot.invCache = new InvCache(bot);

//Required Files

require("./server_settings.js")(bot);
require("./handlers/messagehnd.js")(bot);
require("./handlers/msgupdate.js")(bot);
require("./handlers/guildmemberadd.js")(bot);
require("./handlers/guildcreate.js")(bot);
require("./handlers/msgdelete.js")(bot);
require("./handlers/memberleave.js")(bot);

//Generates join link and shows ready status.

bot.on("ready", async () => {
    console.log('Ready');
    try {
        let link = await bot.generateInvite();
        console.log(link);
    } catch (error) {
        console.log(error.stack);
    }

    bot.user.setGame(`on ${bot.guilds.size} servers | *help for list of commands`)
    bot.guilds.forEach(guild => {
        bot.invCache.guildInvites(guild).catch(console.error);
    });
});

//When the bot joins a server.

bot.on("guildCreate", guild => {
    bot.initServerSettings(guild.id);
    bot.invCache.guildInvites(guild).catch(console.error);
    bot.user.setGame(`on ${bot.guilds.size} servers | *help for list of commands`);
    guildCreateHandler(guild);
});

//When the bot leaves a server. 

bot.on("guildDelete", guild => {
    bot.delServerSettings(guild.id);
    bot.user.setGame(`on ${bot.guilds.size} servers | *help for list of commands`);
});

//All the commands the bot runs.

bot.on("message", async message => {
    msgHandler(message);
});

//When a message is updated.

bot.on("messageUpdate", (oldMessage, message) => {
    msgUpdateHandler(oldMessage, message);
});

//When a message is deleted.

bot.on("messageDelete", message => {
    delHandler(message);
});

//When a member joins a server.

bot.on("guildMemberAdd", member => {
    memberJoinHandler(member);
});

//When a member leaves a server.

bot.on("guildMemberRemove", member => {
    leaveHandler(member);
});

bot.login(botSettings.token);

//SHIFT ALT F to format