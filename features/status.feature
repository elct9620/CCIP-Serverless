Feature: Status
	@wip
	Scenario: When attendee is first use then set current time to first_used_at
		Given there have some attendees
			| token                                | user_id | first_used_at |
			| f185f505-d8c0-43ce-9e7b-bb9e8909072d | Aotoki  |               |
		When I make a GET request to "/status?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
		Then the response status should be 200
		And the response json should be:
			"""
			{
				"user_id": "Aotoki",
				"first_use": 0
			}
			"""
	Scenario: When attendee is used then return first_used_at
		Given there have some attendees
			| token                                | user_id | first_used_at       |
			| f185f505-d8c0-43ce-9e7b-bb9e8909072d | Aotoki  | 2023-08-20 00:00:00 |
		When I make a GET request to "/status?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
		Then the response status should be 200
		And the response json should be:
			"""
			{
				"user_id": "Aotoki",
				"first_use": 1692489600
			}
			"""
