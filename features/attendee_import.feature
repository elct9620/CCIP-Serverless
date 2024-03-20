Feature: Attendee Importation
  Scenario: POST /attendees
    When I make a POST request to "/attendees" with file:
    """
    token,display_name,
    "fccfc8bfa07643a1ca8015cbe74f5f17","Aotoki",
    "93dc46e553ac602b0d6c6d7307e523f1","Danny",
    """
    Then the response status should be 200
