from dotenv import load_dotenv
import asyncio
import websockets
import json
import base64
import os

load_dotenv()
DEVICE_ID = os.getenv("DEVICE_ID")
API_IP = os.getenv("API_IP")
DISPLAY_PIC_API = f"ws://{API_IP}:8000/display-pic/{DEVICE_ID}"

# Helper function to convert base64 string of a photo into .jpg
def save_photo(base64_str: str, filename="photo.jpg"):
  img_data = base64.b64decode(base64_str)
  with open(filename, "wb") as f:
    f.write(img_data)
  print(f"Photo saved as: {filename}")

# PrecinctOfficer connects to server via a websocket and listens for MOSIP results.
# Upon receiving MOSIP data, display them.
async def listen_for_pic():
  async with websockets.connect(DISPLAY_PIC_API) as ws:
    print(f"Connected to {DEVICE_ID} at {API_IP}")

    while True:
      msg = await ws.recv()
      data = json.loads(msg)

      # For now, just print MOSIP data on terminal and save photo as .jpg
      print("Received MOSIP result:")
      print(json.dumps(data["demographics"]))
      save_photo(data["photo"])      
  
asyncio.run(listen_for_pic())
