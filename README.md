# makers-gatekeeper-pi
Gatekeeper Raspberry Pi client for Maker Cloud

## Running Locally

We can't use the raspberry pi interface without actually being on the raspberry pi.  So there are mock classes created to run things locally.

1. Create `.env` file and populate it with information

```
MAKER_GATE_ID=<Your Gate ID>
MAKER_GATE_SECRET=<Your gate secret>
#  Without ENV it will run production by default
NODE_ENV=dev
MAKER_GATE_API=http://localhost:8081/dev
```
