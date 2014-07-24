$(document).ready(function(){
	initializeFirebase();
	checkPage();
	setEventListeners();
})  

var initializeFirebase = function(){
	myDataRef = new Firebase('https://blazing-fire-1516.firebaseio.com/');
}

var checkPage = function(){

	if(location.search === ""){
		board = myDataRef.push({init: " "})
		boardId = board.name()
		loadNewPage(location.href, boardId)
	}else{
		boardId = location.search.split("")
		delete boardId[0]
		boardId = boardId.join("")

		// console.log(boardId)
		doesBoardExist(boardId)
	}
}

var doesBoardExist = function(boardId){

	myDataRef.child(boardId).once('value', function(snapshot) {
	    if (snapshot.val() === null){
	    	createNewBoard(boardId)
	    }
  });

}

var createNewBoard = function(boardId){
	board = myDataRef.child(boardId).push({init: " "})
	boardId = board.name()
}


var loadNewPage = function(current_url, board_id){
	window.open( current_url + "?"+board_id, "_self")
}

var setEventListeners = function(){
	
	submitNewMessage();
	getNewMessages();
	clickOnBacklog();
	clickOnInProgress();
	updateTask();
}

var clickOnBacklog = function(){
	$(document).on('click', '#backlog-items li', function(e){
		var uniq_key = $(e.target).attr("id")
		myDataRef.child(boardId).child(uniq_key).update({status: "in-progress"})
	})
}

var clickOnInProgress = function(){
	$(document).on('click', '#in-progress-items li', function(e){
		var uniq_key = $(e.target).attr("id")
		myDataRef.child(boardId).child(uniq_key).update({status: "done"})
	})
}


var updateTask = function(){
	myDataRef.child(boardId).on('child_changed', function(snapshot) {
		var uniq_key = snapshot.name()
		var data = snapshot.val()
		$('#' + uniq_key).remove()

		displayChatMessage(data.task, data.status, uniq_key)
	});
}

var getNewMessages = function(){
	myDataRef.child(boardId).on('child_added', function(snapshot) {
		var message = snapshot.val();
		displayChatMessage(message.task, message.status, snapshot.name());
	});
}


var displayChatMessage = function(task, status, uniq_key) {
	var list_item = document.createElement('li')
	list_item.innerHTML = task
	$(list_item).attr('id', uniq_key)

	$('#' + status + '-items').append(list_item)
};


var submitNewMessage = function(){
	$('#taskInput').keypress(function (e) {
		if (e.keyCode == 13) {

			addMessageToFb()
		}
	});
}

var addMessageToFb = function(){
	if (taskIsValid()){
		myDataRef.child(boardId).push({task: getTask(), status: "backlog"});
	}
	clearTextBox()

}

var clearTextBox = function(){
	$('#taskInput').val('');
}

var getTask = function(){
	var text =  $('#taskInput').val();
	return escapeString(text)
}


var taskIsValid = function(){

	return true
}

var escapeString = function(text){
	sanitizedText = text.replace(/&/g, '&amp;');
	sanitizedText =sanitizedText.replace(/&/g, '&amp;')
	sanitizedText =sanitizedText.replace(/</g, '&lt;')
	sanitizedText =sanitizedText.replace(/>/g, '&gt;')
	sanitizedText =sanitizedText.replace(/\"/g, '&quot;')
	sanitizedText =sanitizedText.replace(/\'/g, '&#39;');
	return sanitizedText
}





