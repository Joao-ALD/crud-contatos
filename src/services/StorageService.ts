import AsyncStorage from "@react-native-async-storage/async-storage";
import { Contact } from "../models/Contact";

const STORAGE_KEY = "@contacts_crud_v1";

export const StorageService = {
  async loadContacts(): Promise<Contact[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  },

  async saveContacts(contacts: Contact[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  },
};
