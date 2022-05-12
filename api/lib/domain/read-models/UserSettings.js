class UserSettings {
  constructor({ userId, color, id, updatedAt }) {
    this.userId = userId;
    this.color = color;
    this.id = id;
    this.updatedAt = updatedAt;
  }
}

module.exports = UserSettings;
