import $ from 'jquery'
import user from './userModel'
import renderMessages from './renderMessages'
const apiURL = 'https://tiny-za-server.herokuapp.com/collections/mlyck-chat/'

function getMessages() {
  console.log('GETTING MESSAGES');
  $.ajax({
    url: apiURL,
    type: 'GET',
    success: response => {
      let allChats = response.filter(item => {
        if (item.type === 'chat') {
          return true
        }
      })
      allChats.forEach(function(chat) {
        console.log('CHAT');
        console.log(user);
        if (chat.chatName === user.currentChat.chatName) {
          console.log('CHAT MATCHED');
          user.currentChat = chat
          renderMessages()
        }
      })
      console.log('AC: ', allChats);
    }
  })
}

export default getMessages
