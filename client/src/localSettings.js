/*
 * Browser-local settings with an accompanying hook
 */

import { useState, useEffect } from "react";
import isEqual from "lodash/isEqual";
import clone from "lodash/clone";

const globalSettings =
  typeof localStorage === "undefined"
    ? {}
    : JSON.parse(localStorage["settings"] || "{}");

const subscriptions = new Set();

const subscribe = (subscriber) => {
  subscriptions.add(subscriber);
};

const unsubscribe = (subscriber) => {
  subscriptions.delete(subscriber);
};

const updateSettings = (settings) => {
  Object.assign(globalSettings, settings);

  saveLocalSettings();

  subscriptions.forEach((sub) => {
    sub(clone(globalSettings));
  });
};

// Sets default values for missing local settings
const initLocalSettings = () => {
  if (!globalSettings.theaterMode) globalSettings.theaterMode = false;

  saveLocalSettings();
};

// Saves the current local settings to localStorage and a cookie
const saveLocalSettings = () => {
  // Don't try to save settings when server side rendering
  if (typeof window === "undefined") {
    return;
  }

  localStorage["settings"] = JSON.stringify(globalSettings);

  // Also save the settings in a cookie. This allows the server to read the
  // settings when server side rendering.
  document.cookie =
    "localSettings=" + JSON.stringify(globalSettings) + ";path=/";
};

export const useLocalSettings = () => {
  initLocalSettings();

  const [settings, setSettings] = useState(clone(globalSettings));

  const sub = (newSettings) => {
    if (!isEqual(newSettings, settings)) {
      setSettings(newSettings);
    }
  };

  useEffect(() => {
    subscribe(sub);

    return () => {
      unsubscribe(sub);
    };
  });

  return [settings, updateSettings];
};

export const setLocalSettings = (settings) => {
  console.log("Local settings set to", settings);
  Object.assign(globalSettings, settings);
};

export default useLocalSettings;
