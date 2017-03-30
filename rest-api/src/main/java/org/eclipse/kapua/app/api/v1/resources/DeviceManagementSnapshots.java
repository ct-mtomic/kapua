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
 *******************************************************************************/
package org.eclipse.kapua.app.api.v1.resources;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.eclipse.kapua.app.api.v1.resources.model.EntityId;
import org.eclipse.kapua.app.api.v1.resources.model.ScopeId;
import org.eclipse.kapua.locator.KapuaLocator;
import org.eclipse.kapua.service.device.management.snapshot.DeviceSnapshotManagementService;
import org.eclipse.kapua.service.device.management.snapshot.DeviceSnapshots;
import org.eclipse.kapua.service.device.registry.Device;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Api("Devices")
@Path("{scopeId}/devices/{deviceId}/snapshots")
public class DeviceManagementSnapshots extends AbstractKapuaResource {

    private final KapuaLocator locator = KapuaLocator.getInstance();
    private final DeviceSnapshotManagementService snapshotService = locator.getService(DeviceSnapshotManagementService.class);

    /**
     * Returns the list of all the Snapshots available on the device.
     *
     * @param scopeId
     *            The {@link ScopeId} of the {@link Device}.
     * @param deviceId
     *            The id of the device
     * @param timeout
     *            The timeout of the operation
     * @return The list of Snapshot Ids.
     */
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @ApiOperation(value = "Gets a list of snapshots", notes = "Returns the list of all the Snapshots available on the device.", response = DeviceSnapshots.class)
    public DeviceSnapshots get(
            @ApiParam(value = "The ScopeId of the device", required = true, defaultValue = DEFAULT_SCOPE_ID) @PathParam("scopeId") ScopeId scopeId,
            @ApiParam(value = "The id of the device", required = true) @PathParam("deviceId") EntityId deviceId,
            @ApiParam(value = "The timeout of the operation", required = false) @QueryParam("timeout") Long timeout) {
        DeviceSnapshots deviceSnapshots = null;
        try {
            deviceSnapshots = snapshotService.get(scopeId, deviceId, timeout);
        } catch (Throwable t) {
            handleException(t);
        }
        return returnNotNullEntity(deviceSnapshots);
    }

    /**
     * Updates the configuration of a device rolling back a given snapshot ID.
     *
     * @param scopeId
     *            The {@link ScopeId} of the {@link Device}.
     * @param deviceId
     *            The {@link Device} ID.
     * @param snapshotId
     *            the ID of the snapshot to rollback to.
     * @param timeout
     *            The timeout of the operation
     * @return HTTP 200 if operation has completed successfully.
     */
    @POST
    @Path("{snapshotId}/_rollback")
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @ApiOperation(value = "Gets a list of snapshots", notes = "Updates the configuration of a device rolling back a given snapshot ID.")
    public Response rollback(
            @ApiParam(value = "The ScopeId of the device", required = true, defaultValue = DEFAULT_SCOPE_ID) @PathParam("scopeId") ScopeId scopeId,
            @ApiParam(value = "The id of the device", required = true) @PathParam("deviceId") EntityId deviceId,
            @ApiParam(value = "the ID of the snapshot to rollback to", required = true) @PathParam("snapshotId") String snapshotId,
            @ApiParam(value = "The timeout of the operation") @QueryParam("timeout") Long timeout) {
        try {
            snapshotService.rollback(scopeId, deviceId, snapshotId, timeout);
        } catch (Throwable t) {
            handleException(t);
        }
        return Response.ok().build();
    }
}
