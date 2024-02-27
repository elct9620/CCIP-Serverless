Feature: Puzzle Coupon
  Scenario: PUT /event/puzzle/coupon to redeem a puzzle coupon
    Given there have some booths
      | token                                | name   | event_id |
      | 1024914b-ee65-4728-b687-8341f5affa89 | COSCUP | SITCON   |
    And there have some attendees
      | token                                | event_id | display_name |
      | f185f505-d8c0-43ce-9e7b-bb9e8909072d | SITCON   | Aotoki       |
    When I make a PUT request to "/event/puzzle/coupon?token=1024914b-ee65-4728-b687-8341f5affa89&event_id=SITCON":
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
