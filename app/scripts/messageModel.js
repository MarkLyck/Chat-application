import $ from 'jquery'
import moment from 'moment'
import user from './userModel'
import renderMessages from './renderMessages'

const apiURL = 'https://tiny-za-server.herokuapp.com/collections/mlyck-chat/'

function Message() {
  this.body = ''
  this.sender = ''
  this.timeStamp = moment().format('MMM DD HH:MM')
  this._id = randomString(25)
}


Message.prototype.send = function() {
  user.currentChat.messages.push(this)
  $.ajax({
    url: apiURL + user.currentChat._id,
    type: 'PUT',
    data: JSON.stringify(user.currentChat),
    contentType: 'application/json',
    success: response => {
      user.currentChat = response;
      renderMessages()
    }
  })
}

Message.prototype.delete = function() {
  $.ajax({
    url: apiURL + user.currentChat._id,
    type: 'GET',
    success: response => {
      console.log(response);
    }
  })
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
