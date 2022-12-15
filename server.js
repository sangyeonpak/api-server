import postgres from "postgres";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

const sql = postgres({ database: "inventory", username: "sangyeonpak", password: "asdf"});
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("./client"));
app.use(morgan('tiny'));


app.get("/api/kitchen", (req, res, next) => {
  sql`SELECT * FROM kitchen`.then((result) => {
    res.json(result);
  }).catch(next);
})



app.get("/api/kitchen/:item", (req, res, next) => {
  const item = req.params.item;
  // console.log(isNaN(Number(item)));
  // console.log(Number(item) === NaN); found out this doesn't work
  if (isNaN(Number(item))) {
    sql`SELECT * FROM kitchen WHERE item ILIKE ${'%' + item + '%'}`.then((result) => { // funny because it took a while for me to figure it out
      if (result.length > 0) res.status(200).json(result);
      else (res.status(404).send("Item not found in your kitchen inventory. Would you like to add it with a POST command?"));
    }).catch(next);
  }
  else res.status(400).send("Don't search the item's ID. Search the item's name instead!");
})



app.post("/api/kitchen", (req, res, next) => {
  const { item, count } = req.body;
  if (item !== '' && count !== undefined && Number.isInteger(count)){
    sql`INSERT INTO kitchen (item, count) VALUES (${item}, ${count}) RETURNING *`.then((result) => {
      res.status(201).json(result[0]);
    }).catch(next)
  }
  else res.status(400).send("Bad request: make sure you put a integer for your count!")
})



app.patch("/api/kitchen/:item", (req, res, next) => {
  const item = req.params.item;
  const count = req.body.count;
  sql`UPDATE kitchen SET count = ${count} WHERE item ILIKE ${item} RETURNING *`.then((result) => {
    res.status(201).json(result[0]);
  }).catch(next)
})



app.delete("/api/kitchen/:item", (req, res, next) => {
  const item = req.params.item;
  sql`DELETE FROM kitchen WHERE item ILIKE ${item}`.then((result) => {
    res.status(202).send(`Deleted ${item} from kitchen`);
  }).catch(next)
})



app.get("/api/bathroom", (req, res, next) => {
  sql`SELECT * FROM bathroom`.then((result) => {
    res.json(result);
  }).catch(next);
})



app.get("/api/bathroom/:item", (req, res, next) => {
  const item = req.params.item;
  // console.log(isNaN(Number(item)));
  // console.log(Number(item) === NaN); found out this doesn't work
  if (isNaN(Number(item))) {
    sql`SELECT * FROM bathroom WHERE item ILIKE ${'%' + item + '%'}`.then((result) => { // funny because it took a while for me to figure it out
      if (result.length > 0) res.status(200).json(result);
      else (res.status(404).send("Item not found in your bathroom inventory. Would you like to add it with a POST command?"));
    }).catch(next);
  }
  else res.status(400).send("Don't search the item's ID. Search the item's name instead!");
})



app.post("/api/bathroom", (req, res, next) => {
  const { item, count } = req.body;
  if (item !== '' && count !== undefined && Number.isInteger(count)){
    sql`INSERT INTO bathroom (item, count) VALUES (${item}, ${count}) RETURNING *`.then((result) => {
      res.status(201).json(result[0]);
    }).catch(next)
  }
  else res.status(400).send("Bad request: make sure you put a integer for your count!")
})



app.patch("/api/bathroom/:item", (req, res, next) => {
  const item = req.params.item;
  const count = req.body.count;
  sql`UPDATE bathroom SET count = ${count} WHERE item ILIKE ${item} RETURNING *`.then((result) => {
    res.status(201).json(result[0]);
  }).catch(next)
})



app.delete("/api/bathroom/:item", (req, res, next) => {
  const item = req.params.item;
  sql`DELETE FROM bathroom WHERE item ILIKE ${item}`.then((result) => {
    res.status(202).send(`Deleted ${item} from bathroom`);
  }).catch(next)
})



app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal server error. Sorry!")
})



app.all('*', (req, res) => {
  res.status(404).send("Not found!");
})



app.listen(port, () => {
  console.log("Listening on port ", port);
});