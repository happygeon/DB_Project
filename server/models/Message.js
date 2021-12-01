const db = require("../config/db");

class Message {
  constructor(fromId, toId, chatRoomId, content, timeLimit) {
    this.fromId = fromId;
    this.toId = toId;
    this.chatRoomId = chatRoomId;
    this.content = content;
    if (timeLimit === undefined || timeLimit == null) {
      this.expiresAt = null;
    } else {
      const today = new Date();
      today.setTime(today.getTime() + timeLimit * 60 * 1000);
      const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + String(today.getDate()).padStart(2, "0");
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + " " + time;
      this.expiresAt = dateTime;
    }
  }

  async create() {
    let sql;
    if (this.expiresAt == null) {
      sql = `
        INSERT INTO messages(
          fromId,
          toId,
          chatRoomId,
          content
        )
        VALUES(
          '${this.fromId}',
          '${this.toId}',
          '${this.chatRoomId}',
          '${this.content}'
        );
      `;
    } else {
      sql = `
        INSERT INTO messages(
          fromId,
          toId,
          chatRoomId,
          content,
          expiresAt
        )
        VALUES(
          '${this.fromId}',
          '${this.toId}',
          '${this.chatRoomId}',
          '${this.content}',
          '${this.expiresAt}'
        );
      `;
    }

    return db.execute(sql);
  }

  static async findAll(chatRoomId) {
    const sql = `SELECT * FROM messages WHERE chatRoomId='${chatRoomId}' ORDER BY createdAt;`;
    const [messageRows, _] = await db.execute(sql);

    return messageRows;
  }
}

module.exports = Message;
