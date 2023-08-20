Feature: Scenario
	Scenario: A scenario configured for role then display it
		Given there have some attendees
			| token                                | event_id   | role     | display_name | first_used_at             |
			| f185f505-d8c0-43ce-9e7b-bb9e8909072d | SITCON2023 | audience | Aotoki       | 2023-08-20 00:00:00 GMT+0 |
		And there have a ruleset for "SITCON2023" with name "audience" and scenarios:
			"""
			{
				"day1checkin": {
					"order": 0,
					"display_text": {
						"en-US": "Day 1 Check-in",
						"zh-TW": "第一天報到"
					}
				}
			}
			"""
		When I make a GET request to "/status?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
		Then the response status should be 200
		And the response json should be:
			"""
			{
				"event_id": "SITCON2023",
				"user_id": "Aotoki",
				"first_use": 1692489600,
				"role": "audience",
				"scenario": {
					"day1checkin": {
						"order": 0,
						"display_text": {
							"en-US": "Day 1 Check-in",
							"zh-TW": "第一天報到"
						}
					}
				},
				"attr": {}
			}
			"""
