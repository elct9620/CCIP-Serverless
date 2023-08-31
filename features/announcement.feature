Feature: Announcement
  Scenario: GET /announcement without any announcements populated
    When I make a GET request to "/announcement"
    Then the response status should be 200
    And the response json should be:
      """
      []
      """
  Scenario: GET /announcement without token
    Given there are some announcements
      | announced_at              | message_en    | message_zh   | uri                                           | role     |
      | 2023-08-29 00:00:00 GMT+0 | hello world 1 | 世界你好 1   | https://testability.opass.app/announcements/1 | audience |
      | 2023-08-29 00:00:00 GMT+0 | hello world 2 | 世界你好 2   | https://testability.opass.app/announcements/2 | audience |
    When I make a GET request to "/announcement"
    Then the response status should be 200
    And the response json should be:
      """
      [
        {
          "datetime": 1693267200,
          "msgEn": "hello world 1",
          "msgZh": "世界你好 1",
          "uri": "https://testability.opass.app/announcements/1"
        },
        {
          "datetime": 1693267200,
          "msgEn": "hello world 2",
          "msgZh": "世界你好 2",
          "uri": "https://testability.opass.app/announcements/2"
        }
      ]
      """
