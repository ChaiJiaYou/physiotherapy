"""
ASGI config for physiotherapy project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from api.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'physiotherapy.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # For HTTP requests
    "websocket": AuthMiddlewareStack(  # For WebSocket requests
        URLRouter(
            websocket_urlpatterns  # Define WebSocket routes here
        )
    ),
})


# import os
# from django.core.asgi import get_asgi_application
# from django.contrib.staticfiles.handlers import ASGIStaticFilesHandler

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'physiotherapy.settings')

# application = ASGIStaticFilesHandler(get_asgi_application())



