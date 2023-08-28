Feature: Announcement
  Scenario: GET /announcement without any announcements populated
    When I make a GET request to "/announcement"
    Then the response status should be 200
    And the response json should be:
      """
      []
      """
