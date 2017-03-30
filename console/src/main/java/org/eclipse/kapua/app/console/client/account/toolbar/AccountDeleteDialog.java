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
package org.eclipse.kapua.app.console.client.account.toolbar;

import org.eclipse.kapua.app.console.client.messages.ConsoleAccountMessages;
import org.eclipse.kapua.app.console.client.ui.dialog.entity.EntityDeleteDialog;
import org.eclipse.kapua.app.console.client.util.ConsoleInfo;
import org.eclipse.kapua.app.console.client.util.DialogUtils;
import org.eclipse.kapua.app.console.client.util.FailureHandler;
import org.eclipse.kapua.app.console.shared.model.account.GwtAccount;
import org.eclipse.kapua.app.console.shared.service.GwtAccountService;
import org.eclipse.kapua.app.console.shared.service.GwtAccountServiceAsync;

import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.rpc.AsyncCallback;


public class AccountDeleteDialog extends EntityDeleteDialog {

    private static final ConsoleAccountMessages MSGS = GWT.create(ConsoleAccountMessages.class);
    private static final GwtAccountServiceAsync gwtAccountService = GWT.create(GwtAccountService.class);
    
    GwtAccount selectedAccount;
    
    public AccountDeleteDialog(GwtAccount selectedAccount){
        super();
        this.selectedAccount = selectedAccount;
        DialogUtils.resizeDialog(this, 300, 135);
    }
    
    @Override
    public void submit() {
        gwtAccountService.delete(xsrfToken, selectedAccount, new AsyncCallback<Void>() {
            
            @Override
            public void onSuccess(Void v) {
                m_exitStatus = true;
                ConsoleInfo.display(MSGS.info(),
                        MSGS.accountDeletedConfirmation(selectedAccount.getUnescapedName()));
                hide();
            }
            
            @Override
            public void onFailure(Throwable t) {
                m_exitStatus = false;
                FailureHandler.handle(t);
                hide();
            }
        });
    }

    @Override
    public String getHeaderMessage() {
        return MSGS.accountDeleteDialogHeader();
    }

    @Override
    public String getInfoMessage() {
        return MSGS.accountDeleteInfoMessage(selectedAccount.getUnescapedName());
    }

}
