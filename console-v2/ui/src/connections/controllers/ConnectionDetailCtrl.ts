export default class ConnectionDetailCtrl {
    private connection: Connection;
    private connectionId: string;

    constructor(private $stateParams: angular.ui.IStateParamsService,
        private connectionsService: IConnectionsService) {

        this.connectionId = this.$stateParams["id"];
        this.getConnectionById(this.connectionId);
    }


    getConnectionById(connectionID: string): void {
        // this.connectionsService.getConnectionById(connectionID).then((responseData: ng.IHttpPromiseCallbackArg<Connection>) => {
        //   this.connection = responseData.data;
        // });
        this.connection = {
            type: "deviceConnection",
            id: "JDb8eDSZZMA1",
            scopeId: "AQ",
            createdOn: "2017-08-09T09:53:26.565Z",
            createdBy: "Ag",
            modifiedOn: "2017-08-09T11:29:25.893Z",
            modifiedBy: "Ag",
            optlock: 3,
            status: "CONNECTED",
            clientId: "B8:27:EB:AC:E3:6C",
            userId: "Ag1",
            protocol: "MQTT1",
            clientIp: "tcp://10.0.2.2:54198"
        }
    }
}