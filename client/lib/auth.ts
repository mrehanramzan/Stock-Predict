import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_KEY = "@stockpredict/auth";
const USERS_KEY = "@stockpredict/users";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

interface StoredUser extends User {
  password: string;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const data = await AsyncStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  const users = await getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error("No account found with this email");
  }

  if (user.password !== password) {
    throw new Error("Incorrect password");
  }

  const { password: _, ...userData } = user;
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  return userData;
}

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const users = await getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    throw new Error("An account with this email already exists");
  }

  const newUser: StoredUser = {
    id: generateId(),
    email,
    name,
    password,
    createdAt: Date.now(),
  };

  users.push(newUser);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

  const { password: _, ...userData } = newUser;
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  return userData;
}

export async function signOut(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}

async function getUsers(): Promise<StoredUser[]> {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
