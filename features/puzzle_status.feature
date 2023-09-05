Feature: Puzzle Status
  Scenario: When I open puzzle status, I can see the status of specify token
    Given there have some attendees
      | token                                | event_id   | role     | display_name | first_used_at             |
      | f185f505-d8c0-43ce-9e7b-bb9e8909072d | SITCON2023 | audience | Aotoki       | 2023-08-20 00:00:00 GMT+0 |
    When I make a GET request to "/event/puzzle?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
    Then the response status should be 200
    And the response json should be:
      """
      {
        "user_id": "Aotoki",
        "puzzles": [],
        "deliverers": [],
        "valid": 0,
        "coupon": 0
      }
      """
