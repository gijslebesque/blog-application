$(document).ready( ()=>{
	console.log('Dom Loaded')
	$("form").on('submit', (event)=>{
		console.log("Comment form submits")
		event.preventDefault()
		let comment = {
			postId: event.currentTarget.id,
			body: $( "#" + event.currentTarget.id + " .postcomment" ).val()
		}
		$.post("/comment", comment, (data) => {
			$('.commentss').append( '<p> '+ comment: data.comment. By data.comment.user.firstName '</p>')
			$('input').val('')
		})
	})
})