/*******************************************************************************
<<<<<<< HEAD
 * Copyright (c) 2011, 2017 Eurotech and/or its affiliates and others
=======
 * Copyright (c) 2011, 2016 Eurotech and/or its affiliates and others
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
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
package org.eclipse.kapua.service.authentication.token.shiro;

<<<<<<< HEAD
import org.eclipse.kapua.KapuaEntityNotFoundException;
=======
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
import org.eclipse.kapua.KapuaException;
import org.eclipse.kapua.commons.jpa.EntityManager;
import org.eclipse.kapua.commons.service.internal.ServiceDAO;
import org.eclipse.kapua.model.id.KapuaId;
import org.eclipse.kapua.model.query.KapuaQuery;
import org.eclipse.kapua.service.authentication.token.AccessToken;
import org.eclipse.kapua.service.authentication.token.AccessTokenCreator;
import org.eclipse.kapua.service.authentication.token.AccessTokenListResult;

/**
 * Access token DAO.
 * 
 * @since 1.0
 *
 */
public class AccessTokenDAO extends ServiceDAO {

    /**
     * Creates and return new access token
     * 
     * @param em
     * @param accessTokenCreator
     * @return
     * @throws KapuaException
     */
    public static AccessToken create(EntityManager em, AccessTokenCreator accessTokenCreator)
            throws KapuaException {
        //
        // Create User
        AccessTokenImpl accessTokenImpl = new AccessTokenImpl(accessTokenCreator.getScopeId(),
                accessTokenCreator.getUserId(),
                accessTokenCreator.getTokenId(),
                accessTokenCreator.getExpiresOn(),
                accessTokenCreator.getRefreshToken(),
                accessTokenCreator.getRefreshExpiresOn());

        return ServiceDAO.create(em, accessTokenImpl);
    }

    /**
     * Update the provided access token
     * 
     * @param em
     * @param accessToken
     * @return
     * @throws KapuaException
     */
    public static AccessToken update(EntityManager em, AccessToken accessToken)
            throws KapuaException {
        //
        // Update user
        AccessTokenImpl accessTokenImpl = (AccessTokenImpl) accessToken;

        return ServiceDAO.update(em, AccessTokenImpl.class, accessTokenImpl);
    }

    /**
     * Delete the accessToken by access token identifier
     * 
     * @param em
     * @param accessTokenId
<<<<<<< HEAD
     * @throws KapuaEntityNotFoundException
     *             If {@link AccessToken} is not found.
     */
    public static void delete(EntityManager em, KapuaId accessTokenId) throws KapuaEntityNotFoundException {
=======
     */
    public static void delete(EntityManager em, KapuaId accessTokenId) {
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
        ServiceDAO.delete(em, AccessTokenImpl.class, accessTokenId);
    }

    /**
     * Find the access token by access token identifier
     * 
     * @param em
     * @param accessTokenId
     * @return
     */
    public static AccessToken find(EntityManager em, KapuaId accessTokenId) {
        return em.find(AccessTokenImpl.class, accessTokenId);
    }

    /**
     * Find the access token by the token string id
     * 
     * @param em
     * @param tokenId
     * @return
     */
    public static AccessToken findByTokenId(EntityManager em, String tokenId) {
        return ServiceDAO.findByField(em, AccessTokenImpl.class, "tokenId", tokenId);
    }

    /**
     * Return the access token list matching the provided query
     * 
     * @param em
     * @param accessTokenQuery
     * @return
     * @throws KapuaException
     */
    public static AccessTokenListResult query(EntityManager em, KapuaQuery<AccessToken> accessTokenQuery)
            throws KapuaException {
        return ServiceDAO.query(em, AccessToken.class, AccessTokenImpl.class, new AccessTokenListResultImpl(), accessTokenQuery);
    }

    /**
     * Return the access token count matching the provided query
     * 
     * @param em
     * @param accessTokenQuery
     * @return
     * @throws KapuaException
     */
    public static long count(EntityManager em, KapuaQuery<AccessToken> accessTokenQuery)
            throws KapuaException {
        return ServiceDAO.count(em, AccessToken.class, AccessTokenImpl.class, accessTokenQuery);
    }
}
