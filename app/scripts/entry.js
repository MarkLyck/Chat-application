import $ from 'jquery'
import user from './userModel'
import renderMessages from './renderMessages'
import ChatGroup from './chatModel'
import chatGroups from './collections/chatGroups';
import Message from './messageModel'

const apiURL = 'https://tiny-za-server.herokuapp.com/collections/mlyck-chat/'

let $loginBtn = $('#login-btn')
let $loginInput = $('#login-input')

let $msgInput = $('#msg-input')
let $sendBtn = $('#send-btn')

let $changeGroupBtn = $('#chat-group-btn')
let $newChat = $('#new-chat-btn')
let $chatGroupsList = $('#chat-groups')
let $allUsersList = $('#all-users')

let showingChatGroups = false
let showingAllUsers = false

$changeGroupBtn.on('click', function() {
  if (showingChatGroups) {
    $chatGroupsList.empty()
    renderMessages();
    showingChatGroups = false
  } else {
    showingChatGroups = true
    $chatGroupsList.addClass('show-groups')
    $('#messages').empty()
    user.chats.forEach(chat => {
      let $li = $(`
        <li>
          <h3>${chat.chatName}</h3>
        </li>
        `)
      $chatGroupsList.append($li)

      $li.on('click', () => {
        user.currentChat = chat
        $chatGroupsList.empty()
        renderMessages();
        showingChatGroups = false
      })

    })
  }
})

$newChat.on('click', function() {
  if (showingAllUsers) {
    $allUsersList.empty()
    renderMessages();
    showingAllUsers = false
  } else {
    showingAllUsers = true
    $.ajax({
      url: apiURL,
      type: 'GET',
      success: function(response){
        $('#messages').empty()
        response.filter(item => {
          if (item.type === 'user') {
            return true
          }
        })
        .forEach(userInLoop => {
          let $li = $(`
              <li>
                <h3>${userInLoop.userName}</h3>
              </li>
            `)
          $li.on('click', startChatWithUser.bind(null, userInLoop))
          $allUsersList.append($li)
          // console.log(userInLoop)
        })
      }
    })
  }
})

function startChatWithUser(otherUser) {
  $allUsersList.empty()
  showingAllUsers = false
  let invalidNewChat = false
  user.chats.forEach(loopChat => {
    // If a chat with that person doesn't already exist:
    if (loopChat.users.indexOf(otherUser.userName) !== -1 || user.userName === otherUser.userName) {
      invalidNewChat = true
    }
  })
  if (!invalidNewChat) {
    console.log('CREATING CHAT!');
    let newChatWithPerson = new ChatGroup(otherUser.userName + " & " + user.userName)
    newChatWithPerson.users.push(user.userName)
    newChatWithPerson.users.push(otherUser.userName)

    otherUser.chats.push(newChatWithPerson)
    newChatWithPerson.postChat(otherUser)

    user.chats.push(newChatWithPerson)
    user.currentChat = newChatWithPerson
    user.putUser()
    renderMessages()
  }
}



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
        if(chat.chatName === 'Everyone') {
          chatGroups[0] = chat
          if (user.currentChat.chatName === 'Everyone') {
            user.currentChat = chat
          }
        }
        if (chat.users.indexOf(user.userName) !== -1) {
          console.log('USER IN CHAT');
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
