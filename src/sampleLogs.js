export const SAMPLE_LOGS = [
  {
    id: "node-mongo",
    label: "Node.js MongoDB Crash",
    tag: "Database",
    log: `MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
    at Timeout._onTimeout (/app/node_modules/mongodb/lib/sdam/topology.js:278:38)
    at listOnTimeout (node:internal/timers:573:17)
    at process.processTimers (node:internal/timers:514:7) {
  reason: TopologyDescription {
    type: 'Unknown',
    servers: Map(1) {
      '127.0.0.1:27017' => ServerDescription {
        address: '127.0.0.1:27017',
        error: Error: connect ECONNREFUSED 127.0.0.1:27017
      }
    }
  },
  code: undefined
}`
  },
  {
    id: "react-typeerror",
    label: "React TypeError: undefined.map",
    tag: "Frontend",
    log: `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (src/components/UserList.jsx:14:26)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
    at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21637:16)
    at HTMLUnknownElement.callCallback (node_modules/react-dom/cjs/react-dom.development.js:4164:14)`
  },
  {
    id: "python-keyerror",
    label: "Python FastAPI KeyError",
    tag: "Backend",
    log: `Traceback (most recent call last):
  File "/usr/local/lib/python3.11/site-packages/uvicorn/protocols/http/h11_impl.py", line 407, in run_asgi
    result = await app(  # type: ignore[func-returns-value]
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/app/main.py", line 42, in get_user_profile
    user_email = user_data["attributes"]["contact"]["email"]
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^
KeyError: 'contact'`
  }
];
