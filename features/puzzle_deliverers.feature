Feature: Puzzle Deliverers
  Scenario: When I ask for deliverers I can see a list of booths
    Given there have some booths
      | name   |
      | COSCUP |
      | SITCON |
    When I make a GET request to "/event/puzzle/deliverers"
    Then the response json should be:
      """
      [
        "COSCUP",
        "SITCON"
      ]
      """
    And the response status should be 200
