var accountsHook = function(error, state){
    if (!error) {
        if (state === "signUp") {
            swal("Mail de vérification", "L'inscription est terminée, mais vous devez aller vérifier vos emails pour pouvoir vous connecter !", "success");
        }
    }
};

AccountsTemplates.configure({
    // ReCaptcha
    showReCaptcha: true,

    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: true,
    lowercaseUsername: false,

    // Appearance
    showAddRemoveServices: true,
    showForgotPasswordLink: true,
    showLabels: false,
    showPlaceholders: true,

    // Client-side Validation
    continuousValidation: true,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Hooks
    onSubmitHook: accountsHook
});