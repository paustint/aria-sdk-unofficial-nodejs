(function(){
    'use strict';
    
    var https = require('https');
    var Q = require('q');
    var EndPoints = require('./aria-endpoints');
    // TODO add in other environments

    /**
     * Tenant should be an object with the following:
     * @param tenant = {}
     * env: SF, SC, PROD, SF_CPH, PROD_CPH *Note: this can be omitted if override.host is provided
     * clientNo: 123435 (client number integer)
     * authKey: 'gfdgfdsfdsfds' (authorization key for API calls String)
     * 
     * optional override can include the following:
     * @override = {}
     * host: urls for the core, object, admintools api (all must be provided)
     * outputFormat: String value of output type.  xml, json (default), or html
     */
    function Aria(tenant, override, debug) {
        this.ariaEndpoints = new EndPoints(tenant.env, override);
        this.clientNo = tenant.clientNo;
        this.authKey = tenant.authKey;
        this.debug = debug || false;
    }

    /**
     * Call Aria API
     * @param type: 'core' (default), 'object', 'admintools'. If no match or null, defaults to core
     * @param restCall: Aria api call name
     * @param params: Aria parameters object. If none, can be {} or null
     * @param onResult - optional callback instead of parameters.  It is recommended to use promises instead of callback.
     * Returns promise
     */
    Aria.prototype.call = function(type, restCall, params, onResult)
    {
        var deferred = Q.defer();
        var clientNo = this.clientNo;
        var authKey = this.authKey;
        var debug = this.debug;
        
        if ( debug !== true) debug = false;
        // Setup parameters
        if (params === null) params = {};
        params.client_no = clientNo;
        params.auth_key = authKey;
        params.rest_call = restCall;
        params.output_format = this.ariaEndpoints.outputFormat;
        var postData = JSON.stringify(params);
        if (debug) { console.log('Parameters: ' + postData); };
        
        // get http options
        var options = this.ariaEndpoints.getEndpoint(type);
        
        options.headers = this.ariaEndpoints.getHeader(postData);
        if (debug) { console.log('Endpoint details: ' + JSON.stringify(options)); };
        
        // make request
        var req = https.request(options, function(res) {
            
            res.setEncoding('utf8');
            
            var output = '';
            // Add chunk of data to output
            res.on('data', function (chunk) {
                output += chunk;
            });	
            // Done getting objects, call callback
            res.on('end', function() {
                if (debug) { 
                    console.log('request finished: ' + new Date());
                    console.log('response: ' + output);
                };
                try {
                    var data = JSON.parse(output);
                        deferred.resolve(data);
                        if (onResult) onResult(null, data);
                    
                } catch (e) {
                    console.log('problem with request: ' + e.message);
                    deferred.reject(new Error(e));
                    if (onResult) onResult(e);
                }
            });
        });
        
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            deferred.reject(new Error(e));
            if (onResult) onResult(e);
        });
        // Trigger request
        if (debug) { console.log('starting request: ' + new Date()) };
        req.write(postData);
        // Close object
        req.end();
        // Return promise
        return deferred.promise;
    }
    
    module.exports = Aria;

})();