Template.ViewBook.helpers({
    authors: function() {
        var authors = TAPi18n.__("utils.authors.nobody");
        if(this.authors.length == 1) {
            authors = TAPi18n.__("utils.authors.from") + " " + this.authors[0] +".";
        } else {
            var i = 0;
            var thisfe = this;
            authors = TAPi18n.__("utils.authors.from") + " ";
            _.each(this.authors, function(author) {
                if(thisfe.authors.length - 2 == i) {
                    authors += author + " " + TAPi18n.__("utils.authors.and") + " ";
                } else if(thisfe.authors.length - 1 == i) {
                    authors += author;
                } else {
                    authors += author + ", ";
                }
                i++;
            });
            authors += ".";
        }
        return authors;
    },
    isInitiator: function() {
        if (Meteor.userId() && Meteor.userId() == this.bookInitiator) {
            return true;
        } else {
            return false;
        }
    },
    voteclass: function() {
        var voteclass = '';
        var book_id = this._id;
        if (Meteor.user()) {
            var book = Books.findOne(book_id);
            if (book.bookInitiator == Meteor.userId()) {
                voteclass = "fa fa-lock disabled";
            } else if (book.bookRaters == undefined || !_.contains(book.bookRaters, Meteor.userId())) {
                voteclass = "fa fa-arrow-up";
            } else {
                voteclass = "fa fa-arrow-down";
            }
        } else {
            voteclass = "fa fa-lock disabled";
        }
        return voteclass;
    },
    editmode: function() {
        return Session.get('editmode');
    }
});

Template.ViewBook.events({
    'click .editbook': function(event, template) {
        if(Session.get('editmode') != true) {
            Session.set('editmode', true);
        } else {
            Meteor.call('updateBook', {book_id: this._id, title: $('.editabletitle').text(), summary: $('#editablesummary').editable("getHTML", true, true)});
            Session.set('editmode', false);
        }
    },
    'click .vote': function(event, template) {
        Session.set('homevoteevent', true);
        if(_.contains(event.currentTarget.classList, 'fa-arrow-up')) {
            Meteor.call("rateBook", {book_id: this._id, vote_type: 'up'}, function(error, results) {
                if (error) {
                    console.error(error);
                }
            });
        } else if (_.contains(event.currentTarget.classList, 'fa-arrow-down')) {
            Meteor.call("rateBook", {book_id: this._id, vote_type: 'down'}, function(error, results) {
                if (error) {
                    console.error(error);
                }
            });
        }
    }
});

// Template : Btra
Template.Btra.helpers({
    thumb: function() {
        var btra = Books.findOne(this._id);
        return btra.thumb;
    },
    title: function() {
        var btra = Books.findOne(this._id);
        return btra.title;
    },
    authors: function() {
        var btra = Books.findOne(this._id);
        var authors = TAPi18n.__("utils.authors.nobody");
        if(btra.authors.length == 1) {
            authors = TAPi18n.__("utils.authors.from") + " " + btra.authors[0] +".";
        } else {
            var i = 0;
            authors = TAPi18n.__("utils.authors.from") + " ";
            _.each(btra.authors, function(author) {
                if(btra.authors.length - 2 == i) {
                    authors += author + " " + TAPi18n.__("utils.authors.and") + " ";
                } else if(btra.authors.length - 1 == i) {
                    authors += author;
                } else {
                    authors += author + ", ";
                }
                i++;
            });
            authors += ".";
        }
        return authors;
    },
    voteclass: function() {
        var voteclass = '';
        var btra_id = this._id;
        if(Meteor.user()) {
            var book = Books.findOne(Template.parentData()._id);
            _.each(book.btra, function(btra) {
                if(btra._id == btra_id) {
                    if(btra.initiator == Meteor.userId()) {
                        voteclass = "fa fa-lock disabled";
                    } else if(book.btraRaters == undefined || !_.contains(book.btraRaters, Meteor.userId())) {
                        voteclass = "fa fa-arrow-up";
                    } else {
                        voteclass = "fa fa-arrow-down";
                    }
                }
            });
        } else {
            voteclass = "fa fa-lock disabled";
        }
        return voteclass;
    }
});

Template.Btra.events({
    'click .vote': function(event, template) {
        Session.set('voteevent', true);
        if(_.contains(event.currentTarget.classList, 'fa-arrow-up')) {
            Meteor.call("rateBtra", {book_id: Template.parentData()._id, btra_id: this._id, vote_type: 'up'}, function(error, results) {
                if (error) {
                    console.error(error);
                }
            });
        } else if (_.contains(event.currentTarget.classList, 'fa-arrow-down')) {
            Meteor.call("rateBtra", {book_id: Template.parentData()._id, btra_id: this._id, vote_type: 'down'}, function(error, results) {
                if (error) {
                    console.error(error);
                }
            });
        } else {
        }
    },
});

Template.Btra.rendered = function() {
    if(Session.get('tooltipbtra') != true) {
        Tipped.create('.btra-tooltip', function() {
            return {
                title: $(this).children('.tooltip-title').html(),
                content: $(this).children('.tooltip-content').html()
            };
        }, {
            behavior: 'sticky'
        });
        Session.set('tooltipbtra', true);
    }
};

Template.Btra.destroyed = function() {
    if(Session.get('tooltipbtra') == true) {
        Tipped.remove('.btra-tooltip');
        Session.set('tooltipbtra', false);
    }
};

Template.Froala.rendered = function() {
    $('#editablesummary').editable({theme: 'dark', inlineMode: false});
};
Template.Froala.destroyed = function() {
    $('#editablesummary').editable('destroy');
};