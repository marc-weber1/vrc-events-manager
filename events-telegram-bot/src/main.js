const { Telegraf, Context, Markup } = require('telegraf')
const { sq, User, Group, Event, Membership } = require('@facade/vrc-events-db-model')

// IN PROGRESS, only some demo functionality for the events bot


const token = process.env.BOT_TOKEN;
if(!token) {
    throw new Error('No BOT_TOKEN found');
}
const bot = new Telegraf(token);

const admins = [
    156638024, // facade
]



bot.start((ctx) => {return ctx.reply('Welcome! This bot is still in progress, expect more updates soon!')} );

bot.command('eventlist', (ctx) => {
    if( ctx.chat.id < 0 ) { // Group
        // Display all events for this group

        return Group.findOrCreate({where: {telegram_id: ctx.chat.id},
                                   defaults: {name: ctx.chat.title}})
            .then(([group, created]) => {
                return Event.findAll({where: {group: group.id}})
            })
            .then((events) => {
                return ctx.reply(" -- This Group's Events --\n" + events.map(event => event.name).join("\n"));
            })
            .catch((err) => {
                console.log(err)
            })
    }
    else {
        // Display all events for every group the user is in

        return User.findOrCreate({where: {telegram_id: ctx.chat.id},
                                  defaults: {name: ctx.chat.first_name}})
            .then(([user, created]) => {
                return Membership.findAll({where: {user_id: user.id}})
            })
            .then(memberships => {
                return Promise.all(memberships.map(membership => {
                    return Event.findAll({where: {group: membership.group_id}})
                }))
            })
            .then(events => {
                // Group events by group?

                return ctx.reply(" -- All Events --\n" + events.map(event => event.name).join("\n"));
            })
            .catch((err) => {
                console.log(err)
            })
    }
})

bot.command('createevent', (ctx) => {
    if( ctx.chat.id < 0 ) { // Group
        // Create an event for this group

        return Group.findOrCreate({where: {telegram_id: ctx.chat.id},
                                   defaults: {name: ctx.chat.title}})
            .then(([group, created]) => {
                return ctx.reply("What's the name of the event?");
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // Create events outside the group?
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