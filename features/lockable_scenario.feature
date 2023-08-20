Feature: Lockable Scenario
	Scenario: A scenario locked will give a reason on disabled field
		Given there have some attendees
			| token                                | event_id   | role     | display_name | first_used_at             |
			| f185f505-d8c0-43ce-9e7b-bb9e8909072d | SITCON2023 | audience | Aotoki       | 2023-08-20 00:00:00 GMT+0 |
		And there have a ruleset for "SITCON2023" with name "audience" and scenarios:
			"""
			{
				"kit": {
					"order": 0,
					"display_text": {
						"en-US": "Welcome Kit",
						"zh-TW": "迎賓袋"
					},
					"locked": true,
					"lock_reason": "尚未報到"
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
					"kit": {
						"order": 0,
						"display_text": {
							"en-US": "Welcome Kit",
							"zh-TW": "迎賓袋"
						},
						"disabled": "尚未報到"
					}
				},
				"attr": {}
			}
			"""
	Scenario: A scenario can unlock by attendee metadata
		Given there have some attendees
			| token                                | event_id   | role     | metadata         | display_name | first_used_at             |
			| f185f505-d8c0-43ce-9e7b-bb9e8909072d | SITCON2023 | audience | {"個人贊助":"Y"} | Aotoki       | 2023-08-20 00:00:00 GMT+0 |
		And there have a ruleset for "SITCON2023" with name "audience" and scenarios:
			"""
			{
				"vipkit": {
					"order": 0,
					"display_text": {
						"en-US": "Special Gift",
						"zh-TW": "獨家紀念品"
					},
					"locked": true,
					"lock_reason": "For Sponsor Only",
					"unlock_condition": {
						"key": "個人贊助",
						"value": "Y"
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
					"vipkit": {
						"order": 0,
						"display_text": {
							"en-US": "Special Gift",
							"zh-TW": "獨家紀念品"
						},
						"disabled": null
					}
				},
				"attr": {
					"個人贊助": "Y"
				}
			}
			"""
