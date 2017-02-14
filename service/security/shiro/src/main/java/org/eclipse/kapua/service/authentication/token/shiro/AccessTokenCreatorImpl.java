<<<<<<< HEAD
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
=======
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
package org.eclipse.kapua.service.authentication.token.shiro;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;

import org.eclipse.kapua.commons.model.AbstractKapuaEntityCreator;
import org.eclipse.kapua.model.id.KapuaId;
import org.eclipse.kapua.service.authentication.token.AccessToken;
import org.eclipse.kapua.service.authentication.token.AccessTokenCreator;

/**
 * Access token implementation
 * 
 * @since 1.0
 *
 */
public class AccessTokenCreatorImpl extends AbstractKapuaEntityCreator<AccessToken> implements AccessTokenCreator {

    private static final long serialVersionUID = -27718046815190710L;

    @XmlElement(name = "tokenId")
    private String tokenId;

    @XmlElement(name = "userId")
    private KapuaId userId;

    @XmlElement(name = "expiresOn")
    private Date expiresOn;

    /**
     * Constructor
     * 
     * @param scopeId
     */
    protected AccessTokenCreatorImpl(KapuaId scopeId) {
        super(scopeId);
    }

    @Override
    public String getTokenId() {
        return tokenId;
    }

    @Override
    public void setTokenId(String tokenId) {
        this.tokenId = tokenId;

    }

    @Override
    public KapuaId getUserId() {
        return userId;
    }

    @Override
    public void setUserId(KapuaId userId) {
        this.userId = userId;
    }

    @Override
    public Date getExpiresOn() {
        return expiresOn;
    }

    @Override
    public void setExpiresOn(Date expiresOn) {
        this.expiresOn = expiresOn;
    }

}
