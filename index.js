//Ruby Bot: Created By Cory Sheppard

const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const fs = require("fs");
bot.commands = new Discord.Collection();
const ytdl = require("ytdl-core");

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach((f, i) =>{
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });

});

prefix = "r!";

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity(`r!help | ${bot.guilds.size} servers!`);
})

bot.on("message", async message => {
    if(message.author.bot) return;

    let prefix = "r!";
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot, message, args);

        // Music Bot Code

        if(message.author.bot) return undefined;
        if(!message.content.startsWith(prefix)) return undefined;
    
        if(message.content.startsWith(`${prefix}play`)) {
    
            const voiceChannel = message.member.voiceChannel;
            if(!voiceChannel) return message.channel.send("You need to be in a voice channel!");
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if(!permissions.has("CONNECT")) return message.channel.send("I don't have permission to connect to your channel.");
            if(!permissions.has("SPEAK")) return message.channel.send("I cannot speak in this voice channel. Edit my permissions.");
    
            try {
    
                var connection = await voiceChannel.join();
    
            } catch (error) {
    
                console.error(error);
    
            }
    
            const dispatcher = connection.playStream(ytdl(args[0]))
                .on("end", () => {
    
                    console.log("Song ended!");
                    voiceChannel.leave();
    
                })
                .on("error", error => {
    
                    console.error(error);
    
                });
    
            dispatcher.setVolumeLogarithmic(5 / 5);
    
        } else if (message.content.startsWith(`${prefix}stop`)) {
    
            if(!message.member.voiceChannel) return message.channel.send("You're not in a voice channel!");
            message.member.voiceChannel.leave();
            return undefined;
    
        }
    
        // Music Bot Code Over.

});

bot.on('guildMemberAdd', member => {

    member.send(`:wave: Welcome to the ${member.guild.name} server, ${member}!`);

});

bot.login(process.env.BOT_TOKEN);
