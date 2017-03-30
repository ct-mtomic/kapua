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
package org.eclipse.kapua.app.console.client.account;

import com.extjs.gxt.ui.client.Style.HorizontalAlignment;
import com.extjs.gxt.ui.client.data.PagingLoadConfig;
import com.extjs.gxt.ui.client.data.PagingLoadResult;
import com.extjs.gxt.ui.client.data.RpcProxy;
import com.extjs.gxt.ui.client.widget.grid.ColumnConfig;
import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.rpc.AsyncCallback;
import org.eclipse.kapua.app.console.client.account.toolbar.AccountGridToolbar;
import org.eclipse.kapua.app.console.client.messages.ConsoleAccountMessages;
import org.eclipse.kapua.app.console.client.ui.grid.EntityGrid;
import org.eclipse.kapua.app.console.client.ui.view.EntityView;
import org.eclipse.kapua.app.console.client.ui.widget.EntityCRUDToolbar;
import org.eclipse.kapua.app.console.shared.model.GwtSession;
import org.eclipse.kapua.app.console.shared.model.account.GwtAccount;
import org.eclipse.kapua.app.console.shared.model.account.GwtAccountQuery;
import org.eclipse.kapua.app.console.shared.model.query.GwtQuery;
import org.eclipse.kapua.app.console.shared.service.GwtAccountService;
import org.eclipse.kapua.app.console.shared.service.GwtAccountServiceAsync;

import java.util.ArrayList;
import java.util.List;

public class AccountGrid extends EntityGrid<GwtAccount> {

    private static final ConsoleAccountMessages MSGS = GWT.create(ConsoleAccountMessages.class);

    private final GwtAccountServiceAsync gwtAccountService = GWT.create(GwtAccountService.class);

    private GwtAccountQuery filterQuery;
    private AccountGridToolbar toolbar;

    AccountGrid(EntityView<GwtAccount> entityView, GwtSession currentSession) {
        super(entityView, currentSession);
        filterQuery = new GwtAccountQuery();
        filterQuery.setScopeId(currentSession.getSelectedAccount().getId());
        
    }
    
    @Override
    public void refresh(GwtQuery query) {
        super.refresh(query);
        GwtAccount selectedAccount = getSelectionModel().getSelectedItem();
        updateToolBarButtons(selectedAccount);
    }
    
    @Override
    protected EntityCRUDToolbar<GwtAccount> getToolbar() {
        if(toolbar == null){
            toolbar = new AccountGridToolbar(currentSession);
        }
        return toolbar;
    }
    
    @Override
    protected RpcProxy getDataProxy() {
        return new RpcProxy<PagingLoadResult<GwtAccount>>() {

            @Override
            protected void load(Object loadConfig, AsyncCallback<PagingLoadResult<GwtAccount>> callback) {
                gwtAccountService.query((PagingLoadConfig) loadConfig, filterQuery, callback);
            }
        };
    }
    
    @Override
    protected void selectionChangedEvent(GwtAccount selectedItem) {
        super.selectionChangedEvent(selectedItem);
        updateToolBarButtons(selectedItem);
    }
    
    @Override
    protected List<ColumnConfig> getColumns() {
        ColumnConfig column = null;
        List<ColumnConfig> configs = new ArrayList<ColumnConfig>();

        column = new ColumnConfig("name", 120);
        column.setHeader(MSGS.accountTableName());
        column.setWidth(150);
        configs.add(column);

        column = new ColumnConfig("orgName", 120);
        column.setHeader(MSGS.accountTableOrgName());
        column.setWidth(150);
        configs.add(column);

        column = new ColumnConfig("orgEmail", 120);
        column.setHeader(MSGS.accountTableOrgEmail());
        column.setWidth(150);
        configs.add(column);

        column = new ColumnConfig("modifiedOnFormatted", MSGS.accountTableModifiedOn(), 130);
        column.setAlignment(HorizontalAlignment.CENTER);
        configs.add(column);
        return configs;
    }

    @Override
    protected GwtQuery getFilterQuery() {
        return filterQuery;
    }

    @Override
    protected void setFilterQuery(GwtQuery filterQuery) {
        this.filterQuery = (GwtAccountQuery) filterQuery;
    }

    private void updateToolBarButtons(GwtAccount selectedAccount){
        if(selectedAccount == null){
            toolbar.getEditEntityButton().setEnabled(false);
            toolbar.getDeleteEntityButton().setEnabled(false);
        }else{
            toolbar.getEditEntityButton().setEnabled(true);
            toolbar.getDeleteEntityButton().setEnabled(true);
        }          
    }
}
