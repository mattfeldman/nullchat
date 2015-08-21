const permission = notify.permissionLevel();
if (permission === notify.PERMISSION_DEFAULT) {
    notify.requestPermission();
}
hasDesktopPermission = () => permission == notify.PERMISSION_GRANTED;
notify.config({pageVisibility: false, autoClose: 5000});