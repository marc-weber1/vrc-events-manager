const { Telegraf, Context, Markup } = require('telegraf');
const { sq, User, Instance } = require('@facade/vrc-events-db-model');

const admins = [
    156638024, // facade
];

const verify_chat = process.env.VERIFY_CHAT; // admin chat

// Escape all characters chars in s by inserting escape_char before them
function escape_chars(s, chars, escape_char) {
    let s_arr = s.split("");
    let s_arr_escaped = s_arr.map(c => {
	if( c in chars.split("") ) {
	    return escape_char + c;
	}
	return escape_char;
    });
    return s_arr_escaped.join("");
}
// Escape markdown characters (unused so far)
function markdown_escape(s) {
    return escape_chars(s, "*#/()[]<>_", "\\");
}


const token = process.env.BOT_TOKEN;
if(!token) {
    throw new Error('No BOT_TOKEN found');
}
const bot = new Telegraf(token);


bot.start((ctx) => {
    return ctx.reply('Welcome >:3c\n\nTo get in, send a link to your VRChat profile and wait to get approved (Log in to https://vrchat.com/home click on your own name and copy the URL)');
});

bot.command("verify", (ctx) => {
    if( admins.includes(ctx.chat.id) || ctx.chat.id == verify_chat ) {
        try{
            var msg = ctx.message.text.substring(ctx.message.text.indexOf(' ') + 1);
            console.log(msg);
            var args = JSON.parse(msg);

            if (! Array.isArray(args)) {
                args = [args];
            }

            return Promise.all(args.map(arg => {
                    // Replace any usernames with IDs?

                    return User.findOrCreate({where: arg})
                        .then(([user, created]) => {
                            console.log(user);
                            user.over_18 = true;
                            return user.save();
                        })
                        .then(async (res) => {
                            if( arg.telegram_id != null ){
                                await ctx.telegram.sendMessage(arg.telegram_id, "You have now been verified! Use /join to get into the club.")
                                        .catch(e => {console.log(e.toString())}); //No worries if we can't notify them
                            }

                            return Promise.resolve(res);
                        })
                }))
                .then(res => {
                    console.log( JSON.stringify(res) );
                    return ctx.reply( JSON.stringify(res, null, 2) );
                })
                .catch((err) => {
                    return ctx.reply(err.toString());
                });
        }
        catch(e) {
            return ctx.reply(e.toString());
        }
    }
});


bot.command("join", (ctx) => {

    if(ctx.chat.id > 0) { // No groups
        return User.findOrCreate({where: {telegram_id: ctx.chat.id}})
            .then(([user, created]) => {
                if( user.vrchat_id == null ) {
                    ctx.reply("First, give me a link to your vrchat profile. (Log in to https://vrchat.com/home click on your own name and copy the URL)");
                }
                else if( ! user.over_18 ){
                    ctx.reply("Please wait for a moderator to confirm you as 18+, and then try to /join again.");
                }
                else {
                    return Instance.findOne({where: {name: process.env.INSTANCE_NAME}})
                        .then(res => {
                            return ctx.reply(
                                "Join with this link:\nhttps://vrchat.com/home/launch?worldId="
                                + res.world_id
                                + "&instanceId="
                                + res.instance_id
                                + "~private("
                                + res.owner_vrchat_id
                                + ")~region("
                                + res.region
                                + ")~nonce(34dd6a10-3e88-4dae-bb75-bdbe704f2af7)"); // please randomly generate this in the future
                        });
                }
            })
            .catch(err => {
                console.log(err.toString());
            });
    }
    
});

bot.on('text', (ctx) => {
    if(ctx.chat.id > 0) { // no groups
        try{
            let link = new URL(ctx.message.text);
            console.log(link);
            let paths = link.pathname.split("/");
            if( paths.length != 4 ) {
                return ctx.reply("Couldn't recognize link. Make sure to go to https://vrchat.com/home click on your own name and copy the URL.");
            }
            else if( link.origin === "https://vrchat.com" && paths[1] === "home" && paths[2] === "user" ){
                return User.findOrCreate({where: {telegram_id: ctx.chat.id}})
                    .then(([res, created]) => {
                        // Stop people from changing VRChat IDs to get their friends instant 18+ approval ig
                        if( res.vrchat_id != null ){
                            return ctx.reply(`You already have a VRChat ID set. Contact <a href="tg://user?id=${admins[0]}">an admin</a> to change it again.`, {parse_mode: 'HTML'});
                        }

                        res.vrchat_id = paths[3];
                        return res.save()
                            .then((res) => {
                                if(res.over_18){
                                    return ctx.reply("Saved VRChat ID successfully. You can now use /join to get in!");
                                }
                                else {
                                    return ctx.reply("Saved VRChat ID successfully. Please wait to be confirmed as 18+.")
                                        .then(() => {
                                            ctx.telegram.sendMessage(verify_chat, `New verification request:\n<a href="tg://user?id=${ctx.chat.id}">${encodeURI(ctx.chat.first_name)}</a>\n<a href="https://vrchat.com/home/user/${res.vrchat_id}">${encodeURI(res.vrchat_id)}</a>`, {parse_mode: 'HTML'});
                                        });
                                }
                            })
                    })
                    .catch(err => {
                        console.log(err.toString());
                        return ctx.reply(`Unexpected error saving VRChat ID. (Did you use the discord version of this bot?) Contact <a href="tg://user?id=${admins[0]}">an admin</a>`, {parse_mode: 'HTML'});
                    })
            }
            else{
                return ctx.reply("Couldn't recognize link. Make sure to go to https://vrchat.com/home click on your own name and copy the URL.");
            }
        }
        catch(_){
        }
    }
})


// Init bot/database

sq.sync({alter: true})
    .then(() => {
        return bot.launch()
    })
    .catch((err) => {
        console.log(err)
    });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
