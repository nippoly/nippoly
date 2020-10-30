type ChromeStorageCallback = (items: { [key: string]: any }) => void;

export type Data = {
  title: string;
  comment: string;
  url: string;
  created_at: string;
};

export type Store = {
  data?: Data[];
};

export const findIndex = (datas: Data[], url: string) => {
  return datas.findIndex((data) => data.url === url);
};

export const findData = (datas: Data[], url: string) => {
  return datas.find((data) => data.url === url);
};

export const getData = (callback: ChromeStorageCallback) => {
  chrome.storage.sync.get("data", callback);
};

export const setData = (items: Store, callback: () => void) => {
  chrome.storage.sync.set(items, callback);
};

export const sendMessage = (object: any) => {
  chrome.runtime.sendMessage(object);
};

export const removeDatas = () => {
  chrome.storage.sync.clear();
};
