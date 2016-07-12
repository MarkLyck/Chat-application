import $ from 'jquery'
// import jQueryUI from 'jquery-ui'
import renderMessages from './renderMessages'
import getMessages from './getMessages'
import chatGroups from './collections/chatGroups'

const apiURL = 'https://tiny-za-server.herokuapp.com/collections/mlyck-chat/'

let $loginInput = $('#login-input')

function User(userName) {
  this.userName = $loginInput.val()
  this.type = 'user'
  this.chats = []
  this.currentChat = chatGroups[0]
}

User.prototype.login = function() {
  const userNameRegex = /[a-zA-Z]/g;
  if (userNameRegex.test(this.userName)) {
    $.ajax({
      url: apiURL,
      type: 'GET',
      success: response => {
        if (response.length === 0) {
          this.postUser()
        } else {
          let userFound = false
          response.filter(item => {
            if (item.type === 'user') {
              return true;
            }
          }).forEach(currUser => {
            if (this.userName.toLowerCase() === currUser.userName.toLowerCase()) {
              Object.assign(user, currUser)
              userFound = true
            }
          })
          if (userFound === false) { // If the user doesn't already exist create a new one
            this.chats.push(chatGroups[0])
            this.currentChat = chatGroups[0]
            this.postUser()
          }
        }
        $('.modal-container').css('display', 'none')
        $('.modal').css('display', 'none')
        getMessages()
        startGetRequestLoop()
      }
    })
  } else {
    // $('.login-modal').effect('shake')
    throw new Error('Your username must contain atleast 1 alphanumeric character!')
  }
}

User.prototype.postUser = function() {
  $.ajax({
    url: apiURL,
    type: 'POST',
    data: JSON.stringify(this),
    contentType: 'application/json',
    success: response => {
      this._id = response._id
      console.log('You created a new user')
    }
  })
}

User.prototype.putUser = function() {
  $.ajax({
    url: apiURL + this._id,
    type: 'PUT',
    data: JSON.stringify(this),
    contentType: 'application/json',
    success: response => {
      console.log('Updated user', response)
    }
  })
}

function startGetRequestLoop() {
  var waitingForOppMove = setInterval(function() {
    $.ajax({
      url: apiURL + user.currentChat._id,
      type: 'GET',
      success: response => {
        if (user.currentChat.messages.length !== response.messages.length) {
          user.currentChat = response
          getMessages()
        }
      }
    })
    $.ajax({
      url: apiURL + user._id,
      type: 'GET',
      success: response => {
        if (user.chats.length !== response.chats.length) {
          user.chats = response.chats
        }
      }
    })
    console.log('TIMELOOP');
  }, 2000)
}


let user = new User();
// user.currentChat = chatGroups[0]

export default user;
