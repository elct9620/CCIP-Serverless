Feature: Status
	Scenario: When attendee is first use then set current time to first_used_at
		Given there have some attendees
			| token                                | event_id   | display_name | first_used_at |
			| f185f505-d8c0-43ce-9e7b-bb9e8909072d | SITCON2023 | Aotoki       |               |
		When I make a GET request to "/status?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
		Then the response status should be 200
		And the response json should have property "first_use" is not null
	Scenario: When staff query attendee status and not update first_used_at
		Given there have some attendees
			| token                                | event_id  | display_name | first_used_at |
			| f185f505-d8c0-43ce-9e7b-bb9e8909072d | PYCON2023 | Aotoki       |               |
		When I make a GET request to "/status?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d&StaffQuery=true"
		Then the response status should be 200
		And the response json should have property "first_use" is null
	Scenario: When attendee is used then return first_used_at
		Given there have some attendees
			| token                                | event_id   | display_name | first_used_at             |
			| f185f505-d8c0-43ce-9e7b-bb9e8909072d | COSCUP2023 | Aotoki       | 2023-08-20 00:00:00 GMT+0 |
		When I make a GET request to "/status?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
		Then the response status should be 200
		And the response json should be:
			"""
			{
				"event_id": "COSCUP2023",
				"user_id": "Aotoki",
				"first_use": 1692489600,
				"role": "audience"
			}
			"""
	Scenario: When attendee is staff then role is staff
		Given there have some attendees
			| token                                | event_id   | display_name | role  | first_used_at             |
			| f185f505-d8c0-43ce-9e7b-bb9e8909072d | HITCON2023 | Aotoki       | staff | 2023-08-20 00:00:00 GMT+0 |
		When I make a GET request to "/status?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
		Then the response status should be 200
		And the response json should be:
			"""
			{
				"event_id": "HITCON2023",
				"user_id": "Aotoki",
				"first_use": 1692489600,
				"role": "staff"
			}
			"""
