const dotenv = require("dotenv");
const fs = require("fs").promises;
const path = require("path");

// dotenv.config();

const {TOKEN, PREFIX} = require("./envbroke.json");
// const token = process.env.TOKEN;
// const prefix = process.env.PREFIX;

const {Client, Events, GatewayIntentBits} = require("discord.js");
const intents = GatewayIntentBits;
const client = new Client({intents: [intents.Guilds, intents.MessageContent, intents.GuildMessages]});


client.login(TOKEN);
client.commands = new Map();
client.once(Events.ClientReady, readyClient => {
  console.log("Time to learnington. Remember, you're worth the time it takes to learn something new!");
});

client.on("messageCreate", (message) => {
    console.log(message.content);
  if (message.author.bot) return;
  if(!message.content.startsWith(PREFIX)) return;

  let [command, ...args] = message.content
      .toLowerCase()
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);  
   
  if (client.commands.get(command)) {
    client.commands.get(command).run(client, message, args);
  } else {
    console.log("Command doesn't exist");
  }
});

(commandRegister = async (dir = "commands") => {
  let files = await fs.readdir(path.join(__dirname, dir));
  console.log(files);

  for (let file of files) {
    let stat = await fs.lstat(path.join(__dirname, dir, file));
    if (stat.isDirectory()) commandRegister(path.join(dir, file));
    else {
      if (file.endsWith(".js")) {
        let cmdName = file.substring(0, file.indexOf(".js"));
        let cmdModule = require(path.join(__dirname, dir, file));
        client.commands.set(cmdName, cmdModule);
        console.log(client.commands);
      }
    }
  }
})();