Template.giphyModalContent.created = function () {
    var instance = this;
    instance.searchText = new ReactiveVar("");
    instance.searchResults = new ReactiveVar([]);
};

Template.giphyModalContent.helpers({
    searchResults:function(){
        return Template.instance().searchResults.get();
    }
});

var debouncedSearch = _.debounce(function(search,template) {
    HTTP.get("https://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=dc6zaTOxFJmzC&limit=20", {}, function (error, result) {
        if (!error) {
            template.searchResults.set(result.data.data);
        }
    });
},300);
Template.giphyModalContent.events({
    //update the search session when the search input changes
    'keyup .search, change .search': function (event, template) {
        var search;
        search = event.target.value;

        // Prevent unneeded recomputation
        if(template.searchText.get() === search) { return; }

        template.searchText.set(search);
        debouncedSearch(search,template);
        template.searchResults.set([]);
    }
});