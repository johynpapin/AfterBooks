Template.registerHelper('CommentsByDoc', function(_id) {
    if (typeof window['Comments'] !== 'undefined') {
        return Comments.find({
            doc: _id
        }, {
            sort: {
                createdAt: -1
            }
        }).fetch();
    }
});

Template.registerHelper('CommentsByUser', function(_id) {
    if (typeof window['Comments'] !== 'undefined') {
        return Comments.find({
            owner: _id
        }, {
            sort: {
                createdAt: -1
            }
        }).fetch();
    }
});

Template.registerHelper('CommentsByCollection', function(collection) {
    var Comments, comments;
    if (typeof window['Comments'] !== 'undefined') {
        Comments = [];
        comments = window['Comments'].find({
            owner: Meteor.userId()
        }, {
            sort: {
                createdAt: -1
            }
        }).fetch();
        collection = window[collection];
        _.each(comments, function(favorite) {
            if (collection.findOne({
                    _id: favorite.doc
                })) {
                return Comments.push(collection.findOne({
                    _id: favorite.doc
                }));
            }
        });
        return Comments;
    }
});

Template.registerHelper('commentsCount', function(_id) {
    if (typeof window['Comments'] !== 'undefined') {
        return Comments.find({
            doc: _id
        }).fetch().length;
    }
});

Template.registerHelper('commentingOn', function(_id) {
    return Session.equals('commentingOn', _id);
});

Template.registerHelper('mustbeconnectedclass', function() {
        var mbcclass = '';
        if(!Meteor.user()) {
            mbcclass = 'simptip-position-top simptip-fade simptip-smooth simptip-warning';
        }
        return mbcclass;
    }
);
Template.registerHelper('mustbeconnecteddata', function() {
        var mbcdata = '';
        if(!Meteor.user()) {
            mbcdata = TAPi18n.__("utils.mustbeconnected");
        }
        return mbcdata;
    }
);
Template.registerHelper('placeholder', function() {
        return TAPi18n.__("search.placeholder");
    }
);
Template.registerHelper('isMignon', function() {
        return Session.get('isMignon');
    }
);

var myHook = {
    before: {
        insert: function (doc) {
            doc.bookInitiator = Meteor.userId();
            this.result(doc);
        }
    },
    onSuccess: function (formType, result) {
        Router.go("ViewBook", {_id: result});
        swal(TAPi18n.__("utils.itsok"), TAPi18n.__("modals.importtext"), 'success')
    },
    onError: function (formType, error) {
        console.error(error);
        swal(TAPi18n.__("utils.error"), "Une erreur est survenue pendant l'importation. Veuillez réessayer.", 'error');
    },
    beginSubmit: function () {
        $('.insertbookformsubmit').toggleClass('disabled');
    },
    endSubmit: function () {
        $('.insertbookformsubmit').toggleClass('disabled');
    }
};

AutoForm.hooks({
    insertBookForm: myHook
});

TAPi18n._afterUILanguageChange = function() {
    Meteor.call("serversession", {
        key: 'language',
        value: TAPi18n.getLanguage()
    }, function (error, results) {});
    Session.set("showspashscreen", false);
    accountsUIBootstrap3.setLanguage(TAPi18n.getLanguage());
    T9n.setLanguage(TAPi18n.getLanguage());
};