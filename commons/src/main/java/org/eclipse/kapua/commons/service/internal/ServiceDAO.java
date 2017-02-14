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
package org.eclipse.kapua.commons.service.internal;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityExistsException;
import javax.persistence.PersistenceException;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.ParameterExpression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.SingularAttribute;

import org.apache.commons.lang.ArrayUtils;
import org.eclipse.kapua.KapuaEntityExistsException;
import org.eclipse.kapua.KapuaEntityNotFoundException;
import org.eclipse.kapua.KapuaErrorCodes;
import org.eclipse.kapua.KapuaException;
import org.eclipse.kapua.commons.jpa.EntityManager;
import org.eclipse.kapua.commons.model.AbstractKapuaUpdatableEntity;
import org.eclipse.kapua.commons.model.id.KapuaEid;
import org.eclipse.kapua.commons.model.query.FieldSortCriteria;
import org.eclipse.kapua.commons.model.query.FieldSortCriteria.SortOrder;
import org.eclipse.kapua.commons.model.query.predicate.AndPredicate;
import org.eclipse.kapua.commons.model.query.predicate.AttributePredicate;
<<<<<<< HEAD
import org.eclipse.kapua.commons.security.KapuaSecurityUtils;
import org.eclipse.kapua.commons.security.KapuaSession;
import org.eclipse.kapua.locator.KapuaLocator;
=======
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
import org.eclipse.kapua.model.KapuaEntity;
import org.eclipse.kapua.model.KapuaEntityPredicates;
import org.eclipse.kapua.model.KapuaUpdatableEntity;
import org.eclipse.kapua.model.id.KapuaId;
import org.eclipse.kapua.model.query.KapuaListResult;
import org.eclipse.kapua.model.query.KapuaQuery;
import org.eclipse.kapua.model.query.predicate.KapuaAndPredicate;
import org.eclipse.kapua.model.query.predicate.KapuaAttributePredicate;
import org.eclipse.kapua.model.query.predicate.KapuaOrPredicate;
import org.eclipse.kapua.model.query.predicate.KapuaPredicate;
import org.eclipse.kapua.service.authorization.access.AccessInfo;
import org.eclipse.kapua.service.authorization.access.AccessInfoFactory;
import org.eclipse.kapua.service.authorization.access.AccessInfoListResult;
import org.eclipse.kapua.service.authorization.access.AccessInfoPredicates;
import org.eclipse.kapua.service.authorization.access.AccessInfoQuery;
import org.eclipse.kapua.service.authorization.access.AccessInfoService;
import org.eclipse.kapua.service.authorization.access.AccessPermission;
import org.eclipse.kapua.service.authorization.access.AccessPermissionListResult;
import org.eclipse.kapua.service.authorization.access.AccessPermissionService;
import org.eclipse.kapua.service.authorization.access.AccessRole;
import org.eclipse.kapua.service.authorization.access.AccessRoleListResult;
import org.eclipse.kapua.service.authorization.access.AccessRoleService;
import org.eclipse.kapua.service.authorization.domain.Domain;
import org.eclipse.kapua.service.authorization.group.Group;
import org.eclipse.kapua.service.authorization.group.Groupable;
import org.eclipse.kapua.service.authorization.permission.Actions;
import org.eclipse.kapua.service.authorization.permission.Permission;
import org.eclipse.kapua.service.authorization.role.Role;
import org.eclipse.kapua.service.authorization.role.RolePermission;
import org.eclipse.kapua.service.authorization.role.RolePermissionListResult;
import org.eclipse.kapua.service.authorization.role.RolePermissionService;
import org.eclipse.kapua.service.authorization.role.RoleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * {@link ServiceDAO} utility methods.
 * 
 * @since 1.0.0
 */
public class ServiceDAO {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceDAO.class);

    private static final AccessInfoService accessInfoService;
    private static final AccessInfoFactory accessInfoFactory;

    private static final AccessPermissionService accessPermissionService;
    private static final AccessRoleService accessRoleService;

    private static final RoleService roleService;
    private static final RolePermissionService rolePermissionService;

    private static final String SQL_ERROR_CODE_CONSTRAINT_VIOLATION = "23505";

    private static final String LIKE = "%";

    static {
        KapuaLocator locator = null;
        try {
            locator = KapuaLocator.getInstance();
        } catch (ExceptionInInitializerError kre) {
            LOG.warn("KapuaLocator not available! Access Group featue may be not suppoted!", kre);
        }

        if (locator != null) {
            accessInfoService = KapuaLocator.getInstance().getService(AccessInfoService.class);
            accessInfoFactory = KapuaLocator.getInstance().getFactory(AccessInfoFactory.class);

            accessPermissionService = KapuaLocator.getInstance().getService(AccessPermissionService.class);
            accessRoleService = KapuaLocator.getInstance().getService(AccessRoleService.class);

            roleService = KapuaLocator.getInstance().getService(RoleService.class);
            rolePermissionService = KapuaLocator.getInstance().getService(RolePermissionService.class);
        } else {
            accessInfoService = null;
            accessInfoFactory = null;

            accessPermissionService = null;
            accessRoleService = null;

            roleService = null;
            rolePermissionService = null;
        }

    }

    protected ServiceDAO() {
    }

    /**
     * Create entity utility method.<br>
     * This method checks for the constraint violation and, in this case, it throws a specific exception ({@link KapuaEntityExistsException}).
     * 
     * @param em
     * @param entity
     *            to be created
     * @return
     */
    public static <E extends KapuaEntity> E create(EntityManager em, E entity) {
        //
        // Creating entity
        try {
            em.persist(entity);
            em.flush();
            em.refresh(entity);
        } catch (EntityExistsException e) {
            throw new KapuaEntityExistsException(e, entity.getId());
        } catch (PersistenceException e) {
            if (isInsertConstraintViolation(e)) {
                KapuaEntity entityFound = em.find(entity.getClass(), entity.getId());
                if (entityFound == null) {
                    throw e;
                }
                throw new KapuaEntityExistsException(e, entity.getId());
            } else {
                throw e;
            }
        }

        return entity;
    }

    private static boolean isInsertConstraintViolation(PersistenceException e) {
        // extract the sql exception
        Throwable cause = e.getCause();
        while (cause != null && !(cause instanceof SQLException)) {
            cause = cause.getCause();
        }

        if (cause == null) {
            return false;
        }

        SQLException innerExc = (SQLException) cause;
        return SQL_ERROR_CODE_CONSTRAINT_VIOLATION.equals(innerExc.getSQLState());
    }

    /**
     * Update entity utility method
     * 
     * @param em
     * @param clazz
     * @param entity
     *            entity to be updated
     * @return
     * @throws KapuaEntityNotFoundException
     *             If entity is not found.
     */
    public static <E extends KapuaUpdatableEntity> E update(EntityManager em, Class<E> clazz, E entity) throws KapuaEntityNotFoundException {
        //
        // Checking existence
        E entityToUpdate = em.find(clazz, entity.getId());

        //
        // Updating if not null
        if (entityToUpdate != null) {
            AbstractKapuaUpdatableEntity updatableEntity = (AbstractKapuaUpdatableEntity) entity;
            updatableEntity.setCreatedOn(entityToUpdate.getCreatedOn());
            updatableEntity.setCreatedBy(entityToUpdate.getCreatedBy());

            em.merge(entity);
            em.flush();
            em.refresh(entityToUpdate);
        } else {
            throw new KapuaEntityNotFoundException(clazz.getSimpleName(), entity.getId());
        }

        return entityToUpdate;
    }

    /**
     * Delete entity utility method
     * 
     * @param em
     * @param clazz
     * @param entityId
     *            entity id of the entity to be deleted
     * 
     * @throws KapuaEntityNotFoundException
     *             If entity is not found.
     */
    public static <E extends KapuaEntity> void delete(EntityManager em, Class<E> clazz, KapuaId entityId)
            throws KapuaEntityNotFoundException {
        //
        // Checking existence
        E entityToDelete = em.find(clazz, entityId);

        //
        // Deleting if not null
        if (entityToDelete != null) {
            em.remove(entityToDelete);
            em.flush();
        } else {
            throw new KapuaEntityNotFoundException(clazz.getSimpleName(), entityId);
        }
    }

    /**
     * Find entity by name utility method
     * 
     * @param em
     * @param clazz
     * @param name
     *            name of the field from which to search
     * @param value
     *            value of the field from which to search
     * @return
     */
    public static <E extends KapuaEntity> E findByField(EntityManager em, Class<E> clazz, String name, String value) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<E> criteriaSelectQuery = cb.createQuery(clazz);

        //
        // FROM
        Root<E> entityRoot = criteriaSelectQuery.from(clazz);

        //
        // SELECT
        criteriaSelectQuery.select(entityRoot);

        // name
        ParameterExpression<String> pName = cb.parameter(String.class, name);
        criteriaSelectQuery.where(cb.equal(entityRoot.get(name), pName));

        //
        // QUERY!
        TypedQuery<E> query = em.createQuery(criteriaSelectQuery);
        query.setParameter(pName.getName(), value);

        List<E> result = query.getResultList();
        E user = null;
        if (result.size() == 1) {
            user = result.get(0);
        }

        return user;
    }

    /**
     * Query entity utility method
     * 
     * @param em
     * @param interfaceClass
     *            result query interface class
     * @param implementingClass
     *            result query implementation class
     * @param resultContainer
     * @param kapuaQuery
     * @return
     * @throws KapuaException
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public static <I extends KapuaEntity, E extends I, L extends KapuaListResult<I>> L query(EntityManager em,
            Class<I> interfaceClass,
            Class<E> implementingClass,
            L resultContainer,
            KapuaQuery<I> kapuaQuery)
            throws KapuaException {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<E> criteriaSelectQuery = cb.createQuery(implementingClass);

        //
        // FROM
        Root<E> entityRoot = criteriaSelectQuery.from(implementingClass);
        EntityType<E> entityType = entityRoot.getModel();

        //
        // SELECT
        criteriaSelectQuery.select(entityRoot);

        //
        // WHERE
        KapuaPredicate kapuaPredicates = kapuaQuery.getPredicate();
        if (kapuaQuery.getScopeId() != null) {
<<<<<<< HEAD

            AndPredicate scopedAndPredicate = new AndPredicate();

            AttributePredicate<KapuaId> scopeId = new AttributePredicate<>(KapuaEntityPredicates.SCOPE_ID, kapuaQuery.getScopeId());
            scopedAndPredicate.and(scopeId);

            if (kapuaQuery.getPredicate() != null) {
                scopedAndPredicate.and(kapuaQuery.getPredicate());
            }

            kapuaPredicates = scopedAndPredicate;
        }

=======

            AndPredicate scopedAndPredicate = new AndPredicate();

            AttributePredicate<KapuaId> scopeId = new AttributePredicate<>("scopeId", kapuaQuery.getScopeId());
            scopedAndPredicate.and(scopeId);

            if (kapuaQuery.getPredicate() != null) {
                scopedAndPredicate.and(kapuaQuery.getPredicate());
            }

            kapuaPredicates = scopedAndPredicate;
        }

>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
        Map<ParameterExpression, Object> binds = new HashMap<>();
        Expression<Boolean> expr = handleKapuaQueryPredicates(kapuaPredicates,
                binds,
                cb,
                entityRoot,
                entityRoot.getModel());

<<<<<<< HEAD
        if (expr != null) {
            criteriaSelectQuery.where(expr);
        }
=======
        criteriaSelectQuery.where(expr);

        // ParameterExpression<Long> scopeIdParam = cb.parameter(Long.class);
        // Expression<Boolean> scopeIdExpr = cb.equal(entityRoot.get("scopeId"), scopeIdParam);
        //
        // Map<ParameterExpression, Object> binds = new HashMap<>();
        // binds.put(scopeIdParam, kapuaQuery.getScopeId());
        // Expression<Boolean> expr = handleKapuaQueryPredicates(kapuaQuery.getPredicate(),
        // binds,
        // cb,
        // entityRoot,
        // entityRoot.getModel());
        //
        // if (expr == null) {
        // criteriaSelectQuery.where(scopeIdExpr);
        // } else {
        // criteriaSelectQuery.where(cb.and(scopeIdExpr, expr));
        // }
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d

        //
        // ORDER BY
        Order order;
        if (kapuaQuery.getSortCriteria() != null) {
            FieldSortCriteria sortCriteria = (FieldSortCriteria) kapuaQuery.getSortCriteria();

            if (SortOrder.ASCENDING.equals(sortCriteria.getSortOrder())) {
                order = cb.asc(entityRoot.get(entityType.getSingularAttribute(sortCriteria.getAttributeName())));
            } else {
                order = cb.desc(entityRoot.get(entityType.getSingularAttribute(sortCriteria.getAttributeName())));
            }

        } else {
            order = cb.asc(entityRoot.get(entityType.getSingularAttribute(KapuaEntityPredicates.ENTITY_ID)));
        }
        criteriaSelectQuery.orderBy(order);

        //
        // QUERY!
        TypedQuery<E> query = em.createQuery(criteriaSelectQuery);

        // Populate query parameters
        for (ParameterExpression pe : binds.keySet()) {
            query.setParameter(pe, binds.get(pe));
        }

        // Set offset
        if (kapuaQuery.getOffset() != null) {
            query.setFirstResult(kapuaQuery.getOffset().intValue());
        }

        // Set limit
        if (kapuaQuery.getLimit() != null) {
            query.setMaxResults(kapuaQuery.getLimit().intValue() + 1);
        }

        // Finally quering!
        List<E> result = query.getResultList();

        // Check limit exceeded
        if (kapuaQuery.getLimit() != null &&
                result.size() > kapuaQuery.getLimit().intValue()) {
            result.remove(kapuaQuery.getLimit().intValue());
            resultContainer.setLimitExceeded(true);
        }

        // Set results
        resultContainer.addItems(result);
        return resultContainer;
    }

    /**
     * Count entity utility method
     * 
     * @param em
     * @param interfaceClass
     *            result query interface class
     * @param implementingClass
     *            result query implementation class
     * @param kapuaQuery
     * @return
     * @throws KapuaException
     */
    // @SuppressWarnings({ "rawtypes", "unchecked" })
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public static <I extends KapuaEntity, E extends I> long count(EntityManager em,
            Class<I> interfaceClass,
            Class<E> implementingClass,
            KapuaQuery<I> kapuaQuery)
            throws KapuaException {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> criteriaSelectQuery = cb.createQuery(Long.class);

        //
        // FROM
        Root<E> entityRoot = criteriaSelectQuery.from(implementingClass);

        //
        // SELECT
        criteriaSelectQuery.select(cb.count(entityRoot));

        //
        // WHERE
        KapuaPredicate kapuaPredicates = kapuaQuery.getPredicate();
        if (kapuaQuery.getScopeId() != null) {

            AndPredicate scopedAndPredicate = new AndPredicate();

            AttributePredicate<KapuaId> scopeId = new AttributePredicate<>(KapuaEntityPredicates.SCOPE_ID, kapuaQuery.getScopeId());
            scopedAndPredicate.and(scopeId);

            if (kapuaQuery.getPredicate() != null) {
                scopedAndPredicate.and(kapuaQuery.getPredicate());
            }

            kapuaPredicates = scopedAndPredicate;
        }

        Map<ParameterExpression, Object> binds = new HashMap<>();
        Expression<Boolean> expr = handleKapuaQueryPredicates(kapuaPredicates,
                binds,
                cb,
                entityRoot,
                entityRoot.getModel());

        if (expr != null) {
            criteriaSelectQuery.where(expr);
        }

        //
        // COUNT!
        TypedQuery<Long> query = em.createQuery(criteriaSelectQuery);

        // Populate query parameters
        for (ParameterExpression pe : binds.keySet()) {
            query.setParameter(pe, binds.get(pe));
        }

        return query.getSingleResult();
    }

    /**
     * Criteria for query entity utility method
     * 
     * @param qp
     * @param binds
     * @param cb
     * @param userPermissionRoot
     * @param entityType
     * @return
     * @throws KapuaException
     */
    @SuppressWarnings("rawtypes")
    protected static <E> Expression<Boolean> handleKapuaQueryPredicates(KapuaPredicate qp,
            Map<ParameterExpression, Object> binds,
            CriteriaBuilder cb,
            Root<E> userPermissionRoot,
            EntityType<E> entityType)
            throws KapuaException {
        Expression<Boolean> expr = null;
        if (qp instanceof KapuaAttributePredicate) {
            KapuaAttributePredicate attrPred = (KapuaAttributePredicate) qp;
            expr = handleAttributePredicate(attrPred, binds, cb, userPermissionRoot, entityType);
        } else if (qp instanceof KapuaAndPredicate) {
            KapuaAndPredicate andPredicate = (KapuaAndPredicate) qp;
            expr = handleAndPredicate(andPredicate, binds, cb, userPermissionRoot, entityType);
        } else if (qp instanceof KapuaOrPredicate) {
            KapuaOrPredicate andPredicate = (KapuaOrPredicate) qp;
            expr = handleOrPredicate(andPredicate, binds, cb, userPermissionRoot, entityType);
        }
        return expr;
    }

    @SuppressWarnings("rawtypes")
    private static <E> Expression<Boolean> handleAndPredicate(KapuaAndPredicate andPredicate,
            Map<ParameterExpression, Object> binds,
            CriteriaBuilder cb,
            Root<E> entityRoot,
            EntityType<E> entityType)
            throws KapuaException {
        List<Expression<Boolean>> exprs = new ArrayList<>();
        for (KapuaPredicate pred : andPredicate.getPredicates()) {
            Expression<Boolean> expr = handleKapuaQueryPredicates(pred, binds, cb, entityRoot, entityType);
            exprs.add(expr);
        }
        return cb.and(exprs.toArray(new Predicate[] {}));
    }

    @SuppressWarnings("rawtypes")
    private static <E> Expression<Boolean> handleOrPredicate(KapuaOrPredicate andPredicate,
            Map<ParameterExpression, Object> binds,
            CriteriaBuilder cb,
            Root<E> entityRoot,
            EntityType<E> entityType)
            throws KapuaException {
        List<Expression<Boolean>> exprs = new ArrayList<>();
        for (KapuaPredicate pred : andPredicate.getPredicates()) {
            Expression<Boolean> expr = handleKapuaQueryPredicates(pred, binds, cb, entityRoot, entityType);
            exprs.add(expr);
        }
        return cb.or(exprs.toArray(new Predicate[] {}));
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    private static <E> Expression<Boolean> handleAttributePredicate(KapuaAttributePredicate attrPred,
            Map<ParameterExpression, Object> binds,
            CriteriaBuilder cb,
            Root<E> entityRoot,
            EntityType<E> entityType)
            throws KapuaException {
        Expression<Boolean> expr;
        String attrName = attrPred.getAttributeName();
        Object attrValue = attrPred.getAttributeValue();
        SingularAttribute attribute = entityType.getSingularAttribute(attrName);
        if (attrValue instanceof Object[] && ((Object[]) attrValue).length == 1) {
            Object[] attrValues = (Object[]) attrValue;
            attrValue = attrValues[0];
        }
        if (attrValue instanceof Object[]) {
            Object[] attrValues = (Object[]) attrValue;
            Expression<?> orPredicate = entityRoot.get(attribute);

            Predicate[] orPredicates = new Predicate[attrValues.length];
            for (int i = 0; i < attrValues.length; i++) {
                orPredicates[i] = cb.equal(orPredicate, attrValues[i]);
            }

            expr = cb.and(cb.or(orPredicates));
        } else {
            switch (attrPred.getOperator()) {
            case LIKE:
                ParameterExpression<String> pl = cb.parameter(String.class);
                binds.put(pl, LIKE + attrValue + LIKE);
                expr = cb.like((Expression<String>) entityRoot.get(attribute), pl);
                break;

            case STARTS_WITH:
                ParameterExpression<String> psw = cb.parameter(String.class);
                binds.put(psw, attrValue + LIKE);
                expr = cb.like((Expression<String>) entityRoot.get(attribute), psw);
                break;

            case IS_NULL:
                expr = cb.isNull(entityRoot.get(attribute));
                break;

            case NOT_NULL:
                expr = cb.isNotNull(entityRoot.get(attribute));
                break;

            case NOT_EQUAL:
                expr = cb.notEqual(entityRoot.get(attribute), attrValue);
                break;

            case GREATER_THAN:
                if (attrValue instanceof Comparable && ArrayUtils.contains(attribute.getJavaType().getInterfaces(), Comparable.class)) {
                    Expression<? extends Comparable> comparableExpression = entityRoot.get(attribute);
                    Comparable comparablAttrValue = (Comparable) attrValue;
                    expr = cb.greaterThan(comparableExpression, comparablAttrValue);
                } else {
                    throw new KapuaException(KapuaErrorCodes.ILLEGAL_ARGUMENT, "Trying to compare a non-comparable value");
                }
                break;

            case GREATER_THAN_OR_EQUAL:
                if (attrValue instanceof Comparable && ArrayUtils.contains(attribute.getJavaType().getInterfaces(), Comparable.class)) {
                    Expression<? extends Comparable> comparableExpression = entityRoot.get(attribute);
                    Comparable comparablAttrValue = (Comparable) attrValue;
                    expr = cb.greaterThanOrEqualTo(comparableExpression, comparablAttrValue);
                } else {
                    throw new KapuaException(KapuaErrorCodes.ILLEGAL_ARGUMENT, "Trying to compare a non-comparable value");
                }
                break;

            case LESS_THAN:
                if (attrValue instanceof Comparable && ArrayUtils.contains(attribute.getJavaType().getInterfaces(), Comparable.class)) {
                    Expression<? extends Comparable> comparableExpression = entityRoot.get(attribute);
                    Comparable comparablAttrValue = (Comparable) attrValue;
                    expr = cb.lessThan(comparableExpression, comparablAttrValue);
                } else {
                    throw new KapuaException(KapuaErrorCodes.ILLEGAL_ARGUMENT, "Trying to compare a non-comparable value");
                }
                break;
            case LESS_THAN_OR_EQUAL:
                if (attrValue instanceof Comparable && ArrayUtils.contains(attribute.getJavaType().getInterfaces(), Comparable.class)) {
                    Expression<? extends Comparable> comparableExpression = entityRoot.get(attribute);
                    Comparable comparablAttrValue = (Comparable) attrValue;
                    expr = cb.lessThanOrEqualTo(comparableExpression, comparablAttrValue);
                } else {
                    throw new KapuaException(KapuaErrorCodes.ILLEGAL_ARGUMENT, "Trying to compare a non-comparable value");
                }
                break;

<<<<<<< HEAD
=======
            default:
>>>>>>> 479bf3404ccb8240fd9170f686a736744f92534d
            case EQUAL:
            default:
                expr = cb.equal(entityRoot.get(attribute), attrValue);
                break;
            }
        }
        return expr;
    }

    /**
     * Handles the {@link Groupable} property of the {@link KapuaEntity}.
     * 
     * @param query
     *            The {@link DeviceQuery} to manage.
     * @param domain
     *            The {@link Domain} inside which the {@link KapuaQuery} param targets.
     * @param groupPredicateName
     *            The name of the {@link Group} id field.
     * @since 1.0.0
     */
    @SuppressWarnings("rawtypes")
    protected static void handleKapuaQueryGroupPredicate(KapuaQuery query, Domain domain, String groupPredicateName) {

        if (accessInfoFactory != null) {
            KapuaSession kapuaSession = KapuaSecurityUtils.getSession();
            if (kapuaSession != null) {
                try {
                    KapuaId userId = kapuaSession.getUserId();

                    AccessInfoQuery accessInfoQuery = accessInfoFactory.newQuery(kapuaSession.getScopeId());
                    accessInfoQuery.setPredicate(new AttributePredicate<>(AccessInfoPredicates.USER_ID, userId));
                    AccessInfoListResult accessInfos = KapuaSecurityUtils.doPriviledge(() -> accessInfoService.query(accessInfoQuery));

                    List<Permission> groupPermissions = new ArrayList<>();
                    if (!accessInfos.isEmpty()) {

                        AccessInfo accessInfo = accessInfos.getFirstItem();
                        AccessPermissionListResult accessPermissions = KapuaSecurityUtils.doPriviledge(() -> accessPermissionService.findByAccessInfoId(accessInfo.getScopeId(), accessInfo.getId()));

                        for (AccessPermission ap : accessPermissions.getItems()) {
                            Permission p = ap.getPermission();
                            if (domain.getName().equals(p.getDomain())) {
                                if (p.getAction() == null || Actions.read.equals(p.getAction())) {
                                    if (p.getGroupId() == null) {
                                        groupPermissions.clear();
                                        break;
                                    } else {
                                        groupPermissions.add(p);
                                    }
                                }
                            }
                        }

                        AccessRoleListResult accessRoles = KapuaSecurityUtils.doPriviledge(() -> accessRoleService.findByAccessInfoId(accessInfo.getScopeId(), accessInfo.getId()));

                        for (AccessRole ar : accessRoles.getItems()) {
                            KapuaId roleId = ar.getRoleId();

                            Role role = KapuaSecurityUtils.doPriviledge(() -> roleService.find(ar.getScopeId(), roleId));

                            RolePermissionListResult rolePermissions = KapuaSecurityUtils.doPriviledge(() -> rolePermissionService.findByRoleId(role.getScopeId(), role.getId()));

                            for (RolePermission rp : rolePermissions.getItems()) {

                                Permission p = rp.getPermission();
                                if (domain.getName().equals(p.getDomain())) {
                                    if (p.getAction() == null || Actions.read.equals(p.getAction())) {
                                        if (p.getGroupId() == null) {
                                            groupPermissions.clear();
                                            break;
                                        } else {
                                            groupPermissions.add(p);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    AndPredicate andPredicate = new AndPredicate();
                    if (!groupPermissions.isEmpty()) {
                        int i = 0;
                        KapuaId[] groupsIds = new KapuaEid[groupPermissions.size()];
                        for (Permission p : groupPermissions) {
                            groupsIds[i++] = p.getGroupId();
                        }
                        andPredicate.and(new AttributePredicate<>(groupPredicateName, groupsIds));
                    }

                    if (query.getPredicate() != null) {
                        andPredicate.and(query.getPredicate());
                    }

                    query.setPredicate(andPredicate);
                } catch (Exception e) {
                    KapuaException.internalError(e, "Error while grouping!");
                }
            }
        } else {
            LOG.warn("Access Group is disabled");
        }
    }
}
