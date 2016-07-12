import $ from 'jquery'

const apiURL = 'https://tiny-za-server.herokuapp.com/collections/mlyck-chat/'

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

export default putOtherUser
