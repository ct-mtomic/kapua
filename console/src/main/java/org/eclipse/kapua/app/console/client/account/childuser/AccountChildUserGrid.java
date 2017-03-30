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
package org.eclipse.kapua.app.console.client.account.childuser;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.kapua.app.console.client.messages.ConsoleUserMessages;
import org.eclipse.kapua.app.console.client.resources.icons.IconSet;
import org.eclipse.kapua.app.console.client.resources.icons.KapuaIcon;
import org.eclipse.kapua.app.console.client.ui.grid.EntityGrid;
import org.eclipse.kapua.app.console.client.ui.misc.color.Color;
import org.eclipse.kapua.app.console.client.ui.widget.EntityCRUDToolbar;
import org.eclipse.kapua.app.console.shared.model.GwtSession;
import org.eclipse.kapua.app.console.shared.model.account.GwtAccount;
import org.eclipse.kapua.app.console.shared.model.query.GwtQuery;
import org.eclipse.kapua.app.console.shared.model.user.GwtUser;
import org.eclipse.kapua.app.console.shared.model.user.GwtUserQuery;
import org.eclipse.kapua.app.console.shared.service.GwtUserService;
import org.eclipse.kapua.app.console.shared.service.GwtUserServiceAsync;

import com.extjs.gxt.ui.client.Style.HorizontalAlignment;
import com.extjs.gxt.ui.client.data.BasePagingLoadResult;
import com.extjs.gxt.ui.client.data.PagingLoadConfig;
import com.extjs.gxt.ui.client.data.PagingLoadResult;
import com.extjs.gxt.ui.client.data.RpcProxy;
import com.extjs.gxt.ui.client.store.ListStore;
import com.extjs.gxt.ui.client.widget.grid.ColumnConfig;
import com.extjs.gxt.ui.client.widget.grid.ColumnData;
import com.extjs.gxt.ui.client.widget.grid.Grid;
import com.extjs.gxt.ui.client.widget.grid.GridCellRenderer;
import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.rpc.AsyncCallback;

public class AccountChildUserGrid extends EntityGrid<GwtUser> {

    private static final GwtUserServiceAsync gwtUserService = GWT.create(GwtUserService.class);

    private final static ConsoleUserMessages MSGS = GWT.create(ConsoleUserMessages.class);

    private GwtUserQuery query;
    private AccountChildUserToolbar toolbar;

    public AccountChildUserGrid(GwtSession currentSession) {
        super(null, currentSession);
        query = new GwtUserQuery();
        query.setScopeId(null);
    }

    public void setSelectedAccount(GwtAccount account) {
        query = new GwtUserQuery();
        // Set correct scopeId for the grid
        if (account != null) {
            query.setScopeId(account.getId());
        } else {
            query.setScopeId(null);
        }
        // Set selected account for the toolbar
        ((AccountChildUserToolbar) getToolbar()).setSelectedAccount(account);
    }

    @Override
    protected RpcProxy<PagingLoadResult<GwtUser>> getDataProxy() {
        return new RpcProxy<PagingLoadResult<GwtUser>>() {

            @Override
            protected void load(Object loadConfig, AsyncCallback<PagingLoadResult<GwtUser>> callback) {
                if (query.getScopeId() == null) {
                    callback.onSuccess(new BasePagingLoadResult<GwtUser>(new ArrayList<GwtUser>()));
                } else {
                    gwtUserService.query((PagingLoadConfig) loadConfig,
                            query,
                            callback);
                }
            }
        };
    }

    @Override
    protected List<ColumnConfig> getColumns() {
        List<ColumnConfig> columnConfigs = new ArrayList<ColumnConfig>();

        ColumnConfig columnConfig = new ColumnConfig("status", MSGS.gridUserColumnHeaderStatus(), 50);
        GridCellRenderer<GwtUser> setStatusIcon = new GridCellRenderer<GwtUser>() {

            public String render(GwtUser gwtUser, String property, ColumnData config, int rowIndex, int colIndex, ListStore<GwtUser> deviceList, Grid<GwtUser> grid) {

                KapuaIcon icon;
                if (gwtUser.getStatusEnum() != null) {
                    switch (gwtUser.getStatusEnum()) {
                    case DISABLED:
                        icon = new KapuaIcon(IconSet.USER);
                        icon.setColor(Color.RED);
                        break;
                    case ENABLED:
                        icon = new KapuaIcon(IconSet.USER);
                        icon.setColor(Color.GREEN);
                        break;
                    default:
                        icon = new KapuaIcon(IconSet.USER);
                        icon.setColor(Color.GREY);
                        break;
                    }
                } else {
                    icon = new KapuaIcon(IconSet.USER);
                    icon.setColor(Color.GREY);
                }

                return icon.getInlineHTML();
            }
        };
        columnConfig.setRenderer(setStatusIcon);
        columnConfig.setAlignment(HorizontalAlignment.CENTER);
        columnConfig.setSortable(false);
        columnConfigs.add(columnConfig);

        columnConfig = new ColumnConfig("id", MSGS.gridUserColumnHeaderId(), 100);
        columnConfig.setHidden(true);
        columnConfigs.add(columnConfig);

        columnConfig = new ColumnConfig("username", MSGS.gridUserColumnHeaderUsername(), 400);
        columnConfigs.add(columnConfig);

        columnConfig = new ColumnConfig("displayName", MSGS.gridUserColumnHeaderDisplayName(), 400);
        columnConfigs.add(columnConfig);

        columnConfig = new ColumnConfig("phoneNumber", MSGS.gridUserColumnHeaderPhoneNumber(), 200);
        columnConfigs.add(columnConfig);

        columnConfig = new ColumnConfig("email", MSGS.gridUserColumnHeaderEmail(), 200);
        columnConfigs.add(columnConfig);

        columnConfig = new ColumnConfig("createdBy", MSGS.gridUserColumnHeaderCreatedBy(), 200);
        columnConfigs.add(columnConfig);

        columnConfig = new ColumnConfig("createdOn", MSGS.gridUserColumnHeaderCreatedOn(), 200);
        columnConfigs.add(columnConfig);

        return columnConfigs;
    }

    @Override
    protected GwtQuery getFilterQuery() {
        return query;
    }

    @Override
    protected void setFilterQuery(GwtQuery filterQuery) {
        this.query = (GwtUserQuery) filterQuery;
    }

    @Override
    protected void selectionChangedEvent(GwtUser selectedItem) {
        super.selectionChangedEvent(selectedItem);
        ((AccountChildUserToolbar) getToolbar()).updateToolBarButtons();
    }

    @Override
    protected EntityCRUDToolbar<GwtUser> getToolbar() {
        if (toolbar == null) {
            toolbar = new AccountChildUserToolbar(currentSession);
        }
        return toolbar;
    }

}
