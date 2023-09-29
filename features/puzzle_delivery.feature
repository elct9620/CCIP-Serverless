Feature: Puzzle Delivery
  Scenario: POST /event/puzzle/deliver without token in querystring
    When I make a POST request to "/event/puzzle/deliver":
      """
      {
        "receiver": "1cf41a53-4aea-452b-a204-6b0b52eee380"
      }
      """
    Then the response status should be 400
    And the response json should be:
      """
      {
        "message": "token and receiver required"
      }
      """
