import { AsyncStorage, Dimensions } from "react-native";
import { Notifications, Permissions } from "expo";

//Get the screenwidth of the device
export const { width } = Dimensions.get("window");
//Set the width for the button and inputfield
export const btnWidth = width - 50;
export const inputWidth = width - 20;

const NOTIFICATION_KEY = "MobileFlashcards:notifications";

export const clearLocalNotifications = () => {
  return AsyncStorage.removeItem(NOTIFICATION_KEY).then(
    Notifications.cancelAllScheduledNotificationsAsync
  );
}

const createNotification = () =>{
  return {
    title: "Time to practice",
    body: "Check your flashcards today!",
    ios: {
      sound: true
    },
    android: {
      sound: true,
      priority: "high",
      sticky: false,
      vibrate: true
    }
  };
}

export const setLocalNotification = () =>{
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then(data => {
      if (data === null) {
        Permissions.askAsync(Permissions.NOTIFICATIONS).then(({ status }) => {
          if (status === "granted") {
            Notifications.cancelAllScheduledNotificationsAsync();

            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(20);
            tomorrow.setMinutes(0);

            Notifications.scheduleLocalNotificationAsync(createNotification(), {
              time: tomorrow,
              repeat: "day"
            });

            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));
          }
        });
      }
    });
}
