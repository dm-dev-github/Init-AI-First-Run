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
			return Boolean(client.getConversationState().weatherCity);
		},

		extractInfo: function () {
			var city = client.getFirstEntityWithRole(client.getMessagePart(), 'role');

			if (city) {
				client.updateConversationState({
					requstedRole: role,
				});

				console.log('User wants the person who is their', role.value);
			}
		},

		prompt: function () {
			client.addResponse('prompt/weather_city');
			client.done();
		},
	});


	// was provideWeather
	var provideAdvisor = client.createStep({
		satisfied: function () {
			return false;
		},

		prompt: function () {
			// Need to provide weather
			var weatherData = {
				person: "DM1",
				requestedRole: client.getConversationState().role.value,
			};

			client.addResponse('provide_weather/current', weatherData);


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
};