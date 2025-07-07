import JSONArrayDatabase from "../JSONArrayDatabase.js";

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
}
