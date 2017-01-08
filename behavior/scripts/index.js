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

			if (requstedRole) {
				client.updateConversationState({
					requstedRole: role,
				});

				console.log('User wants the person who is their', role.value);
			}
		},

		prompt: function () {

			console.log("collectRole / prompt");


			client.addResponse('prompt/weather_city');
			client.done();
		},
	});


	// was provideWeather
	var provideAdvisor = client.createStep({
		satisfied: function () {

			console.log("provideAdvisor / satisfied");


			return false;
		},

		prompt: function () {
			// Need to provide weather
			console.log("provideAdvisor / prompt");

			var tutorData = {
				person: "DM1",
				role: client.getConversationState().requstedRole.value,
			};

			client.addResponse('provide/advisor', tutorData);


			client.done();
		},
	});



	client.runFlow({
		classifications: {},
		streams: {
			main: 'getAdivsor',
			hi: [sayHello],
			getAdvisor: [collectRole, provideAdvisor],
		}
	});

/*

	client.runFlow({
		classifications: {
			// map inbound message classifications to names of streams
		},
		autoResponses: {
			// configure responses to be automatically sent as predicted by the machine learning model
		},
		streams: {
			main: 'onboarding',
			onboarding: [sayHello],
			end: [untrained],
		},
	});
*/
};