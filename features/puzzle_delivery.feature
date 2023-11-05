Feature: Puzzle Delivery
  Scenario: POST /event/puzzle/deliver with permitted booth token and receiver token
    Given there have some booths
      | token                                | name   | event_id |
      | 1024914b-ee65-4728-b687-8341f5affa89 | COSCUP | SITCON   |
    Given there have some attendees
      | token                                | event_id   | display_name |
      | f185f505-d8c0-43ce-9e7b-bb9e8909072d | COSCUP2023 | Aotoki       |
    When I make a POST request to "/event/puzzle/deliver?token=1024914b-ee65-4728-b687-8341f5affa89":
      """
      {
        "receiver": "f185f505-d8c0-43ce-9e7b-bb9e8909072d"
      }
      """
    Then the response status should be 200
    And the response json should be:
      """
      {
        "status": "OK",
        "user_id": "Aotoki"
      }
      """
  Scenario: POST /event/puzzle/deliver with unpermitted booth token
    Given there have some attendees
      | token                                | event_id   | display_name |
      | f185f505-d8c0-43ce-9e7b-bb9e8909072d | COSCUP2023 | Aotoki       |
    When I make a POST request to "/event/puzzle/deliver?token=d9d09032-cdae-4da2-9f41-680ca64f2d21":
      """
      {
        "receiver": "f185f505-d8c0-43ce-9e7b-bb9e8909072d"
      }
      """
    Then the response status should be 400
    And the response json should be:
      """
      {
        "message": "invalid token"
      }
      """
  Scenario: POST /event/puzzle/deliver without booth token in querystring
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
  Scenario: POST /event/puzzle/deliver without receiver token
    When I make a POST request to "/event/puzzle/deliver?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d":
      """
      {}
      """
    Then the response status should be 400
    And the response json should be:
      """
      {
        "message": "token and receiver required"
      }
      """

  Scenario: POST /event/puzzle/deliver with nonexistent receiver token
    Given there have some booths
      | token                                | name   | event_id |
      | 1024914b-ee65-4728-b687-8341f5affa89 | COSCUP | SITCON   |
    When I make a POST request to "/event/puzzle/deliver?token=1024914b-ee65-4728-b687-8341f5affa89":
      """
      {
        "receiver": "1cf41a53-4aea-452b-a204-6b0b52eee380"
      }
      """
    Then the response json should be:
      """
      {
        "message": "invalid receiver token"
      }
      """
    And the response status should be 404
