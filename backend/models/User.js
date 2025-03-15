const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;