const AppConfig = {
    usernameLength: {
        min: 8,
        max: 16
    },
    passwordLength: {
        min: 8,
        max: 128
    },
    MODE: {
        TEST: "TEST",
        PROD: "PRODUCTION"
    },
    ALLOWED_CLIENTS: ["web", "mobile-android", "mobile-ios", "mobile-react"]

}

export default AppConfig