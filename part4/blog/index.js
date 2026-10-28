const app = require("./app");
const config = require("./utility/config");

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
