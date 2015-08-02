Template.starsModalContent.onCreated(function () {
    const instance = this;
    instance.searchText = new ReactiveVar(Meteor.user().username);
    instance.supressStarSizing = true;
});

Template.starsModalContent.onRendered(function () {
    const instance = this;
    Meteor.setTimeout(()=> {
        instance.searchText.set("");
    }, 1);
});
// function that returns a created index
function createIndex() {
    return lunr(function () {
        this.ref('_id');
        this.field('message');
        this.field('username', {boost: 2});
    });
}

Template.starsModalContent.helpers({
    search() {
        const search = Template.instance().searchText.get();
        return search;
    },
    starredMessages() {
        let index = Template.instance().searchIndex;
        if (!index) {
            index = Template.instance().searchIndex = createIndex();
        }
        let searchResults;
        const search = Template.instance().searchText.get();
        const results = [];
        const docs = Messages.find({likedBy: Meteor.userId()}).fetch();

        if (!search) {
            return docs;
        }
        _(docs).each(doc => {
            const user = Meteor.users.findOne({_id: doc.authorId});
            doc.username = (user && user.username) || "";
            index.add(doc, user);
        });
        // process the search results
        // [{ref: 'mongoId', score: 0.923},...]
        searchResults = index.search(search);
        // for each of the search results score...
        _(searchResults).each(searchResult => {
            // only add if the results are above zero, zero means no result
            if (searchResult.score > 0) {
                // add doc to the list of valid results
                results.push(_.findWhere(docs, {_id: searchResult.ref}));
            }
        });
        return results;
    }
});

Template.starsModalContent.events({
    // update the search session when the search input changes
    'keyup .search, change .search'(event, template) {
        const search = event.target.value;
        template.searchText.set(search);
    }
});
