const moongoose = require('mongoose');
const crypto = require('crypto');
const uuid = require('uuid');

const userSchema = new moongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        required: true,
        maxlength: 320,
        trim: true,
        unique: true
    },
    encrPassword: {
        type: String,
        required: true
    },
    salt: String
},
{
    timestamps: true
});

userSchema.virtual("password")
  .set(function(password) {
    this._password = password
    this.salt = uuid.v4()
    this.encrPassword = this.securePassword(password)
  })
  .get(function() {
    return this._password
  })

userSchema.methods = {
    authenticate: function(plainPassword) {
        return this.securePassword(plainPassword) === this.encrPassword;
    },
    
    securePassword: function(plainPassword) {
        if (!plainPassword) return '';

        try {
            return crypto.createHmac("sha256", this.salt).update(plainPassword).digest("hex");
        } catch (error) {
            return error;
        }
    }
}

module.exports = moongoose.model("User", userSchema, "users");