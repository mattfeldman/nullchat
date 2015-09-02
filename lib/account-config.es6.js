AccountsTemplates.configure({
    // One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
    // passwordSignupFields: 'USERNAME_ONLY',
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,

    // Appearance
    showAddRemoveServices: false,
    // Email field required for this to work
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    /* privacyUrl: 'privacy', // TODO
     termsUrl: 'terms-of-use',*/ // TODO

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000
});

// This removes the password field but returns it,
// so that you can re-add it later, preserving the
// desired order of the fields
const pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
    {
        _id: "username",
        type: "text",
        displayName: "username",
        required: true,
        minLength: 2
    },
    pwd
]);

AccountsTemplates.configureRoute('changePwd');
// Don't really know the difference between enrollAccount vs signUp
// AccountsTemplates.configureRoute('enrollAccount');
// Email field required for this to work
// AccountsTemplates.configureRoute('forgotPwd');
// AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
// AccountsTemplates.configureRoute('verifyEmail');
