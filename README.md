## NodeJS Aria Systems SDK
This SDK allows calling Aria Systems API using NodeJS.

This has been refactored to remove all 3rd party dependencies and now uses the native Promise object

## Usage

### Initializing
```javascript
var Aria = require('aria-sdk-unofficial');

var tenant = {
    env: 'SF',
    clientNo: 123345,
    authKey: 'auth-key-goes-here',
}

var aria = new Aria(tenant);
```

### Additional Aria() options
Method signature: `Aria(tenant, override, debug, timeout)`
- tenant: Object with env, clientNo, authKey specified
- override: object with the following parameters (none or all overrides can be specified)
  - outputFormat: string = (defaults to JSON)
  - host: object = core, object, admintools properties. 
    - This override the 'env' property on the tenant parameter.
    - If one is provided, all must be provided.
    - These should be host of the Aria server. e.x.: core: 'secure.future.stage.ariasystems.net'
- debug: boolean parameter specifying if debugging data, such as the payload, should be logged to the console
- timeout: number = HTTP request timeout in milliseconds.  Defaults to 12000.

## Making API request
Use the call method on the Aria object.

The call function has the following signature: `function(type: 'core' | 'object' | 'admintools', restCall: string, payload?: Object, callback?: Function)`
- type: string = Aria API type. Either core, object, or admintools
- restCall: string = Api call name of the Aria api call
- payload: Object = Optional data to send with request, defaults to {}
- callback: Function = Optional callback if not using promises


## Making call with no payload
```javascript
aria.call('core', 'authenticate_caller')
    .then(function(data) {
        console.log(data);
    })
    .catch(function(err) {
        console.log(err);
    });
```

## Making call with payload
```javascript
aria.call('core', 'get_acct_details_all', {acct_no: 123456})
    .then(function(data) {
        console.log(data);
    })
    .catch(function(err) {
        console.log(err);
    });
```

### Callback based *(may be deprecated in future versions)*
```javascript
aria.call('core', 'authenticate_caller', null, function(err, data) {
    if (err) console.log(err);
    console.log(data);
});
```


## Sample Output
```javascript
{ error_code: 0, error_msg: "ok" }
```
