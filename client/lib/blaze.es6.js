/**
 * Get the parent template instance
 * @param {Number} [levels] How many levels to go up. Default is 1
 * @returns {Blaze.TemplateInstance}
 */

Blaze.TemplateInstance.prototype.parentTemplate = function(levels) {
    let view = Blaze.currentView;
    let currentLevel = levels;
    if (typeof levels === "undefined") {
        currentLevel = 1;
    }
    while (view) {
        if (view.name.substring(0, 9) === "Template." && !(currentLevel--)) {
            return view.templateInstance();
        }
        view = view.parentView;
    }
};
