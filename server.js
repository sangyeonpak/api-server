//?sudo service postgresql start
import postgres from "postgres";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

// const sql = postgres(process.env.DATABASE_URL) = production db;
const sql = postgres({database: "inventory", username: process.env.DB_USERNAME, password: process.env.DB_PASSWORD});
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("./client"));
app.use(morgan('tiny'));

app.get("/api/main", (req, res, next) => {
  sql`SELECT * FROM items`.then((result) => {
    res.json(result);
  }).catch(next);
})

app.get("/api/items/:item", (req, res, next) => {
  const item = req.params.item;
  if (item === '' || item === null) res.status(400).send("Type something!");
  sql`SELECT * FROM items WHERE name ILIKE ${'%' + item + '%'}`.then((result) => {
    if (result.length === 0) res.status(404).json(result);
    else res.status(200).json(result);
  }).catch(next);
})

app.post("/api/items", (req, res, next) => {
  const {name,kitchen,bathroom} = req.body;
  if (name !== ''){
    sql`INSERT INTO items (name,kitchen,bathroom) VALUES (${name},${kitchen},${bathroom}) RETURNING *`.then((result) => {
      res.status(201).json(result[0]);
    }).catch(next)
    // TODO: experimenting with dynamic columns... psql doesn't like that
    //console.log(req.body);
    // let variableColumns = [];
    // let variableValuesArray = [];
    // for (let keys in req.body){
    //   // console.log(keys);
    //   variableColumns.push(keys);
    //   if (req.body[keys] === '') req.body[keys] = 0;
    //   variableValuesArray.push(req.body[keys]);
    // }
    // // console.log(variableColumns);
    // // console.log(variableColumns.toString());
    // variableValuesArray.shift();
    // let variableValues = (variableValuesArray.toString());
    // console.log(variableValues);
    // console.log(`INSERT INTO items (${variableColumns}) VALUES ('${name}',${variableValues}) RETURNING *`);
    // let string = `INSERT INTO items (${variableColumns}) VALUES ('${name}',${variableValues}) RETURNING *`;
    // console.log(string);
    // sql`${string}`.then((result) => {
    //   console.log(result);
    //   res.status(201).json(result[0]);
    // }).catch(next)
    // sql`INSERT INTO items (${variableColumns}) VALUES (${name},${variableValues}) RETURNING *`.then((result) => {
    //   console.log(result);
    //   res.status(201).json(result[0]);
    // }).catch(next)*/
  }
})

app.patch("/api/items/:item", (req, res, next) => {
  const {name, location, operator} = req.body;
  if (location === 'kitchen' && operator === '+'){
    sql`UPDATE items SET kitchen=kitchen+1 WHERE name=${name} RETURNING *`.then((result) => {
      res.status(201).json(result[0]);
    }).catch(next);
  }
  if (location === 'kitchen' && operator === '-'){
    sql`UPDATE items SET kitchen=kitchen-1 WHERE name=${name} RETURNING *`.then((result) => {
      res.status(201).json(result[0]);
    }).catch((error) => {
      res.status(100).send('Hit non-negative constraint');
    })
  }
  if (location === 'bathroom' && operator === '+'){
    sql`UPDATE items SET bathroom=bathroom+1 WHERE name=${name} RETURNING *`.then((result) => {
      res.status(201).json(result[0]);
    }).catch(next);
  }
  if (location === 'bathroom' && operator === '-'){
    sql`UPDATE items SET bathroom=bathroom-1 WHERE name=${name} RETURNING *`.then((result) => {
      res.status(201).json(result[0]);
    }).catch((error) => {
      res.status(100).send('Hit non-negative constraint');
    })
  }
})

app.delete("/api/items/:item", (req, res, next) => {
  const item = req.params.item;
  console.log(item);
  console.log(req.params.body);
  sql`DELETE FROM items WHERE item ILIKE ${item}`.then((result) => {
    res.status(202).send(`Deleted ${item} from items`);
  }).catch(next)
})

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json(req.body)
})

app.all('*', (req, res) => {
  res.status(404).send("Not found!");
})

app.listen(port, () => {
  console.log("Listening on port ", port);
});