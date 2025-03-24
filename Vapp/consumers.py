# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            # Add the user to a group named after their user ID
            await self.channel_layer.group_add(
                f"notifications_{self.user.id}",
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            # Remove the user from the group when they disconnect
            await self.channel_layer.group_discard(
                f"notifications_{self.user.id}",
                self.channel_name
            )

    async def send_notification(self, event):
        # Send the notification message to the WebSocket
        await self.send(text_data=json.dumps(event["message"]))