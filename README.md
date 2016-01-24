## NodeJS Aria Systems SDK
This SDK allows calling Aria Systems API using NodeJS.

## Usage

```javascript
var Aria = require('aria-sdk-unofficial');

var tenant = {
    env: 'SF',
    clientNo: 123345,
    authKey: 'auth-key-goes-here',
}

var aria = new Aria(tenant);

aria.call('core', 'authenticate_caller', null, function(err, data) {
    if (err) console.log(err);
    console.log(data);
});
```javascript
### Output:
```
{ error_code: 0, error_msg: "ok" }
```

Creating a new Aria object takes in the following parameters:
(tenant, override, debug)

1. tenant (object)
  a. client_no
  b. auth_key
  c. env (valid values are "SF" (default), "SC", "PROD", "SF_CPH", "PROD_CPH")

2. Override options (object)
  a. host {core: 'url', object: 'url', admintools: 'url'} (object including must include properties for core, object, admintools -> urls for overriding built in URLs.) 
  b. outputFormat 'xml', 'json' (default), 'html' (String determining output format)

3. debug (boolean)
  a. true / false (default) to show detailed debug information

passing in `var aria = new Aria(tenant);` is the same as passing in `var aria = new Aria(tenant, null, false);`  

### Executing API

Executing the API is done by calling the `call` function on the aria object.  The call function takes 4 parameters:
1. Api Type (string)
    a. 'core' (default), 'object', 'admintools'
2. Api name (string)
3. parameters (hash containing required input parameters)
4. callback (err, response)

### Response
The response will provide an error in the first parameter if exists.  
The second return parameter is the API call results.  
The third parameter is only returned if the status code is something other than 200 and the results are still returned in this case.
