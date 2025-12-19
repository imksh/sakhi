import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
export const save = async (key: string, value: any) => {
  if (!key || !value) return; 
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error("AsyncStorage save error:", error);
  }
};

// Get data
export const get = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('AsyncStorage get error:', error);
    return null;
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('AsyncStorage get error:', error);
    return null;
  }
};

// Remove specific key
export const remove = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('AsyncStorage remove error:', error);
  }
};

// Clear entire storage
export const clear = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('AsyncStorage clear error:', error);
  }
};