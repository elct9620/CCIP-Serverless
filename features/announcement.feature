Feature: Announcement
  Scenario: GET /announcement without any announcements populated
    When I make a GET request to "/announcement"
    Then the response status should be 200
    And the response json should be:
      """
      []
      """
  Scenario: GET /announcement with token returns announcements based on token owner's role, ordered by id
    Given there have some attendees
      | token                                | event_id   | role  | metadata                                            | display_name | first_used_at             |
      | f185f505-d8c0-43ce-9e7b-bb9e8909072d | SITCON2023 | staff | {"_scenario_checkin": "2023-08-27 00:00:00 GMT+0" } | Aotoki       | 2023-08-20 00:00:00 GMT+0 |
    Given there are some announcements
      | id | announced_at              | message_en    | message_zh   | uri                                           | roles                 |
      | 1  | 2023-08-29 00:00:00 GMT+0 | hello world 1 | 世界你好 1   | https://testability.opass.app/announcements/1 | ["audience"]          |
      | 2  | 2023-08-29 00:00:00 GMT+0 | hello world 2 | 世界你好 2   | https://testability.opass.app/announcements/2 | ["audience", "staff"] |
      | 3  | 2023-08-29 01:00:00 GMT+0 | hello staff   | 工作人員你好 | https://testability.opass.app/announcements/3 | ["staff"]             |
    When I make a GET request to "/announcement?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
    Then the response status should be 200
    And the response json should be:
      """
      [
        {
          "datetime": 1693267200,
          "msgEn": "hello world 2",
          "msgZh": "世界你好 2",
          "uri": "https://testability.opass.app/announcements/2"
        },
        {
          "datetime": 1693270800,
          "msgEn": "hello staff",
          "msgZh": "工作人員你好",
          "uri": "https://testability.opass.app/announcements/3"
        }
      ]
      """
  Scenario: GET /announcement with nonexistent token returns announcements for audiences, ordered by id
    Given there are some announcements
      | id | announced_at              | message_en    | message_zh   | uri                                           | roles                 |
      | 1  | 2023-08-29 00:00:00 GMT+0 | hello world 1 | 世界你好 1   | https://testability.opass.app/announcements/1 | ["audience"]          |
      | 2  | 2023-08-29 00:00:00 GMT+0 | hello world 2 | 世界你好 2   | https://testability.opass.app/announcements/2 | ["audience", "staff"] |
      | 3  | 2023-08-29 01:00:00 GMT+0 | hello staff   | 工作人員你好 | https://testability.opass.app/announcements/3 | ["staff"]             |
    When I make a GET request to "/announcement?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
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
  Scenario: GET /announcement without token returns announcements for audience, ordered by id
    Given there are some announcements
      | id | announced_at              | message_en    | message_zh   | uri                                           | roles        |
      | 1  | 2023-08-29 00:00:00 GMT+0 | hello world 1 | 世界你好 1   | https://testability.opass.app/announcements/1 | ["audience"] |
      | 2  | 2023-08-29 00:00:00 GMT+0 | hello world 2 | 世界你好 2   | https://testability.opass.app/announcements/2 | ["audience"] |
      | 3  | 2023-08-29 01:00:00 GMT+0 | hello staff   | 工作人員你好 | https://testability.opass.app/announcements/3 | ["staff"]    |
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
  Scenario: POST /announcement
    When I make a POST request to "/announcement":
      | msg_en        | msg_zh   | uri                                           | role         |
      | hello world   | 世界你好 | https://testability.opass.app/announcements/1 | ["audience"] |
    Then the response status should be 200
    And the response json should be:
      """
      {
        "status": "OK"
      }
      """
