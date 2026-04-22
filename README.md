# Requirements

Create a venv and then install the required python packages. 
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Copy `.env.sample` into `.env`. 
- Make sure that `DEVICE_ID` has the same value as the `DEVICEID` of the corresponding ESP8266 (or the `device_id` field of the `/scan` request payload). 
- `API_IP` is the IP address of the _server_ you want to connect to (VM or Localhost IP).
```bash
cp .env.sample .env
```

# Running Client

Then, run:
```bash
python3 display_pic.py
```