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

import java.util.Date;

import org.eclipse.kapua.KapuaEntityNotFoundException;
import org.eclipse.kapua.KapuaException;
<<<<<<< HEAD
import org.eclipse.kapua.commons.model.query.predicate.AttributePredicate;
import org.eclipse.kapua.commons.service.internal.AbstractKapuaService;
import org.eclipse.kapua.commons.util.ArgumentValidator;
import org.eclipse.kapua.locator.KapuaLocator;
import org.eclipse.kapua.locator.KapuaProvider;
import org.eclipse.kapua.model.id.KapuaId;
import org.eclipse.kapua.model.query.KapuaQuery;
import org.eclipse.kapua.model.query.predicate.KapuaPredicate;
=======
import org.eclipse.kapua.commons.jpa.EntityManager;
import org.eclipse.kapua.commons.model.query.predicate.AttributePredicate;
import org.eclipse.kapua.commons.util.ArgumentValidator;
import org.eclipse.kapua.commons.util.KapuaExceptionUtils;
import org.eclipse.kapua.locator.KapuaLocator;
import org.eclipse.kapua.model.id.KapuaId;
import org.eclipse.kapua.model.query.KapuaQuery;
import org.eclipse.kapua.model.query.predicate.KapuaPredicate;
import org.eclipse.kapua.service.authentication.shiro.AuthenticationEntityManagerFactory;
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
import org.eclipse.kapua.service.authentication.token.AccessToken;
import org.eclipse.kapua.service.authentication.token.AccessTokenCreator;
import org.eclipse.kapua.service.authentication.token.AccessTokenListResult;
import org.eclipse.kapua.service.authentication.token.AccessTokenPredicates;
import org.eclipse.kapua.service.authentication.token.AccessTokenQuery;
import org.eclipse.kapua.service.authentication.token.AccessTokenService;
import org.eclipse.kapua.service.authorization.AuthorizationService;
<<<<<<< HEAD
import org.eclipse.kapua.service.authorization.domain.Domain;
=======
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
import org.eclipse.kapua.service.authorization.permission.Actions;
import org.eclipse.kapua.service.authorization.permission.PermissionFactory;

/**
 * Access token service implementation.
 * 
 * @since 1.0
 *
 */
<<<<<<< HEAD
@KapuaProvider
public class AccessTokenServiceImpl extends AbstractKapuaService implements AccessTokenService {

    private static final Domain accessTokenDomain = new AccessTokenDomain();

    /**
     * Constructor
     */
    public AccessTokenServiceImpl() {
        super(AccessTokenEntityManagerFactory.getInstance());
    }
=======
public class AccessTokenServiceImpl implements AccessTokenService {
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d

    @Override
    public AccessToken create(AccessTokenCreator accessTokenCreator)
            throws KapuaException {
        //
        // Argument Validation
        ArgumentValidator.notNull(accessTokenCreator, "accessTokenCreator");
        ArgumentValidator.notNull(accessTokenCreator.getScopeId(), "accessTokenCreator.scopeId");
        ArgumentValidator.notNull(accessTokenCreator.getTokenId(), "accessTokenCreator.tokenId");
        ArgumentValidator.notNull(accessTokenCreator.getUserId(), "accessTokenCreator.userId");
        ArgumentValidator.notNull(accessTokenCreator.getExpiresOn(), "accessTokenCreator.expiresOn");

        //
        // Check access
        KapuaLocator locator = KapuaLocator.getInstance();
        AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
        PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
<<<<<<< HEAD
        authorizationService.checkPermission(permissionFactory.newPermission(accessTokenDomain, Actions.write, accessTokenCreator.getScopeId()));

        //
        // Do create
        return entityManagerSession.onTransactedInsert(em -> AccessTokenDAO.create(em, accessTokenCreator));
=======
        authorizationService.checkPermission(permissionFactory.newPermission(AccessTokenDomain.ACCESS_TOKEN, Actions.write, accessTokenCreator.getScopeId()));

        //
        // Do create
        AccessToken accessToken = null;
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {
            em.beginTransaction();

            accessToken = AccessTokenDAO.create(em, accessTokenCreator);
            accessToken = AccessTokenDAO.find(em, accessToken.getId());

            em.commit();
        } catch (Exception pe) {
            em.rollback();
            throw KapuaExceptionUtils.convertPersistenceException(pe);
        } finally {
            em.close();
        }

        return accessToken;
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
    }

    @Override
    public AccessToken update(AccessToken accessToken)
            throws KapuaException {
        //
        // Argument Validation
        ArgumentValidator.notNull(accessToken, "accessToken");
        ArgumentValidator.notNull(accessToken.getId(), "accessToken.id");
        ArgumentValidator.notNull(accessToken.getScopeId(), "accessToken.scopeId");
        ArgumentValidator.notNull(accessToken.getUserId(), "accessToken.userId");
        ArgumentValidator.notNull(accessToken.getExpiresOn(), "accessToken.expiresOn");

        //
        // Check access
        KapuaLocator locator = KapuaLocator.getInstance();
        AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
        PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
<<<<<<< HEAD
        authorizationService.checkPermission(permissionFactory.newPermission(accessTokenDomain, Actions.write, accessToken.getScopeId()));

        //
        // Do update
        return entityManagerSession.onTransactedResult(em -> {
=======
        authorizationService.checkPermission(permissionFactory.newPermission(AccessTokenDomain.ACCESS_TOKEN, Actions.write, accessToken.getScopeId()));

        //
        // Do update
        AccessToken accessTokenUpdated = null;
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {

>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
            AccessToken currentAccessToken = AccessTokenDAO.find(em, accessToken.getId());
            if (currentAccessToken == null) {
                throw new KapuaEntityNotFoundException(AccessToken.TYPE, accessToken.getId());
            }

<<<<<<< HEAD
            return AccessTokenDAO.update(em, accessToken);
        });
=======
            // Passing attributes??

            em.beginTransaction();
            AccessTokenDAO.update(em, accessToken);
            em.commit();

            accessTokenUpdated = AccessTokenDAO.find(em, accessToken.getId());
        } catch (Exception pe) {
            em.rollback();
            throw KapuaExceptionUtils.convertPersistenceException(pe);
        } finally {
            em.close();
        }

        return accessTokenUpdated;
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
    }

    @Override
    public AccessToken find(KapuaId scopeId, KapuaId accessTokenId)
            throws KapuaException {
        // Validation of the fields
        ArgumentValidator.notNull(scopeId, "scopeId");
        ArgumentValidator.notNull(accessTokenId, "accessTokenId");

        //
        // Check Access
        KapuaLocator locator = KapuaLocator.getInstance();
        AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
        PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
<<<<<<< HEAD
        authorizationService.checkPermission(permissionFactory.newPermission(accessTokenDomain, Actions.read, scopeId));

        //
        // Do find
        return entityManagerSession.onResult(em -> AccessTokenDAO.find(em, accessTokenId));
=======
        authorizationService.checkPermission(permissionFactory.newPermission(AccessTokenDomain.ACCESS_TOKEN, Actions.read, scopeId));

        //
        // Do find
        AccessToken accessToken = null;
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {
            accessToken = AccessTokenDAO.find(em, accessTokenId);
        } catch (Exception pe) {
            throw KapuaExceptionUtils.convertPersistenceException(pe);
        } finally {
            em.close();
        }

        return accessToken;
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
    }

    @Override
    public AccessTokenListResult query(KapuaQuery<AccessToken> query)
            throws KapuaException {
        //
        // Argument Validation
        ArgumentValidator.notNull(query, "query");
        ArgumentValidator.notNull(query.getScopeId(), "query.scopeId");

        //
        // Check Access
        KapuaLocator locator = KapuaLocator.getInstance();
        AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
        PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
<<<<<<< HEAD
        authorizationService.checkPermission(permissionFactory.newPermission(accessTokenDomain, Actions.read, query.getScopeId()));

        //
        // Do query
        return entityManagerSession.onResult(em -> AccessTokenDAO.query(em, query));
=======
        authorizationService.checkPermission(permissionFactory.newPermission(AccessTokenDomain.ACCESS_TOKEN, Actions.read, query.getScopeId()));

        //
        // Do count
        AccessTokenListResult result = null;
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {
            result = AccessTokenDAO.query(em, query);
        } catch (Exception e) {
            throw KapuaExceptionUtils.convertPersistenceException(e);
        } finally {
            em.close();
        }

        return result;
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
    }

    @Override
    public long count(KapuaQuery<AccessToken> query)
            throws KapuaException {
        //
        // Argument Validation
        ArgumentValidator.notNull(query, "query");
        ArgumentValidator.notNull(query.getScopeId(), "query.scopeId");

        //
        // Check Access
        KapuaLocator locator = KapuaLocator.getInstance();
        AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
        PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
<<<<<<< HEAD
        authorizationService.checkPermission(permissionFactory.newPermission(accessTokenDomain, Actions.read, query.getScopeId()));

        //
        // Do count
        return entityManagerSession.onResult(em -> AccessTokenDAO.count(em, query));
=======
        authorizationService.checkPermission(permissionFactory.newPermission(AccessTokenDomain.ACCESS_TOKEN, Actions.read, query.getScopeId()));

        //
        // Do count
        long count = 0;
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {
            count = AccessTokenDAO.count(em, query);
        } catch (Exception e) {
            throw KapuaExceptionUtils.convertPersistenceException(e);
        } finally {
            em.close();
        }

        return count;
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
    }

    @Override
    public void delete(KapuaId scopeId, KapuaId accessTokenId)
            throws KapuaException {
        //
        // Argument Validation
        ArgumentValidator.notNull(scopeId, "scopeId");
        ArgumentValidator.notNull(accessTokenId, "accessTokenId");

        //
        // Check Access
        KapuaLocator locator = KapuaLocator.getInstance();
        AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
        PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
<<<<<<< HEAD
        authorizationService.checkPermission(permissionFactory.newPermission(accessTokenDomain, Actions.delete, scopeId));

        //
        // Do delete
        entityManagerSession.onTransactedAction(em -> {
=======
        authorizationService.checkPermission(permissionFactory.newPermission(AccessTokenDomain.ACCESS_TOKEN, Actions.delete, scopeId));

        //
        // Do delete
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
            if (AccessTokenDAO.find(em, accessTokenId) == null) {
                throw new KapuaEntityNotFoundException(AccessToken.TYPE, accessTokenId);
            }

<<<<<<< HEAD
            AccessTokenDAO.delete(em, accessTokenId);
        });
=======
            em.beginTransaction();
            AccessTokenDAO.delete(em, accessTokenId);
            em.commit();
        } catch (Exception e) {
            em.rollback();
            throw KapuaExceptionUtils.convertPersistenceException(e);
        } finally {
            em.close();
        }
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
    }

    @Override
    public AccessTokenListResult findByUserId(KapuaId scopeId, KapuaId userId)
            throws KapuaException {
        //
        // Argument Validation
        ArgumentValidator.notNull(scopeId, "scopeId");
        ArgumentValidator.notNull(userId, "userId");

        //
        // Check Access
        KapuaLocator locator = KapuaLocator.getInstance();
        AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
        PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
<<<<<<< HEAD
        authorizationService.checkPermission(permissionFactory.newPermission(accessTokenDomain, Actions.read, scopeId));
=======
        authorizationService.checkPermission(permissionFactory.newPermission(AccessTokenDomain.ACCESS_TOKEN, Actions.read, scopeId));
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d

        //
        // Build query
        AccessTokenQuery query = new AccessTokenQueryImpl(scopeId);
        KapuaPredicate predicate = new AttributePredicate<KapuaId>(AccessTokenPredicates.USER_ID, userId);
        query.setPredicate(predicate);

        //
        // Query and return result
        return query(query);
    }

    @Override
    public AccessToken findByTokenId(String tokenId)
            throws KapuaException {
        //
        // Argument Validation
        ArgumentValidator.notNull(tokenId, "tokenId");

        //
        // Do the find
<<<<<<< HEAD
        AccessToken accessToken = entityManagerSession.onResult(em -> AccessTokenDAO.findByTokenId(em, tokenId));
=======
        AccessToken accessToken = null;
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {
            accessToken = AccessTokenDAO.findByTokenId(em, tokenId);
        } catch (Exception e) {
            throw KapuaExceptionUtils.convertPersistenceException(e);
        } finally {
            em.close();
        }
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d

        //
        // Check Access
        if (accessToken != null) {
            KapuaLocator locator = KapuaLocator.getInstance();
            AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
            PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
<<<<<<< HEAD
            authorizationService.checkPermission(permissionFactory.newPermission(accessTokenDomain, Actions.read, accessToken.getScopeId()));
=======
            authorizationService.checkPermission(permissionFactory.newPermission(AccessTokenDomain.ACCESS_TOKEN, Actions.read, accessToken.getId()));
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
        }

        return accessToken;
    }

    @Override
    public void invalidate(KapuaId scopeId, KapuaId accessTokenId) throws KapuaException {
        //
        // Validation of the fields
        ArgumentValidator.notNull(scopeId, "scopeId");
        ArgumentValidator.notNull(accessTokenId, "accessTokenId");

        //
        // Check Access
        KapuaLocator locator = KapuaLocator.getInstance();
        AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
        PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
<<<<<<< HEAD
        authorizationService.checkPermission(permissionFactory.newPermission(accessTokenDomain, Actions.read, scopeId));

        //
        // Do find
        entityManagerSession.onTransactedResult(em -> {
            Date now = new Date();
            AccessToken accessToken = AccessTokenDAO.find(em, accessTokenId);
            accessToken.setInvalidatedOn(now);
            return AccessTokenDAO.update(em, accessToken);
        });
=======
        authorizationService.checkPermission(permissionFactory.newPermission(AccessTokenDomain.ACCESS_TOKEN, Actions.read, scopeId));

        //
        // Do find
        AccessToken accessToken = null;
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {
            em.beginTransaction();

            accessToken = AccessTokenDAO.find(em, accessTokenId);
            accessToken.setExpiresOn(new Date());
            AccessTokenDAO.update(em, accessToken);

            em.commit();
        } catch (Exception pe) {
            em.rollback();
            throw KapuaExceptionUtils.convertPersistenceException(pe);
        } finally {
            em.close();
        }
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
    }
}
