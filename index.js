const linuxBattery = require("linux-battery");
const express = require("express");

const app = express();
const PORT = 9091;

app.get("/", async (request, response) => {
  console.log(request);
  const batteryInfoRaw = await linuxBattery();
  const completeBatteryInfo = batteryInfoRaw[0];
  const batteryInfo = {
    isPowerConnected: completeBatteryInfo["powerSupply"]
      ? completeBatteryInfo["powerSupply"] === "yes"
        ? true
        : false
      : null,
    isCharging: completeBatteryInfo["state"]
      ? completeBatteryInfo["state"] === "charging"
        ? true
        : false
      : null,
    level: completeBatteryInfo["percentage"]
      ? parseInt(completeBatteryInfo["percentage"].split("%")[0])
      : null
  };
  response.json(batteryInfo);
});

app.listen(PORT, () =>
  console.log("Battery propher server started at port", PORT)
);
