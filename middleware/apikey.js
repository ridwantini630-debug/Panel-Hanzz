const fs = require("fs");

const file = "./database/apikey.json";

module.exports = (req, res, next) => {
    const apikey = req.query.apikey;

    if (!apikey) {
        return res.json({
            status: false,
            message: "Masukkan API Key"
        });
    }

    const keys = JSON.parse(fs.readFileSync(file));

    const cek = keys.find(
        (item) => item.key === apikey
    );

    if (!cek) {
    return res.json({
        status: false,
        message: "API Key tidak valid"
    });
}

// Admin = unlimited
if (cek.role === "admin") {
    return next();
}
// Premium & Member memakai limit
if (cek.role === "premium" || cek.role === "member") {

    if (cek.limit <= 0) {
        return res.json({
            status: false,
            message: "Limit API Key habis"
        });
    }

    cek.limit--;

    fs.writeFileSync(
        file,
        JSON.stringify(keys, null, 2)
    );

    return next();
}

return res.json({
    status: false,
    message: "Role API Key tidak dikenali"
});
};
