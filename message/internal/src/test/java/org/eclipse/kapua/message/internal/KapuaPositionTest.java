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
package org.eclipse.kapua.message.internal;

import static org.eclipse.kapua.message.internal.KapuaMessageUtil.populatePosition;

import java.io.StringWriter;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.eclipse.kapua.commons.util.xml.XmlUtil;
import org.eclipse.kapua.message.KapuaPosition;
import org.eclipse.kapua.model.xml.DateXmlAdapter;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class KapuaPositionTest extends Assert {

    private static final String newline = System.lineSeparator();

    private static final String POSITION_DISPLAY_STR = "^latitude=.*~~longitude=.*~~altitude=.*" +
            "~~precision=.*~~heading=.*~~speed=.*~~timestamp=.*~~satellites=.*~~status=.*$";

    private static final String DISPLAY_STR = "^\\{\"longitude\":.*, \"latitude\":.*, \"altitude\":.*" +
            ", \"precision\":.*, \"heading\":.*, \"speed\":.*, \"timestamp\":.*, \"satellites\":.*, \"status\":.*\\}$";

    private static ZonedDateTime referenceDate = ZonedDateTime.of(2017, 1, 18, 12, 10, 46, 238000000, ZoneId.of(DateXmlAdapter.TIME_ZONE_UTC));

    private static final String POSITION_XML_STR = //
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + newline +
                    "<position>" + newline +
                    "   <longitude>45.1111</longitude>" + newline +
                    "   <latitude>15.3333</latitude>" + newline +
                    "   <altitude>430.3</altitude>" + newline +
                    "   <precision>12.0</precision>" + newline +
                    "   <heading>280.0</heading>" + newline +
                    "   <speed>60.2</speed>" + newline +
                    "   <timestamp>2017-01-18T12:10:46.238Z</timestamp>" + newline +
                    "   <satellites>5</satellites>" + newline +
                    "   <status>4</status>" + newline +
                    "</position>" + newline;

    @Before
    public void before() throws Exception {
        XmlUtil.setContextProvider(new MessageJAXBContextProvider());
    }

    @Test
    public void positionGetterSetters() throws Exception {
        KapuaPosition position = new KapuaPositionImpl();
        populatePosition(position, referenceDate);

        assertEquals(new Double("45.1111"), position.getLongitude());
        assertEquals(new Double("15.3333"), position.getLatitude());
        assertEquals(new Double("430.3"), position.getAltitude());
        assertEquals(new Double("12.0"), position.getPrecision());
        assertEquals(new Double("280.0"), position.getHeading());
        assertEquals(new Double("60.2"), position.getSpeed());
        assertNotNull(position.getTimestamp());
        assertEquals(new Integer(5), position.getSatellites());
        assertEquals(new Integer(4), position.getStatus());
    }

    @Test
    public void displayString() throws Exception {
        KapuaPosition position = new KapuaPositionImpl();
        populatePosition(position, referenceDate);

        String displayStr = position.toDisplayString();
        assertTrue("\nExpected: " + POSITION_DISPLAY_STR +
                "\nActual:   " + displayStr,
                displayStr.matches(POSITION_DISPLAY_STR));
    }

    @Test
    public void displayEmptyPositionString() throws Exception {
        KapuaPosition position = new KapuaPositionImpl();

        String displayStr = position.toDisplayString();
        assertNull(displayStr);
    }

    @Test
    public void toStringValue() throws Exception {
        KapuaPosition position = new KapuaPositionImpl();
        populatePosition(position, referenceDate);

        String toStr = position.toString();
        assertTrue("\nExpected: " + DISPLAY_STR +
                "\nActual:   " + toStr,
                toStr.matches(DISPLAY_STR));
    }

    @Test
    public void marshallPosition() throws Exception {
        KapuaPosition position = new KapuaPositionImpl();
        populatePosition(position, referenceDate);

        StringWriter strWriter = new StringWriter();
        XmlUtil.marshal(position, strWriter);
        assertEquals(POSITION_XML_STR, strWriter.toString());
    }
}
