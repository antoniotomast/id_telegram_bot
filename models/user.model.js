const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    telegram_id: Number,
    is_bot: Boolean,
    first_name: String,
    last_name: String,
    username: String,
    language_code: String
}, { timestamps: true, versionKey: false });

module.exports = model('user', userSchema);