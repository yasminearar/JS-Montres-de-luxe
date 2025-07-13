import JSONArrayDatabase from "../JSONArrayDatabase.js";
import bcrypt from "bcryptjs";

const userDB = new JSONArrayDatabase("users.json");

export default class User {
  static async findByEmail(email) {
    return userDB.findByEmail(email);
  }

  static async findAll() {
    return userDB.findAll();
  }

  static async create(userData) {
    const existingUser = await userDB.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Courriel existant !");
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 12);
    }

    const userToCreate = {
      ...userData,
      role: userData.role || 'user'
    };

    return userDB.insert(userToCreate);
  }

  static async findById(id) {
    return userDB.findById(id);
  }

  static async delete(userId) {
    return userDB.delete(userId);
  }

  static async update(id, updates) {
    if (updates.email) {
      const existingUser = await userDB.findByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("Email already in use");
      }
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }
    
    return userDB.update(id, updates);
  }

  static async findAdmins() {
    const users = await userDB.findAll();
    return users.filter(user => user.role === 'admin');
  }

  static async isAdmin(userId) {
    const user = await userDB.findById(userId);
    return user && user.role === 'admin';
  }

  static async comparePassword(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }
}
