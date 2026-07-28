const express = require("express");
const isLogin = require("./middleware/auth");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const iqcRoutes = require("./routes/iqc"); // tambahkan ini
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: "hanzz-panel-secret",
    resave: false,
    saveUninitialized: false
}));
app.get("/", isLogin, (req, res) => {
    res.render("index", {
        title: "Panel Hanzz",
        user: req.session.user
 });
});
app.get("/docs", isLogin, (req, res) => {
    res.render("docs");
});


app.get("/bot", isLogin, (req, res) => {
    res.render("bot");
});

app.use("/", authRoutes);
app.use("/", apiRoutes);
app.use("/brat", require("./routes/brat"));
app.use("/bratvid", require("./routes/bratvid"));

app.use("/", iqcRoutes);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Panel berjalan di http://localhost:${PORT}`);
    });
}

module.exports = app;
