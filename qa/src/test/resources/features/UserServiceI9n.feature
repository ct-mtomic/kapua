###############################################################################
# Copyright (c) 2011, 2016 Eurotech and/or its affiliates and others
#
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the Eclipse Public License v1.0
# which accompanies this distribution, and is available at
# http://www.eclipse.org/legal/epl-v10.html
#
# Contributors:
#     Eurotech - initial API and implementation
#
###############################################################################

Feature: User Service Integration
  User Service integration scenarios

  Scenario: Deleting user in account that is lower in hierarchy
  Using user A in in different scope than user B, try to delete user B. Scope of user A is one
  level higher than scope of B. Scope of A is parent of scope B. This allows user A to delete
  user B.
    When I login as user with name "kapua-sys" and password "kapua-password"
    Given Account
      | name      | scopeId |
      | account-a | 1       |
    And I configure
      | type    | name                   | value |
      | boolean | infiniteChildAccounts  | true  |
      | integer | maxNumberChildAccounts |  5    |
    And User A
      | name    | displayName  | email             | phoneNumber     | status  | userType |
      | kapua-a | Kapua User A | kapua_a@kapua.com | +386 31 323 444 | ENABLED | INTERNAL |
    And Credentials
      | name    | password          |
      | kapua-a | ToManySecrets123# |
    And Permissions
      | domain | action |
      | user   | read   |
      | user   | write  |
      | user   | delete |
    And Account
      | name      |
      | account-b |
    And I configure
      | type    | name                   | value |
      | boolean | infiniteChildAccounts  | true  |
      | integer | maxNumberChildAccounts |  5    |
    And User B
      | name    | displayName  | email             | phoneNumber     | status  | userType |
      | kapua-b | Kapua User B | kapua_b@kapua.com | +386 31 323 555 | ENABLED | INTERNAL |
    And Credentials
      | name    | password          |
      | kapua-b | ToManySecrets123# |
    And Permissions
      | domain | action |
      | user   | read   |
      | user   | write  |
      | user   | delete |
    And I logout
    When I login as user with name "kapua-a" and password "ToManySecrets123#"
    When I try to delete user "kapua-b"
    Then I don't get KapuaException
    And I logout

  Scenario: Deleting user in account that is higher in hierarchy
  Using user B in in different scope than user A, try to delete user A. Scope of user B is one
  level lower than scope of A. Scope of A is parent of scope B. Subordinate scope should not be
  allowed to delete user in parent scope, unless it has permissions in that scope.
    When I login as user with name "kapua-sys" and password "kapua-password"
    Given Account
      | name      | scopeId |
      | account-a | 1       |
    And I configure
      | type    | name                   | value |
      | boolean | infiniteChildAccounts  | true  |
      | integer | maxNumberChildAccounts |  5    |
    And User A
      | name    | displayName  | email             | phoneNumber     | status  | userType |
      | kapua-a | Kapua User A | kapua_a@kapua.com | +386 31 323 444 | ENABLED | INTERNAL |
    And Credentials
      | name    | password          |
      | kapua-a | ToManySecrets123# |
    And Permissions
      | domain | action |
      | user   | read   |
      | user   | write  |
      | user   | delete |
    And Account
      | name      |
      | account-b |
    And I configure
      | type    | name                   | value |
      | boolean | infiniteChildAccounts  | true  |
      | integer | maxNumberChildAccounts |  5    |
    And User B
      | name    | displayName  | email             | phoneNumber     | status  | userType |
      | kapua-b | Kapua User B | kapua_b@kapua.com | +386 31 323 555 | ENABLED | INTERNAL |
    And Credentials
      | name    | password          |
      | kapua-b | ToManySecrets123# |
    And Permissions
      | domain | action |
      | user   | read   |
      | user   | write  |
      | user   | delete |
    And I logout
    When I login as user with name "kapua-b" and password "ToManySecrets123#"
    When I try to delete user "kapua-a"
    Then I get KapuaException
    And I logout
