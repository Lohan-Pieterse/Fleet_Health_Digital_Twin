### routes/heartbeat_Routes.js

- / (POST)
  - This api would take the heartbeat data of the host
    - The input should look something like this
      - {
          "host": "api-01",
          "timestamp": "2025-03-10T15:04:05Z",
          "cpu_load": 0.42,
          "mem_used_mb": 512,
          "services": [
          {"name": "api", "healthy": true},
          {"name": "worker", "healthy": false}
          ],
          "ip": "10.0.0.21"
          }

- / (GET)
  - This would get all the last heartbeat of all the unique host_ids 

- /latest/:hostId (GET)
  - This would get the last heartbeat of just one host with the hostId that you would have to give 

### routes/host_Routes.js

- /report (POST)
  - This api call works the same as 

- / (POST)
  - This is used to create a new host that could be monitored then

- / (GET)
  - Gets all the hosts in the db, you can add a limit on how many hosts would be shown. The default is 50

- /status/:hostId (GET)
  - This would get the host with the last status that the host had

### routes/incident_Routes.js

- /error (POST)
  - Add a new incident to the db
    - Example of input received
      - {
        "host": "api-01",
        "timestamp": "2025-03-10T15:05:00Z",
        "type": "error",
        "message": "upstream timeout contacting db"
        }

- / (GET)
  - Retrieve recent incidents across all hosts (you can limit the amount of data that you want)

- /latest (GET)
  - gets the last incident based on every unique host_id so then you have a list of all the incidents but each is the last record of that device

### routes/server_Routes.js

- /health (GET)
  - Uses a select 1 to do a sql query against the db
    - When DB is reachable:
      - { "status": "ok", "db": "ok", "uptime": <seconds> }
    - When DB is not reachable
      - { "status": "degraded", "db": "unreachable", "error": "<error message>" }
