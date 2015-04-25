Template.BookForAddBtra.events({
        'click .bookforaddbtra': function(event, template) {
            if(!_.contains(event.currentTarget.classList, 'disabled')) {
                var templatecd = Template.parentData();
                Meteor.call("insertBtra", {book_id: templatecd._id, btra_id: this._id}, function(error, result) {
                    if (error) {
                        console.error(error);
                        swal(TAPi18n.__("utils.error"), TAPi18n.__("swal.importerror"), 'error');
                    } else {
                        Router.go("ViewBook", {_id: templatecd._id});
                        swal(TAPi18n.__("swal.imported.title"), TAPi18n.__("swal.imported.text"), 'success')
                    }
                });
            }
        }
    }
);
Template.BookForAddBtra.helpers({
        verif: function () {
            var disabled = '';
            var thisid = this._id;
            var selectedid = Template.parentData()._id;
            var book = Books.findOne(selectedid);
            if (selectedid == thisid) {
                disabled = 'disabled';
            } else {
                _.each(book.btra, function (btra) {
                    if (btra._id == thisid) {
                        disabled = 'disabled';
                    }
                });
            }
            return disabled;
        },
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
        }
    }
);