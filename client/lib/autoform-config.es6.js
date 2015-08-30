Meteor.startup(function () {
    AutoForm.setDefaultTemplate("semanticUI");

    AutoForm.addHooks(null, {
        onError(formType, error) {
            AlertFeedback(error, null);
        }
    });
});
