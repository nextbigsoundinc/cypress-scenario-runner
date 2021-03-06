Feature: Input tables
===


Scenario Template: Input values can be set within a scenario template
---
Given I navigate to "input actions"
And I set "<field>" to "<value>"
When I click "submit button"
Then "<submitted field>" text should be "<submitted value>"

Examples:
| field             | value                              | submitted field       | submitted value                    |
| text input        | Text value                         | submitted text        | Text value                         |
| password input    | Password value                     | submitted password    | Password value                     |
| textarea input    | Textarea value                     | submitted textarea    | Textarea value                     |
| radio input       | radio 2 value                      | submitted radio       | radio 2 value                      |
| radio input       | radio 2 custom attribute value     | submitted radio       | radio 2 value                      |
| checkbox input    | checkbox 2 value                   | submitted checkbox    | checkbox 2 value                   |
| checkbox input    | checkbox 2 value, checkbox 3 value | submitted checkbox    | checkbox 2 value; checkbox 3 value |
| select input      | option 2 value                     | submitted select      | option 2 value                     |
| select input      | option 2 label                     | submitted select      | option 2 value                     |


Scenario: Input values can be set using inline data tables
---
Given I navigate to "input actions"
And I set:
| element          | value                              |
| text input       | Text value                         |
| password input   | Password value                     |
| textarea input   | Textarea value                     |
| radio input      | radio 2 value                      |
| checkbox input   | checkbox 2 value, checkbox 3 value |
| select input     | option 2 label                     |
When I click "submit button"
Then "submitted text" text should be "Text value"
Then "submitted password" text should be "Password value"
Then "submitted textarea" text should be "Textarea value"
Then "submitted radio" text should be "radio 2 value"
Then "submitted checkbox" text should be "checkbox 2 value; checkbox 3 value"
Then "submitted select" text should be "option 2 value"


Scenario Template: Input values can be set using inline tables within a scenario template
---
Given I navigate to "input actions"
And I set:
| element          | value                              |
| text input       | Text value                         |
| password input   | Password value                     |
| textarea input   | Textarea value                     |
When I click "submit button"
Then "<submitted field>" text should be "<submitted value>"

Examples:
| submitted field       | submitted value                    |
| submitted text        | Text value                         |
| submitted password    | Password value                     |
| submitted textarea    | Textarea value                     |
