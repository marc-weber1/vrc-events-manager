const { Client, Intents } = require('discord.js');

//IN PROGRESS, NO FUNCTIONALITY YET


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});


// Club invite commands

client.on('interactionCreate', async interaction => {
    return interaction.reply("Pong!");
});




// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);

