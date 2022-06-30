#!/usr/bin/env python3

# Use this script to mass-approve all users in some group.

import json
import asyncio
from telethon import TelegramClient, events

api_id = 0
api_hash = ""

client = TelegramClient('automated_session', api_id, api_hash)

async def get_users_in_group(group_name):
        tg_group = None

        user_ids = []
    
        async for dialog in client.iter_dialogs():
            if dialog.name == group_name:
                tg_group = dialog

        async for user in client.iter_participants(tg_group):
            user_ids.append({"telegram_id": user.id})

        print( json.dumps(user_ids) )


with client:
    client.loop.run_until_complete(get_users_in_group("..."))
