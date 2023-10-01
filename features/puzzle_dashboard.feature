Feature: Puzzle Dashboard
  Scenario: Get the event "SITCON" puzzle dashboard show the puzzle stats
    When I make a GET request to "/event/puzzle/dashboard?event_id=SITCON"
		And the response json should be:
			"""
			[
        {
          "puzzle": "total", "quantity": 0, "currency": 0
        }
			]
			"""
    Then the response status should be 200
