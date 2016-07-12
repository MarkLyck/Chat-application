import $ from 'jquery'
const apiURL = 'https://tiny-za-server.herokuapp.com/collections/mlyck-chat/'
import user from './userModel';

function ChatGroup(chatName) {
  this.type = 'chat'
  this.users = []
  this.messages = []
  this.chatName = chatName || 'Everyone'
}

ChatGroup.prototype.postChat = function(otherUser) {
  $.ajax({
    url: apiURL,
    type: 'POST',
    data: JSON.stringify(this),
    contentType: 'application/json',
    success: response => {
      this._id = response._id
      if (otherUser) {
        putOtherUser(otherUser)
      }
      // console.log('You created a new Chat')
    }
  })
}

ChatGroup.prototype.putChat = function() {
  $.ajax({
    url: apiURL,
    type: 'PUT',
    data: JSON.stringify(this),
    contentType: 'application/json',
    success: response => {
      // console.log('Updated chat on server.')
    }
  })
}

ChatGroup.prototype.addToGroup = function(user) {
  this.users.push(user)
  $.ajax({
    url: apiURL + this._id,
    type: 'PUT',
    data: JSON.stringify(this),
    contentType: 'application/json',
    success: response => {
      // console.log(`Added ${user} to ${this.chatName}`)
    }
  })
}

function putOtherUser(otherUser) {
  $.ajax({
    url: apiURL + otherUser._id,
    type: 'PUT',
    data: JSON.stringify(otherUser),
    contentType: 'application/json',
    success: response => {
      console.log('Updated other user: ' + otherUser.userName)
    }
  })
}



export default ChatGroup
