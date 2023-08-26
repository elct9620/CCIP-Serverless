Feature: Useable Scenario
	Scenario: When attendee try to use a unused scenario
		Given there have some attendees
      | token                                | event_id   | role     | metadata | display_name | first_used_at             |
      | f185f505-d8c0-43ce-9e7b-bb9e8909072d | SITCON2023 | audience |          | Aotoki       | 2023-08-20 00:00:00 GMT+0 |
    And there have a ruleset for "SITCON2023" with name "audience" and scenarios:
      """
      {
         "checkin":{
            "order":0,
            "available_time": {
              "start": "2023-08-26 00:00:00 GMT+0",
              "end": "2023-09-26 00:00:00 GMT+0"
            },
            "display_text":{
               "en-US":"Check-in",
               "zh-TW":"報到"
            },
            "locked":true,
            "conditions": {
            }
         }
      }
      """
		When I make a GET request to "/use/checkin?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
		Then the response status should be 200
		And the response json should have property "scenario.checkin.used" is not null
	Scenario: When attendee try to use a invisible scenario
		Given there have some attendees
			| token                                | event_id   | role     | metadata | display_name | first_used_at             |
			| f185f505-d8c0-43ce-9e7b-bb9e8909072d | SITCON2023 | audience |          | Aotoki       | 2023-08-20 00:00:00 GMT+0 |
		And there have a ruleset for "SITCON2023" with name "audience" and scenarios:
			"""
			{
				 "vipkit":{
						"order":0,
            "available_time": {
              "start": "2023-08-26 00:00:00 GMT+0",
              "end": "2023-09-26 00:00:00 GMT+0"
            },
						"display_text":{
							 "en-US":"Special Kit",
							 "zh-TW":"獨家紀念品"
						},
						"locked": true,
						"conditions": {
							"show": {
								"type": "Attribute",
								"args": ["個人贊助", "Y"]
							}
						}
				 }
			}
			"""
		When I make a GET request to "/use/vipkit?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
		Then the response status should be 400
		And the response json should be:
			"""
			{
				"message": "invalid scenario"
			}
			"""
