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
package org.eclipse.kapua.service.authentication.credential.shiro;

import java.security.SecureRandom;

import org.apache.shiro.codec.Base64;
import org.eclipse.kapua.KapuaEntityNotFoundException;
import org.eclipse.kapua.KapuaException;
<<<<<<< HEAD
import org.eclipse.kapua.KapuaIllegalArgumentException;
=======
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
import org.eclipse.kapua.commons.jpa.EntityManager;
import org.eclipse.kapua.commons.model.query.predicate.AndPredicate;
import org.eclipse.kapua.commons.model.query.predicate.AttributePredicate;
import org.eclipse.kapua.commons.service.internal.AbstractKapuaService;
import org.eclipse.kapua.commons.util.ArgumentValidator;
import org.eclipse.kapua.commons.util.KapuaExceptionUtils;
import org.eclipse.kapua.locator.KapuaLocator;
import org.eclipse.kapua.locator.KapuaProvider;
import org.eclipse.kapua.model.id.KapuaId;
import org.eclipse.kapua.model.query.KapuaQuery;
import org.eclipse.kapua.model.query.predicate.KapuaAttributePredicate.Operator;
import org.eclipse.kapua.model.query.predicate.KapuaPredicate;
import org.eclipse.kapua.service.authentication.credential.Credential;
import org.eclipse.kapua.service.authentication.credential.CredentialCreator;
import org.eclipse.kapua.service.authentication.credential.CredentialFactory;
import org.eclipse.kapua.service.authentication.credential.CredentialListResult;
import org.eclipse.kapua.service.authentication.credential.CredentialPredicates;
import org.eclipse.kapua.service.authentication.credential.CredentialQuery;
import org.eclipse.kapua.service.authentication.credential.CredentialService;
import org.eclipse.kapua.service.authentication.credential.CredentialType;
import org.eclipse.kapua.service.authentication.shiro.AuthenticationEntityManagerFactory;
import org.eclipse.kapua.service.authentication.shiro.setting.KapuaAuthenticationSetting;
import org.eclipse.kapua.service.authentication.shiro.setting.KapuaAuthenticationSettingKeys;
import org.eclipse.kapua.service.authorization.AuthorizationService;
import org.eclipse.kapua.service.authorization.domain.Domain;
import org.eclipse.kapua.service.authorization.permission.Actions;
import org.eclipse.kapua.service.authorization.permission.PermissionFactory;

/**
 * Credential service implementation.
 * 
 * @since 1.0
 *
 */
<<<<<<< HEAD
@KapuaProvider
public class CredentialServiceImpl extends AbstractKapuaService implements CredentialService {

    private static final Domain credentialDomain = new CredentialDomain();

    public CredentialServiceImpl() {
        super(AuthenticationEntityManagerFactory.getInstance());
    }
=======
public class CredentialServiceImpl implements CredentialService {
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d

    @Override
    public Credential create(CredentialCreator credentialCreator)
            throws KapuaException {
        //
        // Argument Validation
        ArgumentValidator.notNull(credentialCreator, "credentialCreator");
        ArgumentValidator.notNull(credentialCreator.getScopeId(), "credentialCreator.scopeId");
        ArgumentValidator.notNull(credentialCreator.getUserId(), "credentialCreator.userId");
        ArgumentValidator.notNull(credentialCreator.getCredentialType(), "credentialCreator.credentialType");
        ArgumentValidator.notEmptyOrNull(credentialCreator.getCredentialPlainKey(), "credentialCreator.credentialKey");

        //
        // Check access
        KapuaLocator locator = KapuaLocator.getInstance();
        AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
        PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
        authorizationService.checkPermission(permissionFactory.newPermission(credentialDomain, Actions.write, credentialCreator.getScopeId()));

        //
        // Do create
        Credential credential = null;
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {
            em.beginTransaction();

            //
            // Do pre persist magic on key values
            String fullKey = null;
            switch (credentialCreator.getCredentialType()) {
            case API_KEY: // Generate new api key
                SecureRandom random = SecureRandom.getInstance("SHA1PRNG");

                KapuaAuthenticationSetting setting = KapuaAuthenticationSetting.getInstance();
                int preLength = setting.getInt(KapuaAuthenticationSettingKeys.AUTHENTICATION_CREDENTIAL_APIKEY_PRE_LENGTH);
                int keyLength = setting.getInt(KapuaAuthenticationSettingKeys.AUTHENTICATION_CREDENTIAL_APIKEY_KEY_LENGTH);

                byte[] bPre = new byte[preLength];
                random.nextBytes(bPre);
                String pre = Base64.encodeToString(bPre);

                byte[] bKey = new byte[keyLength];
                random.nextBytes(bKey);
                String key = Base64.encodeToString(bKey);

                fullKey = pre + key;

                credentialCreator = new CredentialCreatorImpl(credentialCreator.getScopeId(),
                        credentialCreator.getUserId(),
                        credentialCreator.getCredentialType(),
                        fullKey);

                break;
            case PASSWORD:
            default:
                // Don't do nothing special
                break;

            }

            credential = CredentialDAO.create(em, credentialCreator);
            credential = CredentialDAO.find(em, credential.getId());

            em.commit();

            //
            // Do post persist magic on key values
            switch (credentialCreator.getCredentialType()) {
            case API_KEY:
                credential.setCredentialKey(fullKey);
                break;
            case PASSWORD:
            default:
                credential.setCredentialKey(fullKey);
            }
        } catch (Exception pe) {
            em.rollback();
            throw KapuaExceptionUtils.convertPersistenceException(pe);
        } finally {
            em.close();
        }

        return credential;
    }

    @Override
    public Credential update(Credential credential)
            throws KapuaException {
        //
        // Argument Validation
        ArgumentValidator.notNull(credential, "credential");
        ArgumentValidator.notNull(credential.getId(), "credential.id");
        ArgumentValidator.notNull(credential.getScopeId(), "credential.scopeId");
        ArgumentValidator.notNull(credential.getUserId(), "credential.userId");
        ArgumentValidator.notNull(credential.getCredentialType(), "credential.credentialType");
        ArgumentValidator.notEmptyOrNull(credential.getCredentialKey(), "credential.credentialKey");

        //
        // Check access
        KapuaLocator locator = KapuaLocator.getInstance();
        AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
        PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
        authorizationService.checkPermission(permissionFactory.newPermission(credentialDomain, Actions.write, credential.getScopeId()));

        return entityManagerSession.onTransactedResult(em -> {
            Credential currentCredential = CredentialDAO.find(em, credential.getId());

            if (currentCredential == null) {
                throw new KapuaEntityNotFoundException(Credential.TYPE, credential.getId());
            }

<<<<<<< HEAD
            if (currentCredential.getCredentialType() != credential.getCredentialType()) {
                throw new KapuaIllegalArgumentException("credentialType", credential.getCredentialType().toString());
            }
=======
            // Passing attributes??

            em.beginTransaction();
            CredentialDAO.update(em, credential);
            em.commit();

            credentialUpdated = CredentialDAO.find(em, credential.getId());
        } catch (Exception pe) {
            em.rollback();
            throw KapuaExceptionUtils.convertPersistenceException(pe);
        } finally {
            em.close();
        }
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d

            // Passing attributes??
            return CredentialDAO.update(em, credential);
        });
    }

    @Override
    public Credential find(KapuaId scopeId, KapuaId credentialId)
            throws KapuaException {
        // Validation of the fields
        ArgumentValidator.notNull(scopeId, "scopeId");
        ArgumentValidator.notNull(credentialId, "credentialId");

        //
        // Check Access
        KapuaLocator locator = KapuaLocator.getInstance();
        AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
        PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
        authorizationService.checkPermission(permissionFactory.newPermission(credentialDomain, Actions.read, scopeId));

<<<<<<< HEAD
        return entityManagerSession.onResult(em -> CredentialDAO.find(em, credentialId));
=======
        //
        // Do find
        Credential credential = null;
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {
            credential = CredentialDAO.find(em, credentialId);
        } catch (Exception pe) {
            throw KapuaExceptionUtils.convertPersistenceException(pe);
        } finally {
            em.close();
        }

        return credential;
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
    }

    @Override
    public CredentialListResult query(KapuaQuery<Credential> query)
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
        authorizationService.checkPermission(permissionFactory.newPermission(credentialDomain, Actions.read, query.getScopeId()));
=======
        authorizationService.checkPermission(permissionFactory.newPermission(CredentialDomain.CREDENTIAL, Actions.read, query.getScopeId()));

        //
        // Do count
        CredentialListResult result = null;
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {
            result = CredentialDAO.query(em, query);
        } catch (Exception e) {
            throw KapuaExceptionUtils.convertPersistenceException(e);
        } finally {
            em.close();
        }
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d

        return entityManagerSession.onResult(em -> CredentialDAO.query(em, query));
    }

    @Override
    public long count(KapuaQuery<Credential> query)
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
        authorizationService.checkPermission(permissionFactory.newPermission(credentialDomain, Actions.read, query.getScopeId()));

<<<<<<< HEAD
        return entityManagerSession.onResult(em -> CredentialDAO.count(em, query));
=======
        //
        // Do count
        long count = 0;
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {
            count = CredentialDAO.count(em, query);
        } catch (Exception e) {
            throw KapuaExceptionUtils.convertPersistenceException(e);
        } finally {
            em.close();
        }

        return count;
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
    }

    @Override
    public void delete(KapuaId scopeId, KapuaId credentialId)
            throws KapuaException {
        //
        // Argument Validation
        ArgumentValidator.notNull(credentialId, "credential.id");
        ArgumentValidator.notNull(scopeId, "credential.scopeId");

        //
        // Check Access
        KapuaLocator locator = KapuaLocator.getInstance();
        AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
        PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
        authorizationService.checkPermission(permissionFactory.newPermission(credentialDomain, Actions.delete, scopeId));

        entityManagerSession.onTransactedAction(em -> {
            if (CredentialDAO.find(em, credentialId) == null) {
                throw new KapuaEntityNotFoundException(Credential.TYPE, credentialId);
            }
            CredentialDAO.delete(em, credentialId);
<<<<<<< HEAD
        });
=======
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
    public CredentialListResult findByUserId(KapuaId scopeId, KapuaId userId)
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
        authorizationService.checkPermission(permissionFactory.newPermission(credentialDomain, Actions.read, scopeId));

        //
        // Build query
        CredentialQuery query = new CredentialQueryImpl(scopeId);
        KapuaPredicate predicate = new AttributePredicate<KapuaId>(CredentialPredicates.USER_ID, userId);
        query.setPredicate(predicate);

        //
        // Query and return result
        return query(query);
    }

    @Override
    public Credential findByApiKey(String apiKey) throws KapuaException {
        //
        // Argument Validation
        ArgumentValidator.notEmptyOrNull(apiKey, "apiKey");

        //
        // Do the find
        Credential credential = null;
        EntityManager em = AuthenticationEntityManagerFactory.getEntityManager();
        try {

            //
            // Build search query
            KapuaAuthenticationSetting setting = KapuaAuthenticationSetting.getInstance();
            int preLength = setting.getInt(KapuaAuthenticationSettingKeys.AUTHENTICATION_CREDENTIAL_APIKEY_PRE_LENGTH);
            String preSeparator = setting.getString(KapuaAuthenticationSettingKeys.AUTHENTICATION_CREDENTIAL_APIKEY_PRE_SEPARATOR);
            String apiKeyPreValue = apiKey.substring(0, preLength).concat(preSeparator);

            //
            // Build query
            KapuaQuery<Credential> query = new CredentialQueryImpl();
            AttributePredicate<CredentialType> typePredicate = new AttributePredicate<>(CredentialPredicates.CREDENTIAL_TYPE, CredentialType.API_KEY);
            AttributePredicate<String> keyPredicate = new AttributePredicate<>(CredentialPredicates.CREDENTIAL_KEY, apiKeyPreValue, Operator.STARTS_WITH);

            AndPredicate andPredicate = new AndPredicate();
            andPredicate.and(typePredicate);
            andPredicate.and(keyPredicate);

            query.setPredicate(andPredicate);

            //
            // Query
            CredentialListResult credentialListResult = CredentialDAO.query(em, query);

            //
            // Parse the result
            if (credentialListResult != null && credentialListResult.getSize() == 1) {
                credential = credentialListResult.getItem(0);
            }

        } catch (Exception e) {
            throw KapuaExceptionUtils.convertPersistenceException(e);
        } finally {
            em.close();
        }

        //
        // Check Access
        if (credential != null) {
            KapuaLocator locator = KapuaLocator.getInstance();
            AuthorizationService authorizationService = locator.getService(AuthorizationService.class);
            PermissionFactory permissionFactory = locator.getFactory(PermissionFactory.class);
<<<<<<< HEAD
            authorizationService.checkPermission(permissionFactory.newPermission(credentialDomain, Actions.read, credential.getId()));
=======
            authorizationService.checkPermission(permissionFactory.newPermission(CredentialDomain.CREDENTIAL, Actions.read, credential.getId()));
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
        }

        return credential;
    }

<<<<<<< HEAD
    private long countExistingCredentials(CredentialType credentialType, KapuaId scopeId, KapuaId userId) throws KapuaException {
        KapuaLocator locator = KapuaLocator.getInstance();
        CredentialFactory credentialFactory = locator.getFactory(CredentialFactory.class);
        KapuaQuery<Credential> credentialQuery = credentialFactory.newQuery(scopeId);
        CredentialType ct = credentialType;
        KapuaPredicate credentialTypePredicate = new AttributePredicate<>(CredentialPredicates.CREDENTIAL_TYPE, ct);
        KapuaPredicate userIdPredicate = new AttributePredicate<>(CredentialPredicates.USER_ID, userId);
        KapuaPredicate andPredicate = new AndPredicate().and(credentialTypePredicate).and(userIdPredicate);
        credentialQuery.setPredicate(andPredicate);
        return count(credentialQuery);
    }
=======
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
}
