docker run -it --name mongo1 mongo

---

```markdown
# 🧠 MongoDB Master-Slave (Replica Set) Setup with Docker Compose

This project demonstrates how to set up a **MongoDB Replica Set** locally using **Docker Compose**, simulating a **Master-Slave (Primary-Secondary)** configuration. It also covers failover testing and basic observability using **Mongoose command monitoring**.

---

## 📁 Project Structure
```

.
├── docker-compose.yml # MongoDB replica set configuration
├── README.md # Documentation

````

---

## 🚀 Step 1: Setup Docker Compose

Create a file named **`docker-compose.yml`** with the following content:

```yaml
version: "3.8"
services:
  mongo1:
    image: mongo:7.0
    container_name: mongo1
    ports:
      - "27017:27017"
    command: ["--replSet", "rs0", "--bind_ip_all"]
    networks:
      - mongo-cluster

  mongo2:
    image: mongo:7.0
    container_name: mongo2
    ports:
      - "27018:27017"
    command: ["--replSet", "rs0", "--bind_ip_all"]
    networks:
      - mongo-cluster

  mongo3:
    image: mongo:7.0
    container_name: mongo3
    ports:
      - "27019:27017"
    command: ["--replSet", "rs0", "--bind_ip_all"]
    networks:
      - mongo-cluster

networks:
  mongo-cluster:
    driver: bridge
````

---

## ▶️ Step 2: Start MongoDB Containers

Run the following command to start all MongoDB instances:

```bash
docker compose up -d
```

This will start three MongoDB containers (`mongo1`, `mongo2`, and `mongo3`).

Check running containers:

```bash
docker ps
```

---

## ⚙️ Step 3: Initialize Replica Set

Connect to the first container (`mongo1`):

```bash
docker exec -it mongo1 mongosh
```

Inside the Mongo shell, run the following to initiate the replica set:

below command will make mongo1 as master db and other two dbs as slave db

```javascript
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017", priority: 2 }, // Primary
    { _id: 1, host: "mongo2:27017", priority: 1 },
    { _id: 2, host: "mongo3:27017", priority: 1 },
  ],
});
```

Check the status:

```javascript
rs.status();
```

You’ll see one **PRIMARY** (master) and two **SECONDARY** (slaves).

---

## 🔁 Step 4: Test Failover

To simulate a failover, stop the current primary node:

```bash
docker stop mongo1
```

Then connect to another node (e.g., `mongo2`) and run:

```bash
docker exec -it mongo2 mongosh
rs.status();
```

You should see that one of the secondary nodes has automatically been promoted to **PRIMARY**.

---

## 🧩 Step 5: Check Container IPs (Optional)

If you need to know the IP address of a container:

```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container-name>
```

Example:

```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mongo1
```

---

## 🧠 Step 6: Add Observability (Using Mongoose)

Below is an example of connecting via **Mongoose** and monitoring which MongoDB node serves the request:

```javascript
import mongoose from "mongoose";

const uri =
  "mongodb://localhost:27017,localhost:27018,localhost:27019/test?replicaSet=rs0";

await mongoose.connect(uri, {
  readPreference: "secondaryPreferred",
  monitorCommands: true,
});

const client = mongoose.connection.getClient();

client.on("commandStarted", (event) => {
  console.log(
    `[MongoDB] Command ${event.commandName} sent to ${event.address}`
  );
});

console.log("Connected to MongoDB Replica Set");
```

This will log which node (Primary or Secondary) is serving the read requests.

---

## 🧩 Additional Notes

- **Primary Node** → Handles all write operations.
- **Secondary Nodes** → Handle read operations (depending on `readPreference`).
- MongoDB automatically handles **failover** when a primary goes down.

---

## 🧼 Cleanup

To stop and remove all containers:

```bash
docker compose down
```

---

## 🧾 References

- [MongoDB Replica Set Documentation](https://www.mongodb.com/docs/manual/replication/)
- [Docker Hub - MongoDB Image](https://hub.docker.com/_/mongo)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
