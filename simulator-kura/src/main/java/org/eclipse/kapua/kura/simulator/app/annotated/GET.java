/*******************************************************************************
 * Copyright (c) 2017 Red Hat Inc and others
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Red Hat Inc - initial API and implementation
 *******************************************************************************/
package org.eclipse.kapua.kura.simulator.app.annotated;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 * Map a method for command access using GET
 * <p>
 * This annotation marks the methods as an external command resource using the
 * GET method. The resource name is the name of the method.
 * </p>
 * <p>
 * <strong>Note: </strong>Marking methods with multiple, conflicting annotations
 * may result in an undefined behavior.
 * </p>
 */
@Retention(RUNTIME)
@Target(METHOD)
@Inherited
public @interface GET {

}
