(function(){
    'use strict';
    
    let https = require('https');
    let EndPoints = require('./aria-endpoints');
    // TODO add in other environments

    /**
     * Tenant should be an object with the following:
     * @param {tenant} Object = {}
     * env: SF, SC, PROD, SF_CPH, PROD_CPH *Note: this can be omitted if override.host is provided
     * clientNo: 123435 (client number integer)
     * authKey: 'gfdgfdsfdsfds' (authorization key for API calls String)
     * 
     * optional override can include the following:
     * @param {override} Object = {}
     * host: urls for the core, object, admintools api (all must be provided)
     * outputFormat: String value of output type.  xml, json (default), or html
     * @param {debug} Boolean prints to the console if provided, defaults to false
     * @param {timeout} Number sets timeout in millisecond, defaults to 120000
     */
    function Aria(tenant, override, debug, timeout) {
        this.ariaEndpoints = new EndPoints(tenant.env, override);
        this.clientNo = tenant.clientNo;
        this.authKey = tenant.authKey;
        this.debug = debug || false;
        this.timeout = timeout || 120000
    }

    /**
     * Call Aria API
     * @param type: 'core' (default), 'object', 'admintools'. If no match or null, defaults to core
     * @param restCall: Aria api call name
     * @param payload: Aria request payload object. Defaults to null
     * @param callback - optional callback instead of promise.  It is recommended to use promises instead of callback.
     * Returns promise
     */
    Aria.prototype.call = function(type, restCall, payload, callback) {
        return new Promise((resolve, reject) => {
            payload = payload || {};
            const clientNo = this.clientNo;
            const authKey = this.authKey;
            const debug = this.debug;

            if ( debug !== true) debug = false;
            // Setup parameters
            if (payload === null) payload = {};
            payload.client_no = clientNo;
            payload.auth_key = authKey;
            payload.rest_call = restCall;
            payload.output_format = this.ariaEndpoints.outputFormat;
            const postData = JSON.stringify(payload);
            if (debug) { console.log('Parameters: ' + postData); };

            // get http options
            const options = this.ariaEndpoints.getEndpoint(type);
            options.headers = this.ariaEndpoints.getHeader(postData);
            options.timeout = this.timeout;
            if (debug) { console.log('Endpoint details: ' + JSON.stringify(options)); };

            // make request
            const req = https.request(options, function(res) {
                res.setEncoding('utf8');
                let output = '';
                // Add chunk of data to output
                res.on('data', function (chunk) {
                    output += chunk;
                });	
                // Done receiving response, resolve promse and call callback, if necessary
                res.on('end', function() {
                    if (debug) {
                        console.log('request finished: ' + new Date());
                        console.log('response: ' + output);
                    };
                    /**
                     * Attempt to deserialize and respond to the request
                     */
                    try {
                        const data = JSON.parse(output);
                        resolve(data);
                        if (callback) callback(null, data);
                    } catch (err) {
                        console.log('problem with request: ' + err.message);
                        reject(new Error(err));
                        if (callback) { callback(err); }
                    }
                });
            });

            req.on('error', function(err) {
                console.log('problem with request: ' + err.message);
                reject(new Error(err));
                if (callback) { callback(err); }
            });
            // Trigger request
            if (debug) { console.log('starting request: ' + new Date()) };
            req.write(postData);
            // Close object
            req.end();
        });
      
    }
    
    module.exports = Aria;

})();