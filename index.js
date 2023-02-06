const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const cors = require('cors');

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use(cors({
    origin: '*'
}));
