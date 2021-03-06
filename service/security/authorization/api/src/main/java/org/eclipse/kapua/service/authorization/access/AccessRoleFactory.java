/*******************************************************************************
 * Copyright (c) 2011, 2016 Eurotech and/or its affiliates and others
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
package org.eclipse.kapua.service.authorization.access;

import org.eclipse.kapua.model.KapuaEntityFactory;
import org.eclipse.kapua.model.KapuaObjectFactory;
import org.eclipse.kapua.model.id.KapuaId;

/**
 * {@link AccessRole} object factory.
 * 
 * @since 1.0.0
 *
 */
public interface AccessRoleFactory extends KapuaEntityFactory<AccessRole, AccessRoleCreator, AccessRoleQuery, AccessRoleListResult> {

}
