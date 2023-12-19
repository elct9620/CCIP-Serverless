Feature: Puzzle Revoke
  Scenario: PUT /event/puzzle/revoke to revoke attendee puzzle
    Given there have some attendees
      | token                                | event_id | display_name |
      | f185f505-d8c0-43ce-9e7b-bb9e8909072d | SITCON   | Aotoki       |
    When I make a PUT request to "/event/puzzle/revoke?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d":
      """
      {}
      """
    Then the response json should be:
      """
      {
        "status": "OK"
      }
      """
    And the response status should be 200
