const express = require('express');
const { sq, User } = require('@facade/vrc-events-db-model');

const user_input_default = ['vrchat_id', 'telegram_id', 'discord_id'];

const app = express();

app.use(express.json());

function filter_object(inputs, obj) {
    return Object.keys(obj)
        .filter(key => inputs.includes(key))
        .reduce((o, key) => {
            o[key] = obj[key];
            return o;
        }, {});
}

async function is_18(li) {
    console.log("Received: " + JSON.stringify(li));
    return Promise.allSettled(li.map(i => {
            filtered = filter_object(user_input_default, i);
            if( Object.keys(filtered).length == 0 ){
                return Promise.reject("User needs at least one vrchat_id, telegram_id, or discord_id");
            }

            return User.findOne({where: filtered})
                .then((user => {
                    if(!user) {
                        return Promise.reject("User not found");
                    }
                    filtered.over_18 = user.over_18;
                    return filtered;
                }))
                .catch(err => {
                    console.log(err);
                    return Promise.reject(err.toString());
                });
        }) );
}

app.post('/is18', (req, res) => {
    try{
        if( Array.isArray(req.body) ) {
            is_18(req.body).then((response) => {
                //console.log(r);
                res.send({response});
            });
        }
        else{
            is_18([req.body]).then((response) => {
                //console.log(r);
                res.send({response});
            });
        }
    }
    catch (e){
        console.log(e.toString());
        res.send({error: e.toString()});
    }
});

sq.sync() // Readonly so no altering
    .then(() => {
        app.listen(process.env.PORT);
    })
    .catch((err) => {
        console.log(err);
    })