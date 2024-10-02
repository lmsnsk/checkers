const express = require("express");

import { wssConnection } from "./connection/websockets";

const app = express();
const PORT = process.env.PORT ?? 3001;

wssConnection();

app.listen(PORT, () => {
  console.log("Server started on http://localhost:" + PORT);
});
