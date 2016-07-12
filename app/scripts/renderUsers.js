import $ from 'jquery'
import ChatGroup from './chatModel'
import renderMessages from './renderMessages'
import user from './userModel'
import putOtherUser from './putOtherUser'

const apiURL = 'https://tiny-za-server.herokuapp.com/collections/mlyck-chat/'

let $allUsersList = $('#all-users')
let $chatGroupsList = $('#chat-groups')
let showingAllUsers = false

function renderUserList(currChat) {
  $allUsersList.empty()
  $chatGroupsList.empty()
  if (showingAllUsers) {
    // $allUsersList.empty()
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
          $allUsersList.append($li)
          console.log(currChat);
          if (!currChat.chatName) {
            // $allUsersList.empty()
            $li.on('click', startChatWithUser.bind(null, userInLoop))
          } else {
            // $allUsersList.empty()
            $li.on('click', addUserToChat.bind(null, userInLoop))
            console.log('Adding user to current chat!!');
          }
          // console.log(userInLoop)
        })
      }
    })
  }
}

function addUserToChat(otherUser) {
  $allUsersList.empty()
  renderMessages()
  user.currentChat.users.push(otherUser.userName)
  otherUser.chats.push(user.currentChat)
  user.putUser()
  putOtherUser(otherUser)
  $.ajax({
    url: apiURL + user.currentChat._id,
    type: 'PUT',
    data: JSON.stringify(user.currentChat),
    contentType: 'application/json',
    success: response => {
      console.log('Updated current chat on server.')
    }
  })
}

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

export default renderUserList
