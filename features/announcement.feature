Feature: Announcement
  # Scenario: GET /announcement without any announcements populated
  #   When I make a GET request to "/announcement"
  #   Then the response status should be 200
  #   And the response json should be:
  #     """
  #     []
  #     """
  # Scenario: GET /announcement with existing token
  #   Given there are some announcements
  #     | datetime   | message_en    | message_zh   | uri                                           | role     |
  #     | 1693200000 | hello world   | 世界你好     | https://testability.opass.app/announcements/1 | staff    |
  #     | 1693232000 | hello world 1 | 世界你好 1   | https://testability.opass.app/announcements/2 | audience |
  #     | 1693232000 | hello world 2 | 世界你好 2   | https://testability.opass.app/announcements/3 | audience |
  #   And there have some attendees
  #     | token                                | event_id   | display_name |
  #     | f185f505-d8c0-43ce-9e7b-bb9e8909072d | COSCUP2023 | Aotoki       |
  #   When I make a GET request to "/announcement?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
  #   Then the response status should be 200
  #   And the response json should be:
  #     """
  #     [
  #       {
  #         "datetime": 1693216000,
  #         "msgEn": "hello world 1",
  #         "msgZh": "世界你好 1",
  #         "uri": "https://testability.opass.app/announcements/2",
  #       },
  #       {
  #         "datetime": 1693232000,
  #         "msgEn": "hello world 2",
  #         "msgZh": "世界你好 2",
  #         "uri": "https://testability.opass.app/announcements/3",
  #       }
  #     ]
  #     """
  # Scenario: GET /announcement with existing token of role "staff"
  #   Given there are some announcements
  #     | datetime   | message_en    | message_zh   | uri                                           | role     |
  #     | 1693200000 | hello world   | 世界你好     | https://testability.opass.app/announcements/1 | staff    |
  #     | 1693232000 | hello world 1 | 世界你好 1   | https://testability.opass.app/announcements/2 | audience |
  #   And there have some attendees
  #     | token                                | event_id   | display_name | role  |
  #     | f185f505-d8c0-43ce-9e7b-bb9e8909072d | COSCUP2023 | Aotoki       | staff |
  #   When I make a GET request to "/announcement?token=f185f505-d8c0-43ce-9e7b-bb9e8909072d"
  #   Then the response status should be 200
  #   And the response json should be:
  #     """
  #     [
  #       {
  #         "datetime": 1693200000,
  #         "msgEn": "hello world",
  #         "msgZh": "世界你好",
  #         "uri": "https://testability.opass.app/announcements/1",
  #       }
  #     ]
  #     """
  # Scenario: GET /announcement with nonexistent token
  #   Given there are some announcements
  #     | datetime   | message_en    | message_zh   | uri                                           | role     |
  #     | 1693200000 | hello world   | 世界你好     | https://testability.opass.app/announcements/1 | staff    |
  #     | 1693232000 | hello world 1 | 世界你好 1   | https://testability.opass.app/announcements/2 | audience |
  #     | 1693232000 | hello world 2 | 世界你好 2   | https://testability.opass.app/announcements/3 | audience |
  #   And there have some attendees
  #     | token                                | event_id   | display_name |
  #     | f185f505-d8c0-43ce-9e7b-bb9e8909072d | COSCUP2023 | Aotoki       |
  #   When I make a GET request to "/announcement?token=79fd7131-f46e-4335-8d0c-ac1fa551288b"
  #   Then the response status should be 200
  #   And the response json should be:
  #     """
  #     [
  #       {
  #         "datetime": 1693216000,
  #         "msgEn": "hello world 1",
  #         "msgZh": "世界你好 1",
  #         "uri": "https://testability.opass.app/announcements/2",
  #       },
  #       {
  #         "datetime": 1693232000,
  #         "msgEn": "hello world 2",
  #         "msgZh": "世界你好 2",
  #         "uri": "https://testability.opass.app/announcements/3"
  #       }
  #     ]
  #     """
  # Scenario: GET /announcement without token
  #   Given there are some announcements
  #     | datetime   | message_en    | message_zh   | uri                                           | role     |
  #     | 1693200000 | hello world   | 世界你好     | https://testability.opass.app/announcements/1 | staff    |
  #     | 1693232000 | hello world 1 | 世界你好 1   | https://testability.opass.app/announcements/2 | audience |
  #     | 1693232000 | hello world 2 | 世界你好 2   | https://testability.opass.app/announcements/3 | audience |
  #   When I make a GET request to "/announcement"
  #   Then the response status should be 200
  #   And the response json should be:
  #     """
  #     [
  #       {
  #         "datetime": 1693216000,
  #         "msgEn": "hello world 1",
  #         "msgZh": "世界你好 1",
  #         "uri": "https://testability.opass.app/announcements/2",
  #       },
  #       {
  #         "datetime": 1693232000,
  #         "msgEn": "hello world 2",
  #         "msgZh": "世界你好 2",
  #         "uri": "https://testability.opass.app/announcements/3"
  #       }
  #     ]
  #     """
