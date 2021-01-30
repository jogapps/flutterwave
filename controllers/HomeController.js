exports.index = (req, res, next) => {
    res.status(200).json({
        message: "My Rule-Validation API",
        status: "success",
        data: {
            name: "Jemifor Godspower",
            github: "@jogapps",
            email: "jogappsdeveloper@gmail.com",
            mobile: "08102362015",
            twitter: "@JemiforGodspowa"
        }
    });
}