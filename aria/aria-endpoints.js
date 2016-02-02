(function(){
    'use strict';
    
    /**
     * @Function contrstructor for prototype
     * override is an object with the following options:
     * host: object with core, object, admintools keys with URL values
     * outputFormat: String value of output type.  xml, json (default), or html
     */
    function EndPoints(env, override) {
        var json = 'json';
        var xml = 'xml';
        var html = 'html';
        
        override = override || {};
        this.outputFormat = override.outputFormat || json;
        this.endpoints = {
            core: {
                host: 'secure.future.stage.ariasystems.net',
                path: '/api/ws/api_ws_class_dispatcher.php',
                method: 'POST',
                port: 443,
            },
            object:	{
                host: 'secure.future.stage.ariasystems.net',
                path: '/api/AriaQuery/objects.php',
                method: 'POST',
                port: 443,
            },	
            admintools: {
                host: 'admintools.future.stage.ariasystems.net',
                path: '/AdminTools.php/Dispatcher',
                method: 'POST',
                port: 443,
            }	
        };
        // Set environment
        if (!override.host) {
            if (env === "SF") {
                this.endpoints.core.host = 'secure.future.stage.ariasystems.net';
                this.endpoints.object.host = 'secure.future.stage.ariasystems.net';
                this.endpoints.admintools.host = 'admintools.future.stage.ariasystems.net';
            } else if (env === "SC") {
                this.endpoints.core.host = 'secure.current.stage.ariasystems.net';
                this.endpoints.object.host = 'secure.current.stage.ariasystems.net';
                this.endpoints.admintools.host = 'admintools.current.stage.ariasystems.net';
            } else if (env === "PROD") {
                this.endpoints.core.host = 'secure.ariasystems.net';
                this.endpoints.object.host = 'secure.ariasystems.net';
                this.endpoints.admintools.host = 'admintools.ariasystems.net';
            } else if (env === "SF_CPH") {
                this.endpoints.core.host = 'secure.future.stage.cph.ariasystems.net';
                this.endpoints.object.host = 'secure.future.stage.cph.ariasystems.net';
                this.endpoints.admintools.host = 'admintools.future.cph.stage.ariasystems.net';
            } else if (env === "PROD_CPH") {
                this.endpoints.core.host = 'secure.cph.ariasystems.net';
                this.endpoints.object.host = 'secure.cph.ariasystems.net';
                this.endpoints.admintools.host = 'admintools.cph.ariasystems.net';
            }   
        } else { // set overridden endpoint host
            this.endpoints.core = override.host.core;
            this.endpoints.object = override.host.object;
            this.endpoints.admintools = override.host.admintools;
        }
        
        // Append output type to host url path
        this.endpoints.core.path = this.endpoints.core.path + '?output_format=' + this.outputFormat
        this.endpoints.object.path = this.endpoints.object.path + '?output_format=' + this.outputFormat
        this.endpoints.admintools.path = this.endpoints.admintools.path + '?output_format=' + this.outputFormat
                
        if (this.outputFormat === json) {
            this.contentType = 'application/json';
        } else if (this.endpoints.outputFormat === xml) {
            this.contentType = 'application/xml';
        } else {
            this.contentType = 'text/html';
        }
        
    }
    
    EndPoints.prototype.getEndpoints = function() {
        return this.endpoints;
    }
    
    EndPoints.prototype.getEndpoint = function(type) {
        return this.endpoints[type.toLowerCase()] || this.endpoints.core;
    }
    
    EndPoints.prototype.getHeader = function(postData) {
        return { 'Content-Type': this.contentType, 'Content-Length': Buffer.byteLength(postData) };
    }
    
    EndPoints.prototype.outputFormat = function() {
        return this.outputFormat;
    }
    
    EndPoints.prototype.getContentType = function() {
        return this.contentType;
    }
    
    module.exports = EndPoints;
    
})();