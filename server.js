const linuxBattery = require("linux-battery");
const express = require("express");
const path = require("path");

const app = express();
const PORT = 9091;

app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/get-info", async (request, response) => {
  const batteryInfoRaw = await linuxBattery();
  const completeBatteryInfo = batteryInfoRaw[0];
  const batteryInfo = {
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
  console.log("Battery prophet server started at port", PORT)
);
