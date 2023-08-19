Feature: Index
	Scenario: GET /
		When I make a GET request to "/"
		Then the response status should be 200
		And the response json should be:
			"""
			{
				"version": "0.1.0"
			}
			"""
