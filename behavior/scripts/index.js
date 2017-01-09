// 'use strict';
exports.handle = function (client) {






	// Create steps
	var sayHello = client.createStep({
		satisfied: function () {
			return Boolean(client.getConversationState().helloSent);
		},

		prompt: function () {
			client.addResponse('welcome');
			client.addResponse('provide/documentation', {
				documentation_link: 'http://docs.init.ai',
			});
			client.addResponse('provide/instructions');

			client.updateConversationState({
				helloSent: true
			});

			client.done();
		}
	});

	var untrained = client.createStep({
		satisfied: function () {
			return false;
		},

		prompt: function () {
			client.addResponse('apology/untrained');
			client.done();
		}
	});



	// was collect city
	var collectRole = client.createStep({


		satisfied: function () {

			console.log("collectRole / satisfied");


			return Boolean(client.getConversationState().requstedRole);
		},

		extractInfo: function () {

			var role = client.getFirstEntityWithRole(client.getMessagePart(), 'role');

			if (role) {
				client.updateConversationState({
					requstedRole: role,
				});

			}
		},


		prompt: function () {

			console.log("This means it can't identidy a role");
			
			var tutorData = {
				person: "wrong",
				role: "wrong again"
			};

			client.addTextResponse("I'm not sure what's going on ... ");
			client.addResponse('prompt_role');
			// client.expect('provideAdvisor', ['clarify_role']);
			client.done();
		},

	});


	// was provideWeather
	var provideAdvisor = client.createStep({
		satisfied: function () {

			console.log("provideAdvisor / satisfied");
			return false;
		},


		prompt: function (eventType, payload, data) {
			// Need to provide weather
			console.log("Return data to provide_advisor");
			

			var tutorData = {
				person: "Joe Bloggs",
				role: client.getFirstEntityWithRole(client.getMessagePart(), 'role').value
			};
			


			client.addResponse('provide_advisor', tutorData);
/*
			client.addTextResponse(JSON.stringify(eventType));
			client.addTextRespones(JSON.stringify(payload));
			client.addTextRespones(JSON.stringify(data));
*/
			client.done();
		}
	});
	
	
	var handleEvent = function(eventType, payload) {
    client.addTextResponse('Received event of type: ' + eventType);
    
    var payloadText = JSON.stringify(payload);
    
    client.addTextResponse('payload ' + payloadText);
    
    client.done();
  };


	client.runFlow({
		eventHandlers: {
			'*': handleEvent
		},
		classifications: {
			'request_advisor': 'getAdvisor'
		},
		streams: {
			main: 'getAdvisor',
			getAdvisor: [collectRole, provideAdvisor],
			provideAdvisor: provideAdvisor
		}
	});


};






/*

			var tutorData = {
				person: "DM1",
				role: client.getConversationState().requstedRole.value,
			};
*/



var people = [{
	"id": "auth0|5815cb10344073a30129f746",
	"advisor": "Mark Smith"
}];