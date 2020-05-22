Feature: Board
  In order to play a game
  As a guest
  I can see the game board

  Scenario: Visiting the Home Page
    Given an anonymous user
    When the user opens the home page
    Then they can see a new game board
