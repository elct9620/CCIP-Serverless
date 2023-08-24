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
