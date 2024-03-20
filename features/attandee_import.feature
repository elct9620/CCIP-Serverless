Feature: Attendee Importation
  Scenario: POST /attendees
    When I make a POST request to "/attendees" with file "attendees.csv"
    Then the response status should be 200
