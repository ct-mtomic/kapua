/*******************************************************************************
 * Copyright (c) 2017 Red Hat Inc and others
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Red Hat Inc - initial API and implementation
 *******************************************************************************/
package org.eclipse.kapua.kura.simulator.app;

import static java.util.Objects.requireNonNull;
import static org.eclipse.kapua.kura.simulator.payload.Metrics.KEY_REQUESTER_CLIENT_ID;
import static org.eclipse.kapua.kura.simulator.payload.Metrics.KEY_REQUEST_ID;
import static org.eclipse.kapua.kura.simulator.payload.Metrics.KEY_RESPONSE_CODE;
import static org.eclipse.kapua.kura.simulator.payload.Metrics.KEY_RESPONSE_EXCEPTION_MESSAGE;
import static org.eclipse.kapua.kura.simulator.payload.Metrics.KEY_RESPONSE_EXCEPTION_STACKTRACE;
import static org.eclipse.kapua.kura.simulator.payload.Metrics.getAsString;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.eclipse.kapua.kura.simulator.payload.Message;
import org.eclipse.kapua.kura.simulator.payload.Metrics;
import org.eclipse.kapua.kura.simulator.topic.Topic;
import org.eclipse.kura.core.message.protobuf.KuraPayloadProto;
import org.eclipse.kura.core.message.protobuf.KuraPayloadProto.KuraPayload;
import org.eclipse.kura.core.message.protobuf.KuraPayloadProto.KuraPayload.Builder;
import org.eclipse.kura.core.message.protobuf.KuraPayloadProto.KuraPayload.KuraMetricOrBuilder;

public class Request {

    private static final String NL = System.lineSeparator();

    private final ApplicationContext applicationContext;
    private final Message message;
    private final Map<String, Object> metrics;
    private final String requestId;
    private final String requesterClientId;

    public Request(final ApplicationContext applicationContext, final Message message,
            final Map<String, Object> metrics, final String requestId, final String requesterClientId) {

        requireNonNull(applicationContext);
        requireNonNull(message);
        requireNonNull(metrics);
        requireNonNull(requestId);
        requireNonNull(requesterClientId);

        this.applicationContext = applicationContext;
        this.message = message;
        this.metrics = metrics;
        this.requestId = requestId;
        this.requesterClientId = requesterClientId;
    }

    public ApplicationContext getApplicationContext() {
        return this.applicationContext;
    }

    public Message getMessage() {
        return this.message;
    }

    public Map<String, Object> getMetrics() {
        return Collections.unmodifiableMap(this.metrics);
    }

    public String getRequesterClientId() {
        return this.requesterClientId;
    }

    public String getRequestId() {
        return this.requestId;
    }

    public String renderTopic(final int index) {
        return this.message.getTopic().render(index, index + 1);
    }

    public String renderTopic(final int fromIndex, final int toIndex) {
        return this.message.getTopic().render(fromIndex, toIndex);
    }

    public static Request parse(final ApplicationContext context, final Message message) throws Exception {

        final KuraPayload payload = KuraPayloadProto.KuraPayload.parseFrom(message.getPayload());

        final Map<String, Object> metrics = Metrics.extractMetrics(payload);

        final String requestId = getAsString(metrics, KEY_REQUEST_ID);
        if (requestId == null) {
            throw new IllegalArgumentException("Request ID (" + KEY_REQUEST_ID + ") missing in message");
        }

        final String requesterClientId = getAsString(metrics, KEY_REQUESTER_CLIENT_ID);
        if (requesterClientId == null) {
            throw new IllegalArgumentException(
                    "Requester Client ID (" + KEY_REQUESTER_CLIENT_ID + ") missing in message");
        }

        return new Request(context, message, metrics, requestId, requesterClientId);
    }

    /**
     * Get a success reply sender
     * <p>
     * <strong>Note:</strong> A reply will only be send when one of the
     * {@code send} methods of the result was invoked.
     * </p>
     *
     * @return a new sender, never returns {@code null}
     */
    public Sender replySuccess() {
        return reply(200);
    }

    /**
     * Get a error reply sender
     * <p>
     * <strong>Note:</strong> A reply will only be send when one of the
     * {@code send} methods of the result was invoked.
     * </p>
     *
     * @return a new sender, never returns {@code null}
     */
    public Sender replyError() {
        return reply(500);
    }

    /**
     * Get a reply sender
     * <p>
     * <strong>Note:</strong> A reply will only be send when one of the
     * {@code send} methods of the result was invoked.
     * </p>
     *
     * @return a new sender, never returns {@code null}
     */
    public Sender reply(final int responseCode) {
        return new Sender() {

            @Override
            public void send(final KuraPayload.Builder payload) {

                // check for existing response code metric

                for (final KuraMetricOrBuilder metric : payload.getMetricOrBuilderList()) {
                    if (metric.getName().equals(KEY_RESPONSE_CODE)) {
                        throw new IllegalArgumentException(
                                String.format("Metrics must not already contain '%s'", KEY_RESPONSE_CODE));
                    }
                }

                // add response code

                Metrics.addMetric(payload, KEY_RESPONSE_CODE, responseCode);

                Request.this.applicationContext
                        .sender(Topic.reply(Request.this.requesterClientId, Request.this.requestId))
                        .send(payload);
            }
        };
    }

    /**
     * Get a notification sender
     * <p>
     * <strong>Note:</strong> A reply will only be send when one of the
     * {@code send} methods of the result was invoked.
     * </p>
     *
     * @return a new sender, never returns {@code null}
     */
    public Sender notification(final String resource) {
        return new Sender() {

            @Override
            public void send(final Builder payload) {
                Request.this.applicationContext
                        .sender(Topic.notify(Request.this.requesterClientId, resource))
                        .send(payload);
            }
        };
    }

    /**
     * Send an error reply
     */
    public void replyError(final Throwable error) {
        final Map<String, Object> metrics = new HashMap<>();
        if (error != null) {
            metrics.put(KEY_RESPONSE_EXCEPTION_MESSAGE, ExceptionUtils.getRootCauseMessage(error));
            metrics.put(KEY_RESPONSE_EXCEPTION_STACKTRACE, ExceptionUtils.getStackTrace(error));
        }
        reply(500).send(metrics);
    }

    /**
     * Send a
     * <q>not found</q> reply
     */
    public void replyNotFound() {
        reply(404).send(Collections.emptyMap());
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();

        sb.append("[Request - ").append(this.message.getTopic());

        if (!this.metrics.isEmpty()) {
            sb.append(NL);
        }

        for (final Map.Entry<String, Object> entry : this.metrics.entrySet()) {
            final Object value = entry.getValue();

            sb.append("\t");
            sb.append(entry.getKey()).append(" => ");
            if (value != null) {
                sb.append(value.getClass().getSimpleName()).append(" : ").append(value);
            } else {
                sb.append("null");
            }
            sb.append(NL);
        }
        sb.append("]");

        return sb.toString();
    }
}
