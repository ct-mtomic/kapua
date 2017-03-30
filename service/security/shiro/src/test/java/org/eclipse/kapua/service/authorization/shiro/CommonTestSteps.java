/*******************************************************************************
 * Copyright (c) 2011, 2017 Eurotech and/or its affiliates and others
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Eurotech - initial API and implementation
 *
 *******************************************************************************/
package org.eclipse.kapua.service.authorization.shiro;

import javax.inject.Inject;

import org.eclipse.kapua.KapuaException;
import org.eclipse.kapua.test.KapuaTest;

import cucumber.api.Scenario;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Then;
import cucumber.runtime.java.guice.ScenarioScoped;

// Implementation of Gherkin steps used in various integration test scenarios.
@ScenarioScoped
public class CommonTestSteps extends KapuaTest {

    // Scenario scoped common test data
    CommonTestData commonData = null;

    @Inject
    public CommonTestSteps(CommonTestData commonData) {
        this.commonData = commonData;
    }

    // Database setup and tear-down steps
    @Before
    public void beforeScenario(Scenario scenario) throws KapuaException {
        commonData.clearData();
    }

    @After
    public void afterScenario() throws KapuaException {
    }

    // Cucumber test steps

    @Then("^An exception was thrown$")
    public void exceptionCaught() {
        assertTrue(commonData.exceptionCaught);
    }

    @Then("^No exception was thrown$")
    public void noExceptionCaught() {
        assertFalse(commonData.exceptionCaught);
    }

    @Then("^I get (\\d+) as result$")
    public void checkCountResult(int num) {
        assertEquals(num, commonData.count);
    }

    @Then("^I get the string \"(.+)\" as result$")
    public void checkStringResult(String text) {
        assertEquals(text, commonData.stringValue);
    }
}
