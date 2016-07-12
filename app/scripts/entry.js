import $ from 'jquery'
import user from './userModel'
import renderMessages from './renderMessages'
import ChatGroup from './chatModel'
import chatGroups from './collections/chatGroups';
import Message from './messageModel'

const apiURL = 'https://tiny-za-server.herokuapp.com/collections/mlyck-chat/'

console.log('READY');

// clearAPI()

function clearAPI() {
  console.log('clearing');
  $.ajax({
    url: apiURL,
    type: 'GET',
    success: function(response){
      response.forEach(function(user){
        $.ajax({
          url: apiURL + user._id,
          type: 'DELETE',
          contentType: 'application/json',
          success: function(response) {
            console.log('DELETED', user._id);
          }
        });
      });
    }
  })
}


let $loginBtn = $('#login-btn')
let $loginInput = $('#login-input')

let $msgInput = $('#msg-input')
let $sendBtn = $('#send-btn')

$loginInput.on('keyup', function() {
  const userNameRegex = /[a-zA-Z]/g;
  if (userNameRegex.test($loginInput.val())) {
    $loginBtn.addClass('valid-user')
  } else {
    $loginBtn.removeClass('valid-user')
  }
})

setGlobalChat()
function setGlobalChat(){
  $.ajax({
    url: apiURL,
    type: 'GET',
    success: response => {
      let allChats = response.filter(item => {
        if (item.type === 'chat') {
          return true
        }
      })
      if (allChats.length === 0) {
        chatGroups[0].postChat()
      }
      allChats.forEach(function(chat) {
        if(chat.chatName === 'globalChat') {
          chatGroups[0] = chat
          if (user.currentChat.chatName === 'globalChat') {
            user.currentChat = chat
          }
        }
      })
    }
  })
}

$loginBtn.on('click', () => {
  user.userName = $loginInput.val()
  user.currentChat = chatGroups[0]
  user.login()
})

$msgInput.on('keyup', function() {
  if ($msgInput.val() !== '') {
    $sendBtn.addClass('valid-message')
  } else {
    $sendBtn.removeClass('valid-message')
  }
})

$sendBtn.on('click', function() {
  if ($msgInput.val() !== '') {
    let message = new Message()
    message.body = $msgInput.val()
    message.sender = user.userName
    message.send()
    $msgInput.val('')
    $sendBtn.removeClass('valid-message')
  }
})
