$(document).ready(function(){
	initializeFirebase();
	setEventListeners();
})  

var initializeFirebase = function(){
	myDataRef = new Firebase('https://blazing-fire-1516.firebaseio.com/');
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
		myDataRef.child(uniq_key).update({status: "in-progress"})
	})
}

var clickOnInProgress = function(){
	$(document).on('click', '#in-progress-items li', function(e){
		var uniq_key = $(e.target).attr("id")
		myDataRef.child(uniq_key).update({status: "done"})
	})
}


var updateTask = function(){
	myDataRef.on('child_changed', function(snapshot) {
		var uniq_key = snapshot.name()
		var data = snapshot.val()
		console.log(uniq_key)
		$('#' + uniq_key).remove()

		displayChatMessage(data.task, data.status, uniq_key)
	});
}

var getNewMessages = function(){
	myDataRef.on('child_added', function(snapshot) {
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
	myDataRef.push({task: getTask(), status: "backlog"});
	clearTextBox()
}

var clearTextBox = function(){
	$('#taskInput').val('');
}

var getTask = function(){
	return $('#taskInput').val();
}






