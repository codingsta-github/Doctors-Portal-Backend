const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require("mongodb");

const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.q9cpv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    client.connect();
    const appointmentCollection = client
      .db("doctors_portal")
      .collection("appointments");
    const bookingCollection = client
      .db("doctors_portal")
      .collection("bookings");

    app.get("/appointment", async (req, res) => {
      const query = {};
      const cursor = appointmentCollection.find(query);
      const results = await cursor.toArray();
      res.send(results);
    });

    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const query = {
        treatment: booking.treatment,
        date: booking.date,
        patient: booking.patient,
      };
      const isExists =await bookingCollection.findOne(query);
      if (isExists) {
        return res.send({
          success: false,
          booking: isExists,
        });
      }
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`port ${port}`);
});
