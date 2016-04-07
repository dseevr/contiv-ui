/**
 * Created by vjain3 on 2/19/16.
 */
angular.module('contiv.networks')
    .config(function ($stateProvider) {
        $stateProvider
            .state('contiv.networks.create', {
                url: '/networks/create',
                //target the un-named 'ui-view' in PARENT states template
                templateUrl: 'networks/networkcreate.html',
                controller: 'NetworkCreateCtrl as networkCreateCtrl'
            })
        ;
    })
    .controller('NetworkCreateCtrl', ['$state', '$stateParams', 'NetworksModel', function ($state, $stateParams, NetworksModel) {
        var networkCreateCtrl = this;
        networkCreateCtrl.cidrPattern = ContivGlobals.CIDR_REGEX;

        function returnToNetworks() {
            $state.go('contiv.networks');
        }

        function cancelCreating() {
            returnToNetworks();
        }

        function createNetwork() {
            //form controller is injected by the html template
            //checking if all validations have passed
            if (networkCreateCtrl.form.$valid) {
                networkCreateCtrl.newNetwork.key =
                    networkCreateCtrl.newNetwork.tenantName + ':' + networkCreateCtrl.newNetwork.networkName;
                NetworksModel.create(networkCreateCtrl.newNetwork).then(function (result) {
                    returnToNetworks();
                });
            }

        }

        function resetForm() {
            networkCreateCtrl.newNetwork = {
                networkName: '',
                encap: 'vxlan',
                subnet: '',
                gateway: '',
                tenantName: 'default'//TODO: Remove hardcoded tenant.
            };
        }

        networkCreateCtrl.createNetwork = createNetwork;
        networkCreateCtrl.cancelCreating = cancelCreating;

        resetForm();
    }]);