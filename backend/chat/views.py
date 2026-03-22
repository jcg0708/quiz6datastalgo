from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import requests
import os


class AIChatbotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get('message', '').strip()
        if not user_message:
            return Response({"error": "Message is required."}, status=400)

        api_key = os.environ.get('OPENAI_API_KEY', '')
        if not api_key:
            return Response({
                "reply": (
                    "AI chatbot is not configured. "
                    "Please set the OPENAI_API_KEY environment variable."
                )
            })

        try:
            resp = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers={
                    'Authorization': f'Bearer {api_key}',
                    'Content-Type': 'application/json',
                },
                json={
                    'model': 'gpt-3.5-turbo',
                    'messages': [{'role': 'user', 'content': user_message}],
                    'max_tokens': 500,
                },
                timeout=30,
            )
            resp.raise_for_status()
            reply = resp.json()['choices'][0]['message']['content']
            return Response({"reply": reply})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

