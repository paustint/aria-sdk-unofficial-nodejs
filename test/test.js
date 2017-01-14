let assert = require("assert");
let EndPoints = require("../aria/aria-endpoints");
let Aria = require("../aria/aria-connector");

const SF = "SF";
const SC = "SC";
const PROD = "PROD";
const SF_CPH = "SF_CPH";
const PROD_CPH = "PROD_CPH";

/**
 * 
 * Test Endpoints
 * 
 */
describe("EndPoints", function() {
  it("should set Stage Future host", function() {
    let endPoints = new EndPoints(SF);
    assert.equal(
      endPoints.endpoints.core.host,
      "secure.future.stage.ariasystems.net"
    );
    assert.equal(
      endPoints.endpoints.object.host,
      "secure.future.stage.ariasystems.net"
    );
    assert.equal(
      endPoints.endpoints.admintools.host,
      "admintools.future.stage.ariasystems.net"
    );
  });
  it("should set Stage Current host", function() {
    endPoints = new EndPoints(SC);
    assert.equal(
      endPoints.endpoints.core.host,
      "secure.current.stage.ariasystems.net"
    );
    assert.equal(
      endPoints.endpoints.object.host,
      "secure.current.stage.ariasystems.net"
    );
    assert.equal(
      endPoints.endpoints.admintools.host,
      "admintools.current.stage.ariasystems.net"
    );
  });
  it("should set Production host", function() {
    endPoints = new EndPoints(PROD);
    assert.equal(endPoints.endpoints.core.host, "secure.ariasystems.net");
    assert.equal(endPoints.endpoints.object.host, "secure.ariasystems.net");
    assert.equal(
      endPoints.endpoints.admintools.host,
      "admintools.ariasystems.net"
    );
  });
  it("should set CPH Stage Future host", function() {
    endPoints = new EndPoints(SF_CPH);
    assert.equal(
      endPoints.endpoints.core.host,
      "secure.future.stage.cph.ariasystems.net"
    );
    assert.equal(
      endPoints.endpoints.object.host,
      "secure.future.stage.cph.ariasystems.net"
    );
    assert.equal(
      endPoints.endpoints.admintools.host,
      "admintools.future.cph.stage.ariasystems.net"
    );
  });
  it("should set CP Production host", function() {
    endPoints = new EndPoints(PROD_CPH);
    assert.equal(
      endPoints.endpoints.core.host,
      "secure.prod.cph.ariasystems.net"
    );
    assert.equal(
      endPoints.endpoints.object.host,
      "secure.prod.cph.ariasystems.net"
    );
    assert.equal(
      endPoints.endpoints.admintools.host,
      "admintools.prod.cph.ariasystems.net"
    );
  });

  it("should set Default host", function() {
    let endPoints = new EndPoints();
    assert.equal(
      endPoints.endpoints.core.host,
      "secure.future.stage.ariasystems.net"
    );
    assert.equal(
      endPoints.endpoints.object.host,
      "secure.future.stage.ariasystems.net"
    );
    assert.equal(
      endPoints.endpoints.admintools.host,
      "admintools.future.stage.ariasystems.net"
    );
  });
  it("should set Override host", function() {
    let endPoints = new EndPoints(null, {
      host: {
        core: "test.core",
        object: "test.object",
        admintools: "test.admintools"
      }
    });
    assert.equal(endPoints.endpoints.core.host, "test.core");
    assert.equal(endPoints.endpoints.object.host, "test.object");
    assert.equal(endPoints.endpoints.admintools.host, "test.admintools");
  });
  it("should set Path, method, post", function() {
    let endPoints = new EndPoints(SF);
    assert.equal(endPoints.endpoints.core.method, "POST");
    assert.equal(endPoints.endpoints.core.port, 443);
    assert.equal(
      endPoints.endpoints.core.path,
      "/api/ws/api_ws_class_dispatcher.php?output_format=json"
    );
    assert.equal(endPoints.endpoints.object.method, "POST");
    assert.equal(endPoints.endpoints.object.port, 443);
    assert.equal(
      endPoints.endpoints.object.path,
      "/api/AriaQuery/objects.php?output_format=json"
    );
    assert.equal(endPoints.endpoints.admintools.method, "POST");
    assert.equal(endPoints.endpoints.admintools.port, 443);
    assert.equal(
      endPoints.endpoints.admintools.path,
      "/AdminTools.php/Dispatcher?output_format=json"
    );
  });

  it("should set outputFormat to json and correct contentType", function() {
    let endPoints = new EndPoints(SF);
    assert.equal(endPoints.outputFormat, "json");
    assert.equal(endPoints.contentType, "application/json");
  });

  it(
    "should override outputFormat and set content type xml  and correct contentType",
    function() {
      let endPoints = new EndPoints(SF, {outputFormat: "xml"});
      assert.equal(endPoints.outputFormat, "xml");
      assert.equal(endPoints.contentType, "application/xml");
    }
  );

  it(
    "should override outputFormat and set content type html  and correct contentType",
    function() {
      let endPoints = new EndPoints(SF, {outputFormat: "html"});
      assert.equal(endPoints.outputFormat, "html");
      assert.equal(endPoints.contentType, "text/html");
    }
  );

  it("should default to html content type if invalid override", function() {
    let endPoints = new EndPoints(SF, {outputFormat: "invalid"});
    assert.equal(endPoints.contentType, "text/html");
  });

  describe("#getEndpoints()", function() {
    it("should get endpoints", function() {
      let endPoints = new EndPoints(SF);
      assert.deepEqual(endPoints.getEndpoints(), endPoints.endpoints);
    });
  });

  describe("#getEndpoint()", function() {
    it("should get endpoint for core with any case", function() {
      let endPoints = new EndPoints(SF);
      assert.deepEqual(endPoints.getEndpoint("CORE"), endPoints.endpoints.core);
    });
    it("should get endpoint for object with any case", function() {
      let endPoints = new EndPoints(SF);
      assert.deepEqual(
        endPoints.getEndpoint("object"),
        endPoints.endpoints.object
      );
    });
    it("should get endpoint for admintools with any case", function() {
      let endPoints = new EndPoints(SF);
      assert.deepEqual(
        endPoints.getEndpoint("AdminTooLS"),
        endPoints.endpoints.admintools
      );
    });
    it("should get endpoint for core if invalid type is supplied", function() {
      let endPoints = new EndPoints(SF);
      assert.deepEqual(
        endPoints.getEndpoint("invalid type"),
        endPoints.endpoints.core
      );
    });
  });

  describe("#getHeader()", function() {
    it("Should give valid header", function() {
      let endPoints = new EndPoints(SF);
      const postData = JSON.stringify({some: "data", goes: "here"});
      const header = endPoints.getHeader(postData);
      assert(header["Content-Type"]);
      assert(header["Content-Length"]);
      assert.equal(header["Content-Length"], Buffer.byteLength(postData));
    });
  });

  describe("#getContentType()", function() {
    it("Should give content type", function() {
      let endPoints = new EndPoints(SF);
      assert.equal(endPoints.getContentType(), "application/json");
    });
    it("Should give output format with override", function() {
      let endPoints = new EndPoints(SF, {outputFormat: "xml"});
      assert.equal(endPoints.getContentType(), "application/xml");
    });
  });

  /**
   * 
   * Test Aria Connector
   * 
   */
  describe("AriaConnector", function() {
    let tenant = {env: "SF", clientNo: 123435, authKey: "abc12345"};
    describe("Initialization", function() {
      it("Should construct with defaults properly", function() {
        const aria = new Aria(tenant, null, null, null);
        assert(aria.ariaEndpoints);
        assert.equal(aria.clientNo, tenant.clientNo);
        assert.equal(aria.authKey, tenant.authKey);
        assert.equal(aria.debug, false);
        assert.equal(aria.timeout, 120000);
      });
      it("Should construct with overrides properly", function() {
        const aria = new Aria(tenant, {outputFormat: "xml"}, true, 60000);
        assert.equal(aria.ariaEndpoints.outputFormat, "xml");
        assert.equal(aria.clientNo, tenant.clientNo);
        assert.equal(aria.authKey, tenant.authKey);
        assert.equal(aria.debug, true);
        assert.equal(aria.timeout, 60000);
      });
      it("Should construct with debug being anything truthy", function() {
        const aria = new Aria(tenant, null, "blah", null);
        assert.equal(aria.debug, true);
      });
    });
    describe("HTTP Response", function() {
      it("Should return an object if content type is json", function(done) {
        this.timeout(5000);
        new Aria(tenant)
          .call("core", "authenticate_caller", {})
          .then(data => {
            assert.equal(typeof data, "object");
            assert(data.error_code);
            assert(data.error_msg);
            done();
          })
          .catch(err => done(err));
      });
      it("Should return a string if content type is string", function(done) {
        this.timeout(5000);
        new Aria(tenant, {outputFormat: "xml"})
          .call("core", "authenticate_caller", {})
          .then(data => {
            assert.equal(typeof data, "string");
            done();
          })
          .catch(err => done(err));
      });
      it("Should return a string if content type is string", function(done) {
        this.timeout(5000);
        new Aria(tenant)
          .call(
            "core",
            "authenticate_caller",
            "some bogus non-object data type? will this puke?"
          )
          .then(data => {
            done(true);
          })
          .catch(err => done());
      });
      it("Should make api call if falsy payload is provided", function(done) {
        this.timeout(5000);
        new Aria(tenant)
          .call("core", "authenticate_caller", null)
          .then(data => {
            done();
          })
          .catch(err => done(err));
      });
    });
    describe("HTTP Callout", function() {
      it("Should properly callout to SF", function() {
        this.timeout(5000);
        tenant = {env: "SF", clientNo: 123435, authKey: "abc12345"};
        return new Aria(tenant).call("core", "authenticate_caller", {});
      });
      it("should callout to SC environment", function() {
        this.timeout(5000);
        tenant = {env: "SC", clientNo: 123435, authKey: "abc12345"};
        return new Aria(tenant).call("core", "authenticate_caller", {});
      });
      it("should callout to PROD environment", function() {
        this.timeout(5000);
        tenant = {env: "PROD", clientNo: 123435, authKey: "abc12345"};
        return new Aria(tenant).call("core", "authenticate_caller", {});
      });
      it("should callout to CHPSF environment", function() {
        this.timeout(5000);
        tenant = {env: "SF_CPH", clientNo: 123435, authKey: "abc12345"};
        return new Aria(tenant).call("core", "authenticate_caller", {});
      });
      it("should callout to CHPROD environment", function() {
        this.timeout(5000);
        tenant = {env: "PROD_CPH", clientNo: 123435, authKey: "abc12345"};
        return new Aria(tenant).call("core", "authenticate_caller", {});
      });
      it("should respond to callback", function(done) {
        this.timeout(5000);
        tenant = {env: "SF", clientNo: 123435, authKey: "abc12345"};
        new Aria(tenant).call("core", "authenticate_caller", {}, done);
      });
    });
  });
});
