Template.starsModalContent.created = function () {
    var instance = this;
    instance.searchText = new ReactiveVar(Meteor.user().username);
    instance.supressStarSizing = true;
};

Template.starsModalContent.rendered = function(){
    var instance = this;
    Meteor.setTimeout(function(){instance.searchText.set("");},1);
};
//function that returns a created index
var createIndex = function () {
    var index = lunr(function () {
        this.ref('_id');
        this.field('message');
        this.field('username',{boost:2});
    });
    return index;
};

Template.starsModalContent.helpers({
    //create a helper to get what the current search value is
    search: function () {
        var search = Template.instance().searchText.get();
        return search;
    },

    //create a helper that returns the search results
    starredMessages: function () {
        var index = Template.instance().searchIndex;
        if(!index) {
            index = Template.instance().searchIndex = createIndex();
        }
        var searchResults;
        var search = Template.instance().searchText.get();
        var results = [];
        var docs = Messages.find({likedBy: Meteor.userId()}).fetch();
        if (!search) {
            return docs;
        }
        else {
            _.each(docs, function (doc) {
                var user = Meteor.users.findOne({_id:doc.authorId});
                doc.username = (user && user.username)|| "";
                index.add(doc, user);
            });
            //process the search results
            //[{ref: 'mongoId', score: 0.923},...]
            searchResults = index.search(search);
            //for each of the search results score...
            _.each(searchResults, function (searchResult) {
                //only add if the results are above zero, zero means no result
                if (searchResult.score > 0) {
                    //add doc to the list of valid results
                    results.push(_.findWhere(docs, {_id: searchResult.ref}));
                }
            });
            return results;
        }
    }
});

Template.starsModalContent.events({
    //update the search session when the search input changes
    'keyup .search, change .search': function (event, template) {
        var search;
        search = event.target.value;
        template.searchText.set(search);
    }
});