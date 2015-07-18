Deps.autorun(function (c) {
    try {
        UserStatus.startMonitor({
            threshold: 30000,
            interval: 1000,
            idleOnBlur: false
        });
        c.stop();
    }
    catch (Exception) {}
});