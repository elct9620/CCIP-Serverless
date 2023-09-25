Feature: Puzzle Deliverers
  Scenario: When I ask for deliverers I can see a list of booths
    Given there have some booths
      | token                                | name   | event_id |
      | 30b546a6-4710-43c1-9556-421906f2afe1 | COSCUP | SITCON   |
      | f05e5898-10e7-4e75-b64f-61d2d062e4f9 | SITCON | SITCON   |
    When I make a GET request to "/event/puzzle/deliverers?event_id=SITCON"
    Then the response json should be:
      """
      [
        "COSCUP",
        "SITCON"
      ]
      """
    And the response status should be 200
