Template.body.onCreated(function(){
    const self = this;
    const chimeSound = new buzz.sound('/sounds/chime_bell_ding.wav');
    let now = new Date().getTime();
    self.subscribe('notifications');
    Notifications.find({timestamp: {$gt: now}}).observe({
        added(document) {
            if (self.subscriptionsReady) {
                console.log('fuck2');
                // HACK: should be replaced by a full 'seen' message sub system
                if ((now - document.timestamp) < 10000) {
                    chimeSound.play();
                    if (roomPreferencesOrDefault(document.roomId).desktopNotificationMention) {
                        if (hasDesktopPermission) {
                            const title = `${document.authorName}(#${document.roomName})`;
                            const avatarUrl = UserHelpers.avatarForUserId(document.authorId);
                            notify.createNotification(title, {
                                body: document.message,
                                icon: avatarUrl,
                                tag: document.messageId
                            });
                        }
                    }
                }
            }
        }
    });
});