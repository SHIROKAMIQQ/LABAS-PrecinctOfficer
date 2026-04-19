# Requirements

Create a venv and then install the required python packages. 
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

# Running Client

Make sure that `DEVICE_ID` has the same value as the `DEVICEID` of the corresponding ESP8266.

Then, run:
```bash
python3 display_pic.py
```