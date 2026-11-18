import { Expo } from "expo-server-sdk";
import PushToken from "../models/pushToken.model.js";

const expo = new Expo();

async function sendMessages(tokens, { title, body, data }) {
  const messages = tokens
    .filter((t) => Expo.isExpoPushToken(t))
    .map((t) => ({
      to: t,
      title,
      body,
      data,
      sound: "default",
      priority: "high",
      channelId: "default",
      ttl: 86400,
    }));

  const chunks = expo.chunkPushNotifications(messages);
  let sent = 0;

  for (const chunk of chunks) {
    const tickets = await expo.sendPushNotificationsAsync(chunk);

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      if (ticket.status === "ok") {
        sent++;
      } else if (ticket.details?.error === "DeviceNotRegistered") {
        await PushToken.deleteOne({ token: chunk[i].to });
      }
    }
  }

  return sent;
}

export const saveToken = async (req, res) => {
  try {
    const { token, platform } = req.body;
    const userId = req.user._id;
    if (!token || !Expo.isExpoPushToken(token)) {
      return res.status(400).json({ message: "Invalid Expo push token" });
    }

    await PushToken.findOneAndUpdate(
      { token },
      { token, platform, user: userId },
      { upsert: true, new: true },
    );

    res.status(201).json({ message: "Token saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const notifyAll = async (req, res) => {
  try {
    const { title, body, data } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "title and body are required" });
    }

    const docs = await PushToken.find().select("token");
    const sent = await sendMessages(
      docs.map((d) => d.token),
      { title, body, data },
    );

    res.json({ message: "Notification sent", sent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const notifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, body, data } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "title and body are required" });
    }

    const docs = await PushToken.find({ user: userId }).select("token");
    if (!docs.length) {
      return res.status(404).json({ message: "No tokens found for this user" });
    }

    const sent = await sendMessages(
      docs.map((d) => d.token),
      { title, body, data },
    );

    res.json({ message: "Notification sent", sent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteToken = async (req, res) => {
  try {
    const { token } = req.body;
    await PushToken.deleteOne({ token, user: req.user._id });
    res.json({ message: "Token removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
