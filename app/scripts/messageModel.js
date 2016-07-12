import moment from 'moment'

function Message() {
  this.body = ''
  this.sender = ''
  this.timeStamp = moment().format('MMM Do HH:MM')
  this._id = randomString(25)
}


// This function was a stack overflow answer to creating a randomized ID.
function randomString(length_) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    if (typeof length_ !== "number") {
        length_ = Math.floor(Math.random() * chars.length_);
    }
    var str = '';
    for (var i = 0; i < length_; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}


export default Message
