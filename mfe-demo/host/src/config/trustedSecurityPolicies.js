
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    window.trustedTypes.createPolicy('default', {
        createHTML(s) { return s },
        createScript(s) { return s },
        createScriptURL(s) { return s }
    });
}