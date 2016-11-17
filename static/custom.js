$(document).ready( ()=>{
	console.log('Dom Loaded')
	$("form").on('submit', (event)=>{
		console.log(event)
		console.log("Comment form submits")
		event.preventDefault()
		let comment = {
			postId: event.currentTarget.id,
			body: $( "#" + event.currentTarget.id + " .postcomment" ).val()
		}
		console.log(comment)
		$.post("/comment", comment, (data) => {
			$('.commentss').append( '<p>' + data.comment +'</p>')
			$('#postcomment').val('')
		})
	})
})