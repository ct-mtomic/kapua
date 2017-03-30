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
package org.eclipse.kapua.app.api.v1.resources;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.eclipse.kapua.locator.KapuaLocator;
import org.eclipse.kapua.service.authentication.ApiKeyCredentials;
import org.eclipse.kapua.service.authentication.AuthenticationService;
import org.eclipse.kapua.service.authentication.JwtCredentials;
import org.eclipse.kapua.service.authentication.RefreshTokenCredentials;
import org.eclipse.kapua.service.authentication.UsernamePasswordCredentials;
import org.eclipse.kapua.service.authentication.token.AccessToken;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Api("Authentication")
@Path("/authentication")
public class Authentication extends AbstractKapuaResource {

    private final KapuaLocator locator = KapuaLocator.getInstance();
    private final AuthenticationService authenticationService = locator.getService(AuthenticationService.class);

    /**
     * Authenticates an user with username and password and returns
     * the authentication token to be used in subsequent REST API calls.
     *
     * @param authenticationCredentials
     *            The username and password authentication credential of a user.
     * @return The authentication token
     */
    @ApiOperation(value = "Authenticate an user", notes = "Authenticates an user with username and password and returns " +
            "the authentication token to be used in subsequent REST API calls.", response = AccessToken.class)
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Path("user")
    public AccessToken loginUsernamePassword(
            @ApiParam(value = "The username and password authentication credential of a user.", required = true) UsernamePasswordCredentials authenticationCredentials) {
        AccessToken accessToken = null;
        try {
            accessToken = authenticationService.login(authenticationCredentials);
        } catch (Throwable t) {
            handleException(t);
        }
        return accessToken;
    }

    /**
     * Authenticates an user with a api key and returns
     * the authentication token to be used in subsequent REST API calls.
     *
     * @param authenticationCredentials
     *            The API KEY authentication credential of a user.
     * @return The authentication token
     */
    @ApiOperation(value = "Authenticate an user", notes = "Authenticates an user with API KEY and returns " +
            "the authentication token to be used in subsequent REST API calls.", response = AccessToken.class)
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Path("apikey")
    public AccessToken loginApiKey(
            @ApiParam(value = "The API KEY authentication credential of a user.", required = true) ApiKeyCredentials authenticationCredentials) {
        AccessToken accessToken = null;
        try {
            accessToken = authenticationService.login(authenticationCredentials);
        } catch (Throwable t) {
            handleException(t);
        }
        return accessToken;
    }

    /**
     * Authenticates an user with JWT and returns
     * the authentication token to be used in subsequent REST API calls.
     *
     * @param authenticationCredentials
     *            The JWT authentication credential of a user.
     * @return The authentication token
     */
    @ApiOperation(value = "Authenticate an user", notes = "Authenticates an user with a JWT and returns " +
            "the authentication token to be used in subsequent REST API calls.", response = AccessToken.class)
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Path("jwt")
    public AccessToken loginJwt(
            @ApiParam(value = "The JWT authentication credential of a user.", required = true) JwtCredentials authenticationCredentials) {
        AccessToken accessToken = null;
        try {
            accessToken = authenticationService.login(authenticationCredentials);
        } catch (Throwable t) {
            handleException(t);
        }
        return accessToken;
    }

    /**
     * Invalidates the AccessToken related to this session.
     * All subsequent calls will end up with a HTTP 401.
     * A new login is required after this call to make other requests.
     */
    @ApiOperation(value = "Logs out an user", notes = "Terminates the current session and invalidates "
            + "the access token")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Path("logout")
    public void logout() {
        try {
            authenticationService.logout();
        } catch (Throwable t) {
            handleException(t);
        }
    }
    
    /**
     * Refreshes an expired {@link AccessToken}. Both the current AccessToken and the Refresh token will be invalidated.
     * If also the Refresh token is expired, the user will have to restart with a new login.
     */
    @ApiOperation(value = "Refreshes an AccessToken", notes = "Both the current AccessToken and the Refresh token will be invalidated. "
            + "If also the Refresh token is expired, the user will have to restart with a new login.")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Path("refresh")
    public AccessToken refresh(@ApiParam(value = "The current AccessToken's tokenId and refreshToken", required = true) RefreshTokenCredentials refreshTokenCredentials) {
        AccessToken accessToken = null;
        try {
            accessToken = authenticationService.refreshAccessToken(refreshTokenCredentials.getTokenId(), refreshTokenCredentials.getRefreshToken());
        } catch (Throwable t) {
            handleException(t);
        }
        return accessToken;
    }
}
