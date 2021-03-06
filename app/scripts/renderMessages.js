import $ from 'jquery'
import ChatGroup from './chatModel'
import user from './userModel'
import getMessages from './getMessages'
import renderUserList from './renderUsers'

const apiURL = 'https://tiny-za-server.herokuapp.com/collections/mlyck-chat/'

let $messages = $('#messages')
let $chatGroupBtn = $('#chat-group-btn')
let $chatGroupName = $('#chat-group-name')

function renderMessages() {
  $chatGroupName.text(user.currentChat.chatName)
  $messages.empty()
  if (user.currentChat.chatName !== 'Everyone') {
    let $specialLi = $(`
        <li class="chat-options">
          <button id="edit-chat">Edit</button>
          <button id="add-user-to-chat">Add User</button>
        </li>
      `)
    $messages.append($specialLi)
    $specialLi.children('#add-user-to-chat').on('click', function() {
      renderUserList(user.currentChat)
    })
    $specialLi.children('#edit-chat').on('click', function() {
      console.log('EDIT CHAT');
      $('.modal-container').css('display', 'flex')
      $('.chat-name-modal').css('display', 'flex')
    })
  }
  user.currentChat.messages.forEach(function(message) {
    let $li = $(`
      <li class="message" data-id="${message._id}">
        <a>
          <div class="wrapper">
            <h3 class="sender">${message.sender}</h3>
            <p class="time-stamp">${message.timeStamp}</p>
          </div>
          <p class="message-body">${message.body}</p>
        </a>
      </li>`)
    if (message.sender === user.userName) {
      // $li.append('<div></div>')
      let $delBtn = $('<button class="del-msg">Delete</button>')
      $li.append($delBtn)
      $li.addClass('my-text')
    } else {
      $li.addClass('other-text')
    }
    if (message.body.indexOf('@' + user.userName) !== -1) {
      $li.addClass('mentioned')
    }
    $messages.append($li)
    $li.on('click', () => {
      $li.toggleClass('show-button')
      // $li.children('button').css('width', '50px');
    })
    $li.children('button').on('click', function() {
      user.currentChat.messages.forEach(function(message){
        if (message._id === $li.data().id) {
          // console.log(message);
          deleteMessage(message);
        }
      })
    })
  })
}

function deleteMessage(message) {
  user.currentChat.messages.forEach(function(loopMessage, i) {
    if (loopMessage._id === message._id) {
      user.currentChat.messages.splice(i, 1)
    }
  })
  renderMessages()
  updateChat(user.currentChat)
}

function updateChat(chatToUpdate) {
  $.ajax({
    url: apiURL + chatToUpdate._id,
    type: 'PUT',
    data: JSON.stringify(chatToUpdate),
    contentType: 'application/json',
    success: response => {
      // console.log('Updated chat on server.')
    }
  })
}



export default renderMessages
