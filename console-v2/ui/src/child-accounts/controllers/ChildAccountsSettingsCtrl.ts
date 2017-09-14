/*******************************************************************************
* Copyright (c) 2016, 2017 Eurotech and/or its affiliates                        
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
export default class DeviceDetailConfigurationsCtrl {

    private configs: any[];
    private configsResetCopy: any[];

    constructor(private $scope: any,
        private $modal: angular.ui.bootstrap.IModalService,
        private $stateParams: angular.ui.IStateParamsService,
        private childAccountsService: IChildAccountsService) {

        this.getSettingsByAccountId(this.$stateParams["id"]);
    }

    removeCharacters(str: string): string {
        return str.replace(/[^a-zA-Z ]/g, "")
    }

    findConfigForResetCopy(configId): any {
        let resetConfigs: any[] = angular.copy(this.configsResetCopy);
        let resetConfig: any;
        resetConfigs.forEach((config: any) => {
            if (config.id === configId)
                resetConfig = config;
        });
        return resetConfig;
    }

    resetForm(config: any): void {
        let form = this['form' + config.definition.name];
        form.$setPristine();
        form.$setUntouched();
        config.properties.property = this.findConfigForResetCopy(config.id).properties.property;
    }

    findPropertyIndex(config: any, AD: AD): number {
        let index: number;
        config.properties.property.forEach((property: Property) => {
            if (property.name === AD.name)
                index = config.properties.property.indexOf(property);
        });
        return index;
    }

    prepareConfigForPost(config: any): any {
        let dataForPost: any = angular.copy(config);
        dataForPost.properties.property.forEach((property: Property) => {
            property.value[0] = property.value[0].toString();
        });
        return dataForPost;
    }

    prepareConfigsForView(configs: any[]): void {
        this.configs = configs;
        this.configs.forEach((config: any) => {
            config.definition.AD.forEach((AD: AD) => {
                if (AD.type === "Integer" && !AD.Option.length)
                    config.properties.property[this.findPropertyIndex(config, AD)].value[0] = parseInt(config.properties.property[this.findPropertyIndex(config, AD)].value[0]);
                if ((AD.type === "Double" || AD.type === "Float") && !AD.Option.length)
                    config.properties.property[this.findPropertyIndex(config, AD)].value[0] = parseFloat(config.properties.property[this.findPropertyIndex(config, AD)].value[0]);
            });
        });
        this.configsResetCopy = angular.copy(this.configs);
    }

    getSettingsByAccountId(accountID: string) {
        let configs = {  // mocked data
            "type": "deviceConfiguration",
            "configuration": [
                {
                    "id": "org.eclipse.kura.core.data.transport.mqtt.MqttDataTransport",
                    "definition": {
                        "description": "The MqttDataTransport provides an MQTT connection. Its configuration parameters are used to determine the MQTT broker and the credentials to connect to the broker.",
                        "id": "org.eclipse.kura.core.data.transport.mqtt.MqttDataTransport",
                        "name": "MqttDataTransport",
                        "AD": [
                            {
                                "cardinality": 0,
                                "description": "URL of the mqtt broker to connect to, for example, mqtt://broker-sandbox.everyware-cloud.com:1883/ or mqtts://broker-sandbox.everyware-cloud.com:8883/.",
                                "id": "broker-url",
                                "name": "broker-url",
                                "required": true,
                                "type": "String",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "The value of this attribute will replace the '#account-name' token found in publishing topics. For connections to the EDC platform, this attribute is mandatory and must match the name of the EDC account.",
                                "id": "topic.context.account-name",
                                "name": "topic.context.account-name",
                                "required": false,
                                "type": "String",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "Username to be used when connecting to the MQTT broker.",
                                "id": "username",
                                "name": "username",
                                "required": false,
                                "type": "String",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "Password to be used when connecting to the MQTT broker.",
                                "id": "password",
                                "name": "password",
                                "required": false,
                                "type": "Password",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "Client identifier to be used when connecting to the MQTT broker. The identifier has to be unique within your account. Characters '/', '+', '#' and '.' are invalid and they will be replaced by '-'. If left empty, this is automatically determined by the client software as the MAC address of the main network interface (in general uppercase and without ':').",
                                "id": "client-id",
                                "name": "client-id",
                                "required": false,
                                "type": "String",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "Frequency in seconds for the periodic MQTT PING message.",
                                "id": "keep-alive",
                                "name": "keep-alive",
                                "required": true,
                                "type": "Integer",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "Timeout used for all interactions with the MQTT broker.",
                                "id": "timeout",
                                "name": "timeout",
                                "required": true,
                                "type": "Integer",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "MQTT Clean Session flag.",
                                "id": "clean-session",
                                "name": "clean-session",
                                "required": true,
                                "type": "Boolean",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "MQTT Last Will and Testament topic. The tokens '#account-name' and '#client-id' will be replaced by the values of the properties topic.context.account-name and client-id",
                                "id": "lwt.topic",
                                "name": "lwt.topic",
                                "required": false,
                                "type": "String",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "MQTT Last Will and Testament payload as a string.",
                                "id": "lwt.payload",
                                "name": "lwt.payload",
                                "required": false,
                                "type": "String",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "MQTT Last Will and Testament QoS (0..2).",
                                "id": "lwt.qos",
                                "name": "lwt.qos",
                                "required": false,
                                "type": "Integer",
                                "Option": [
                                    {
                                        "label": "0",
                                        "value": "0"
                                    },
                                    {
                                        "label": "1",
                                        "value": "1"
                                    },
                                    {
                                        "label": "2",
                                        "value": "2"
                                    }
                                ]
                            },
                            {
                                "cardinality": 0,
                                "description": "MQTT Last Will and Testament Retain flag.",
                                "id": "lwt.retain",
                                "name": "lwt.retain",
                                "required": false,
                                "type": "Boolean",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "Storage type where in-flight messages are persisted across reconnections.",
                                "id": "in-flight.persistence",
                                "name": "in-flight.persistence",
                                "required": true,
                                "type": "String",
                                "Option": [
                                    {
                                        "label": "file",
                                        "value": "file"
                                    },
                                    {
                                        "label": "memory",
                                        "value": "memory"
                                    }
                                ]
                            },
                            {
                                "cardinality": 0,
                                "description": "MQTT Protocol Version.",
                                "id": "protocol-version",
                                "name": "protocol-version",
                                "required": false,
                                "type": "Integer",
                                "Option": [
                                    {
                                        "label": "3.1",
                                        "value": "3"
                                    },
                                    {
                                        "label": "3.1.1",
                                        "value": "4"
                                    }
                                ]
                            },
                            {
                                "cardinality": 0,
                                "description": "The protocol to use to initialize the SSLContext. If not specified, the protocol specified in the SslManagerService will be used.",
                                "id": "ssl.default.protocol",
                                "name": "ssl.default.protocol",
                                "required": false,
                                "type": "String",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "Enable or disable hostname verification.",
                                "id": "ssl.hostname.verification",
                                "name": "ssl.hostname.verification",
                                "required": true,
                                "type": "String",
                                "Option": [
                                    {
                                        "label": "Rely on SSL Manager Service configuration",
                                        "value": "use-ssl-service-config"
                                    },
                                    {
                                        "label": "True",
                                        "value": "true"
                                    },
                                    {
                                        "label": "False",
                                        "value": "false"
                                    }
                                ]
                            },
                            {
                                "cardinality": 0,
                                "description": "Comma-separated list of allosed ciphers. If not specified, the SslManagerService configuration will be used.",
                                "id": "ssl.default.cipherSuites",
                                "name": "ssl.default.cipherSuites",
                                "required": false,
                                "type": "String",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "The alias to use. If not specified, the value in topic.context.account-name will be used.",
                                "id": "ssl.certificate.alias",
                                "name": "ssl.certificate.alias",
                                "required": false,
                                "type": "String",
                                "Option": []
                            }
                        ],
                        "Icon": [
                            {
                                "resource": "MqttDataTransport",
                                "size": 32
                            }
                        ]
                    },
                    "properties": {
                        "property": [
                            {
                                "name": "ssl.default.protocol",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    ""
                                ]
                            },
                            {
                                "name": "in-flight.persistence",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "memory"
                                ]
                            },
                            {
                                "name": "clean-session",
                                "array": false,
                                "encrypted": false,
                                "type": "Boolean",
                                "value": [
                                    "true"
                                ]
                            },
                            {
                                "name": "lwt.retain",
                                "array": false,
                                "encrypted": false,
                                "type": "Boolean",
                                "value": [
                                    "false"
                                ]
                            },
                            {
                                "name": "protocol-version",
                                "array": false,
                                "encrypted": false,
                                "type": "Integer",
                                "value": [
                                    "4"
                                ]
                            },
                            {
                                "name": "service.factoryPid",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "org.eclipse.kura.core.data.transport.mqtt.MqttDataTransport"
                                ]
                            },
                            {
                                "name": "timeout",
                                "array": false,
                                "encrypted": false,
                                "type": "Integer",
                                "value": [
                                    "20"
                                ]
                            },
                            {
                                "name": "kura.service.pid",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "org.eclipse.kura.core.data.transport.mqtt.MqttDataTransport"
                                ]
                            },
                            {
                                "name": "service.pid",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "org.eclipse.kura.core.data.transport.mqtt.MqttDataTransport-1502849847172-0"
                                ]
                            },
                            {
                                "name": "ssl.default.cipherSuites",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    ""
                                ]
                            },
                            {
                                "name": "broker-url",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "mqtt://10.113.5.146:1883/"
                                ]
                            },
                            {
                                "name": "password",
                                "array": false,
                                "encrypted": true,
                                "type": "Password",
                                "value": [
                                    "a2FwdWEtcGFzc3dvcmQ="
                                ]
                            },
                            {
                                "name": "keep-alive",
                                "array": false,
                                "encrypted": false,
                                "type": "Integer",
                                "value": [
                                    "30"
                                ]
                            },
                            {
                                "name": "ssl.certificate.alias",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    ""
                                ]
                            },
                            {
                                "name": "topic.context.account-name",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "kapua-sys"
                                ]
                            },
                            {
                                "name": "lwt.topic",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "$EDC/#account-name/#client-id/MQTT/LWT"
                                ]
                            },
                            {
                                "name": "lwt.payload",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    ""
                                ]
                            },
                            {
                                "name": "lwt.qos",
                                "array": false,
                                "encrypted": false,
                                "type": "Integer",
                                "value": [
                                    "0"
                                ]
                            },
                            {
                                "name": "ssl.hostname.verification",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "use-ssl-service-config"
                                ]
                            },
                            {
                                "name": "client-id",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    ""
                                ]
                            },
                            {
                                "name": "username",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "kapua-broker"
                                ]
                            }
                        ]
                    }
                },
                {
                    "id": "org.eclipse.kura.cloud.CloudService",
                    "definition": {
                        "description": "The CloudService allows for setting a user friendly name for the current device. It also provides the option to compress message payloads to reduce network traffic.",
                        "id": "org.eclipse.kura.cloud.CloudService",
                        "name": "CloudService",
                        "AD": [
                            {
                                "cardinality": 0,
                                "description": "Friendly name of the device. Device name is the common name of the device (eg: Reliagate 50-21, Raspberry Pi, etc.). Hostname will use the linux hostname utility.                  Custom allows for defining a unique string. Server defined relies on Eurotech Everware Cloud to define a name.",
                                "id": "device.display-name",
                                "name": "device.display-name",
                                "required": true,
                                "type": "String",
                                "Option": [
                                    {
                                        "label": "Set display name as device name",
                                        "value": "device-name"
                                    },
                                    {
                                        "label": "Set display name from hostname",
                                        "value": "hostname"
                                    },
                                    {
                                        "label": "Custom",
                                        "value": "custom"
                                    },
                                    {
                                        "label": "Server defined",
                                        "value": "server"
                                    }
                                ]
                            },
                            {
                                "cardinality": 0,
                                "description": "Custom name for the device. This value is applied ONLY if device.display-name is set to \"Custom\"",
                                "id": "device.custom-name",
                                "name": "device.custom-name",
                                "required": false,
                                "type": "String",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "Topic prefix for system messages.",
                                "id": "topic.control-prefix",
                                "name": "topic.control-prefix",
                                "required": true,
                                "type": "String",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "Compress message payloads before sending them to the remote server to reduce the network traffic.",
                                "id": "encode.gzip",
                                "name": "encode.gzip",
                                "required": false,
                                "type": "Boolean",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "Whether or not to republish the MQTT Birth Certificate on GPS lock event",
                                "id": "republish.mqtt.birth.cert.on.gps.lock",
                                "name": "republish.mqtt.birth.cert.on.gps.lock",
                                "required": true,
                                "type": "Boolean",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "Whether or not to republish the MQTT Birth Certificate on modem detection event",
                                "id": "republish.mqtt.birth.cert.on.modem.detect",
                                "name": "republish.mqtt.birth.cert.on.modem.detect",
                                "required": true,
                                "type": "Boolean",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "By disabling default subscriptions the gateway will not be remotely manageable",
                                "id": "disable.default.subscriptions",
                                "name": "disable.default.subscriptions",
                                "required": true,
                                "type": "Boolean",
                                "Option": []
                            },
                            {
                                "cardinality": 0,
                                "description": "Disable republishing the MQTT Birth Certificate on reconnects",
                                "id": "disable.republish.birth.cert.on.reconnect",
                                "name": "disable.republish.birth.cert.on.reconnect",
                                "required": true,
                                "type": "Boolean",
                                "Option": []
                            }
                        ],
                        "Icon": [
                            {
                                "resource": "CloudService",
                                "size": 32
                            }
                        ]
                    },
                    "properties": {
                        "property": [
                            {
                                "name": "topic.control-prefix",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "$EDC"
                                ]
                            },
                            {
                                "name": "disable.republish.birth.cert.on.reconnect",
                                "array": false,
                                "encrypted": false,
                                "type": "Boolean",
                                "value": [
                                    "false"
                                ]
                            },
                            {
                                "name": "republish.mqtt.birth.cert.on.gps.lock",
                                "array": false,
                                "encrypted": false,
                                "type": "Boolean",
                                "value": [
                                    "false"
                                ]
                            },
                            {
                                "name": "encode.gzip",
                                "array": false,
                                "encrypted": false,
                                "type": "Boolean",
                                "value": [
                                    "true"
                                ]
                            },
                            {
                                "name": "DataService.target",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "(kura.service.pid=org.eclipse.kura.data.DataService)"
                                ]
                            },
                            {
                                "name": "device.custom-name",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "UA TOZO"
                                ]
                            },
                            {
                                "name": "device.display-name",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "custom"
                                ]
                            },
                            {
                                "name": "republish.mqtt.birth.cert.on.modem.detect",
                                "array": false,
                                "encrypted": false,
                                "type": "Boolean",
                                "value": [
                                    "false"
                                ]
                            },
                            {
                                "name": "service.factoryPid",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "org.eclipse.kura.cloud.CloudService"
                                ]
                            },
                            {
                                "name": "disable.default.subscriptions",
                                "array": false,
                                "encrypted": false,
                                "type": "Boolean",
                                "value": [
                                    "false"
                                ]
                            },
                            {
                                "name": "kura.service.pid",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "org.eclipse.kura.cloud.CloudService"
                                ]
                            },
                            {
                                "name": "service.pid",
                                "array": false,
                                "encrypted": false,
                                "type": "String",
                                "value": [
                                    "org.eclipse.kura.cloud.CloudService-1502849847263-1"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
        // this.childAccountsService.getSettingsByAccountId(accountID).then((responseData: ng.IHttpPromiseCallbackArg<any>) => {
        this.prepareConfigsForView(configs.configuration);
        // });
    }

    applyConfig(config: any, deviceID: string) {
        alert("Applaying changes on: " + config.definition.name);
        // this.devicesService.applyConfig(this.prepareConfigForPost(config), deviceID).then((responseData: ng.IHttpPromiseCallbackArg<any>) => {
        //     this.prepareConfigsForView(responseData.data.configuration);
        // });
    }

}