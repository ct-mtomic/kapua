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
package org.eclipse.kapua.message.internal.device.lifecycle;

import org.eclipse.kapua.message.device.lifecycle.KapuaDisconnectChannel;
import org.eclipse.kapua.message.device.lifecycle.KapuaDisconnectMessage;
import org.eclipse.kapua.message.device.lifecycle.KapuaDisconnectPayload;
import org.eclipse.kapua.message.internal.KapuaMessageImpl;

/**
 * Kapua disconnect message object reference implementation.
 * 
 * @since 1.0
 *
 */
public class KapuaDisconnectMessageImpl extends KapuaMessageImpl<KapuaDisconnectChannel, KapuaDisconnectPayload> implements KapuaDisconnectMessage {
	
	private String clientId;

	@Override
	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	@Override
	public String getClientId() {
		return clientId;
	}
	
}
