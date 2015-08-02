Template.giphyModalContent.onCreated(function () {
    const instance = this;
    instance.searchText = new ReactiveVar("");
    instance.searchResults = new ReactiveVar([]);
});

Template.giphyModalContent.helpers({
    searchResults() {
        return Template.instance().searchResults.get();
    }
});

const debouncedSearch = _.debounce((search, template) => {
    template.searchResults.set([]);
    HTTP.get("https://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=dc6zaTOxFJmzC&limit=20", {}, (error, result) => {
        if (!error) {
            template.searchResults.set(result.data.data);
            Meteor.setTimeout(() => {
                $('.giphyModal.modal').modal('refresh');
            }, 0);
        }
    });
}, 300);

Template.giphyModalContent.events({
    // update the search session when the search input changes
    'keyup .search, change .search'(event, template) {
        const search = event.target.value;

        // Prevent unneeded recomputation
        if (template.searchText.get() === search) { return; }

        template.searchText.set(search);
        debouncedSearch(search, template);
    }
});
