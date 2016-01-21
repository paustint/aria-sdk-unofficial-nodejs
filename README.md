## NodeJS Aria Systems SDK
This SDK allows calling Aria Systems API using NodeJS.

## Usage

```
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
```
### Output:
```
{ error_code: 0, error_msg: "ok" }
```

Creating a new Aria object takes in the following parameters:
1. tenant (object)
  1. client_no
  2. auth_key
  3. env (valid values are "SF", "SC", "PROD", "SF_CPH", "PROD_CPH")

2. Override options (object)
  1. host {core: 'url', object: 'url', admintools: 'url'} (object including must include properties for core, object, admintools -> urls for overriding built in URLs.) 
  2. outputFormat 'xml', 'json' (default), 'html' (String determining output format)

3. debug (boolean)
  1. true / false to show detailed debug information

passing in `var aria = new Aria(tenant);` is the same as passing in `var aria = new Aria(tenant, null, debug);`  

### Response
The response will provide an erro in the first parameter if exists.  
The second return parameter is the API call results.  
The third parameter is only returned if the status code is something other than 200 and the data is also returned in this case.
