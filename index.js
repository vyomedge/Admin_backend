const app = require("./app");
require("dotenv").config();
console.log(process.env.PORT);
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
