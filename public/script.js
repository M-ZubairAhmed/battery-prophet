var mainIntervalID;

function main() {
  var errorElement = document.getElementById("error");
  var levelElement = document.getElementById("level");
  var statusElement = document.getElementById("status");

  fetch("/get-info")
    .then(function(response) {
      return response.json();
    })
    .then(function(batteryInfo) {
      console.log(batteryInfo);
      var isCharging =
        batteryInfo && batteryInfo.isCharging !== null
          ? batteryInfo.isCharging
          : null;
      var level = batteryInfo && batteryInfo.level ? batteryInfo.level : null;
      if (isCharging == null || level == null) {
        errorElement.textContent = "Error obtaining battery values";
        levelElement.textContent = "";
        statusElement.textContent = "";
        notifyMe("Battery propher: Error obtaining battery information");
        clearInterval(mainIntervalID);
      } else {
        console.log(isCharging, level);
        levelElement.textContent = level;
        statusElement.textContent = isCharging ? "Charging" : "Discharging";
        if (!isCharging) {
          statusElement.style.color = "palevioletred";
        } else {
          statusElement.style.color = "limegreen";
        }
        if (level >= 79 && isCharging) {
          console.log(
            "Disconnect your charger, battery about to reach 80 percent"
          );
          notifyMe(
            "Disconnect your charger, battery about to reach 80 percent"
          );
        } else if (level <= 42 && !isCharging) {
          console.log(
            "Connect your charger, battery about to reach 40 percent"
          );
          notifyMe("Connect your charger, battery about to reach 40 percent");
        }
      }
    });
}

function notifyMe(text) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    var notification = new Notification(text);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(function(permission) {
      if (permission === "granted") {
        var notification = new Notification(text);
      }
    });
  }
}

window.onload = function() {
  mainIntervalID = window.setInterval(main, 60000);
};
