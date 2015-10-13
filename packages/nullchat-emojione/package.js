Package.describe({
    summary: 'Contains nullchat wrapper of emojione',
    version: '0.0.2',
    name: 'nullchat:emojione'
});

Package.onUse(function (api) {
    api.use(['underscore', 'mongo']);
    api.imply('qnub:emojione');
    api.addFiles('emojis.js');
    api.addFiles('emojione-data.js', 'server');
    api.addFiles('emojione_import.js', 'server');
    api.export('Emojis');
});
