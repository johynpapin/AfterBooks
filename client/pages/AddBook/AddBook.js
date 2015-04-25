function launchAmazonSearch() {
    Session.set('amazonsubmited', true);
    Session.set('amazonnoresults', false);
    Session.set('amazonsearchresults', false);
    Meteor.call('amazon', {keywords: $('#amazonsearchtitle').val(), page: Session.get('amazoncurrentpage')}, function(error, results) {
            if (error) {
                console.error(error);
            } else {
                if(results.ItemSearchResponse.Items[0].TotalResults[0] != "0") {
                    if(results.ItemSearchResponse.Items[0].TotalPages[0] > 10) {
                        Session.set('amazontotalpages', 10);
                    } else {
                        Session.set('amazontotalpages', results.ItemSearchResponse.Items[0].TotalPages[0]);
                    }
                    Session.set('amazonsearchresults', results.ItemSearchResponse.Items[0].Item);
                    Session.set('amazonnoresults', false);
                } else {
                    Session.set('amazonsearchresults', false);
                    Session.set('amazontotalpages', false);
                    Session.set('amazonnoresults', true);
                }
            }
        }
    );
}
function launchGoogleSearch() {
    Session.set('googlesubmited', true);
    Session.set('googlenoresults', false);
    Session.set('googlesearchresults', false);
    Meteor.call('googlebooks', {query: $('#googlesearchtitle').val(), page: Session.get('googlecurrentpage')}, function(error, results) {
            if (error) {
                console.error(error);
            }
            else {
                var data = JSON.parse(results.content);
                if(data.totalItems != 0) {
                    if(data.totalItems / 10 > 10) {
                        Session.set('googletotalpages', 10);
                    } else {
                        Session.set('googletotalpages', Math.ceil(data.totalItems / 10));
                    }
                    Session.set('googlesearchresults', data.items);
                    Session.set('googlenoresults', false);
                } else {
                    Session.set('googlesearchresults', false);
                    Session.set('googletotalpages', false);
                    Session.set('googlenoresults', true);
                }
            }
        }
    );
}

Template.AddBook.rendered = function() {
    if($('#googlesearchtitle').val() != '') {
        launchGoogleSearch()
    }
    if($('#amazonsearchtitle').val() != '') {
        launchAmazonSearch();
    }
};

Template.AddBook.helpers({
        googlesubmited: function() {
            return Session.get('googlesubmited');
        },
        googlesearchresults: function() {
            return Session.get('googlesearchresults');
        },
        googlenoresults: function() {
            return Session.get('googlenoresults');
        },
        googlepaginator: function() {
            if(Session.get('googletotalpages') == '0' || Session.get('googletotalpages') == '1') {
                return '';
            } else {
                var toReturn = '<center><nav><ul class="googlepaginator pagination pagination-lg">';
                if(Session.get('googlecurrentpage') == 1) {
                    toReturn += '<li class="disabled"><a aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
                } else {
                    toReturn += '<li><a class="googlepageprevious" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
                }
                for (i = 1; i <= parseInt(Session.get('googletotalpages')); i++) {
                    if(i == parseInt(Session.get('googlecurrentpage'))) {
                        toReturn += '<li class="active"><a>' + i.toString() + '</a></li>';
                    } else {
                        toReturn += '<li><a class="googlepagenum">' + i.toString() + '</a></li>';
                    }
                }
                if (Session.get('googlecurrentpage') == Session.get('googletotalpages')) {
                    toReturn += '<li class="disabled"><a aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
                } else {
                    toReturn += '<li><a class="googlepagenext" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
                }
                toReturn += '</ul></nav></center>';
                return toReturn;
            }
        },
        amazonsubmited: function() {
            return Session.get('amazonsubmited');
        },
        amazonsearchresults: function() {
            return Session.get('amazonsearchresults');
        },
        amazonnoresults: function() {
            return Session.get('amazonnoresults');
        },
        amazonpaginator: function() {
            if(Session.get('amazontotalpages') == '0' || Session.get('amazontotalpages') == '1') {
                return '';
            } else {
                var toReturn = '<center><nav><ul class="amazonpaginator pagination pagination-lg">';
                if(Session.get('amazoncurrentpage') == 1) {
                    toReturn += '<li class="disabled"><a aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
                } else {
                    toReturn += '<li><a class="amazonpageprevious" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
                }
                for (i = 1; i <= parseInt(Session.get('amazontotalpages')); i++) {
                    if(i == parseInt(Session.get('amazoncurrentpage'))) {
                        toReturn += '<li class="active"><a>' + i.toString() + '</a></li>';
                    } else {
                        toReturn += '<li><a class="amazonpagenum">' + i.toString() + '</a></li>';
                    }
                }
                if (Session.get('amazoncurrentpage') == Session.get('amazontotalpages')) {
                    toReturn += '<li class="disabled"><a aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
                } else {
                    toReturn += '<li><a class="amazonpagenext" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
                }
                toReturn += '</ul></nav></center>';
                return toReturn;
            }
        }
    }
);

Template.AddBook.events({
        'keypress #googlesearchtitle': function (event, template) {
            if (event.which === 13) {
                event.preventDefault();
                Session.set('googlecurrentpage', 1);
                launchGoogleSearch();
            }
        },
        'click .googlesearchsubmit': function(event, template) {
            Session.set('googlecurrentpage', 1);
            launchGoogleSearch();
        },
        'click .googlepageprevious': function(event, template) {
            Session.set('googlecurrentpage', Session.get('googlecurrentpage') - 1);
            launchGoogleSearch();
        },
        'click .googlepagenum': function(event, template) {
            Session.set('googlecurrentpage', parseInt($(event.target).html()));
            launchGoogleSearch();
        },
        'click .googlepagenext': function(event, template) {
            Session.set('googlecurrentpage', Session.get('googlecurrentpage') + 1);
            launchGoogleSearch();
        },
        'keypress #amazonsearchtitle': function (event, template) {
            if (event.which === 13) {
                event.preventDefault();
                Session.set('amazoncurrentpage', 1);
                launchAmazonSearch();
            }
        },
        'click .amazonsearchsubmit': function(event, template) {
            Session.set('amazoncurrentpage', 1);
            launchAmazonSearch();
        },
        'click .amazonpageprevious': function(event, template) {
            Session.set('amazoncurrentpage', Session.get('amazoncurrentpage') - 1);
            launchAmazonSearch();
        },
        'click .amazonpagenum': function(event, template) {
            Session.set('amazoncurrentpage', parseInt($(event.target).html()));
            launchAmazonSearch();
        },
        'click .amazonpagenext': function(event, template) {
            Session.set('amazoncurrentpage', Session.get('amazoncurrentpage') + 1);
            launchAmazonSearch();
        }
    }
);

Template.AmazonBook.events({
    'click .amazonbook': function (event, template) {
        var thisfs = this;
        swal({
                title: TAPi18n.__("swal.confirm.title"),
                text: TAPi18n.__("swal.confirm.text"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#A5DC86',
                confirmButtonText: TAPi18n.__("swal.confirm.confirm"),
                cancelButtonText: TAPi18n.__("swal.confirm.cancel"),
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    var authors = [];
                    _.each(thisfs.ItemAttributes[0].Author, function (author) {
                        authors.push(author);
                    });
                    var isbns = [];
                    _.each(thisfs.ItemAttributes[0].ISBN, function (isbn) {
                        isbns.push({indentifier: isbn, type: 'ISBN'});
                    });
                    var thumb = thisfs.LargeImage[0].URL[0];
                    if (!thumb) {
                        thumb = "http://placehold.it/128x188&text=Img not found !";
                    }
                    try {
                        var summary = thisfs.EditorialReviews[0].EditorialReview[0].Content[0];
                        if(!summary) {
                            summary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi hendrerit neque tellus, eu accumsan orci pulvinar at. Vestibulum urna purus, sodales eget fringilla nec, pellentesque nec ante. Nam sem est, gravida non urna vel, egestas bibendum elit. Sed arcu nibh, gravida in est at, feugiat tristique dui. Ut eget justo molestie, interdum urna sit amet, viverra orci. Proin eleifend, enim non feugiat gravida, diam eros feugiat lacus, eu convallis lectus dui id ligula. Suspendisse finibus et metus id semper. Nam egestas sit amet nisl eget vestibulum. Pellentesque id facilisis sem, a ultricies urna. Donec nec tempus ipsum. Donec semper dignissim eros ut dignissim. ";
                        }
                    }  catch(error) {
                        var summary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi hendrerit neque tellus, eu accumsan orci pulvinar at. Vestibulum urna purus, sodales eget fringilla nec, pellentesque nec ante. Nam sem est, gravida non urna vel, egestas bibendum elit. Sed arcu nibh, gravida in est at, feugiat tristique dui. Ut eget justo molestie, interdum urna sit amet, viverra orci. Proin eleifend, enim non feugiat gravida, diam eros feugiat lacus, eu convallis lectus dui id ligula. Suspendisse finibus et metus id semper. Nam egestas sit amet nisl eget vestibulum. Pellentesque id facilisis sem, a ultricies urna. Donec nec tempus ipsum. Donec semper dignissim eros ut dignissim. ";
                    }
                    var doc = {
                        title: thisfs.ItemAttributes[0].Title[0],
                        authors: authors,
                        summary: summary,
                        thumb: thumb,
                        type: 1,
                        isbns: isbns,
                        amazonId: thisfs.ASIN[0],
                        bookRates: 0,
                        bookInitiator: Meteor.userId()
                    };
                    Meteor.call('insertBook', {doc: doc}, function (error, result) {
                            if (error) {
                                console.error(error);
                                swal(TAPi18n.__("utils.error"), TAPi18n.__("swal.importerror"), 'error');
                            } else {
                                Router.go("ViewBook", {_id: result});
                                swal(TAPi18n.__("swal.imported.title"), TAPi18n.__("swal.imported.text"), 'success')
                            }
                        }
                    );
                } else {
                    swal(TAPi18n.__("swal.cancel.title"), TAPi18n.__("swal.cancel.text"), 'error');
                }
            }
        );
    }
});

Template.GoogleBook.events({
        'click .googlebook': function (event, template) {
            var thisfs = this;
            swal({
                    title: TAPi18n.__("swal.confirm.title"),
                    text: TAPi18n.__("swal.confirm.text"),
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#A5DC86',
                    confirmButtonText: TAPi18n.__("swal.confirm.confirm"),
                    cancelButtonText: TAPi18n.__("swal.confirm.cancel"),
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        var authors = [];
                        _.each(thisfs.volumeInfo.authors, function (author) {
                            authors.push(author);
                        });
                        var thumb = thisfs.volumeInfo.imageLinks.thumbnail;
                        if (!thumb) {
                            thumb = "http://placehold.it/128x188&text=Img not found !";
                        }
                        try {
                            var summary = thisfs.volumeInfo.description;
                            if (!summary) {
                                summary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi hendrerit neque tellus, eu accumsan orci pulvinar at. Vestibulum urna purus, sodales eget fringilla nec, pellentesque nec ante. Nam sem est, gravida non urna vel, egestas bibendum elit. Sed arcu nibh, gravida in est at, feugiat tristique dui. Ut eget justo molestie, interdum urna sit amet, viverra orci. Proin eleifend, enim non feugiat gravida, diam eros feugiat lacus, eu convallis lectus dui id ligula. Suspendisse finibus et metus id semper. Nam egestas sit amet nisl eget vestibulum. Pellentesque id facilisis sem, a ultricies urna. Donec nec tempus ipsum. Donec semper dignissim eros ut dignissim. ";
                            }
                        }  catch(error) {
                            var summary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi hendrerit neque tellus, eu accumsan orci pulvinar at. Vestibulum urna purus, sodales eget fringilla nec, pellentesque nec ante. Nam sem est, gravida non urna vel, egestas bibendum elit. Sed arcu nibh, gravida in est at, feugiat tristique dui. Ut eget justo molestie, interdum urna sit amet, viverra orci. Proin eleifend, enim non feugiat gravida, diam eros feugiat lacus, eu convallis lectus dui id ligula. Suspendisse finibus et metus id semper. Nam egestas sit amet nisl eget vestibulum. Pellentesque id facilisis sem, a ultricies urna. Donec nec tempus ipsum. Donec semper dignissim eros ut dignissim. ";
                        }
                        var doc = {
                            title: thisfs.volumeInfo.title,
                            authors: authors,
                            summary: summary,
                            thumb: thumb,
                            type: 2,
                            isbns: thisfs.volumeInfo.industryIdentifiers,
                            googleId: thisfs.id,
                            bookRates: 0,
                            bookInitiator: Meteor.userId()
                        };
                        Meteor.call('insertBook', {doc: doc}, function (error, result) {
                                if (error) {
                                    console.error(error);
                                    swal(TAPi18n.__("utils.error"), TAPi18n.__("swal.importerror"), 'error');
                                } else {
                                    Router.go("ViewBook", {_id: result});
                                    swal(TAPi18n.__("swal.imported.title"), TAPi18n.__("swal.imported.text"), 'success')
                                }
                            }
                        );
                    } else {
                        swal(TAPi18n.__("swal.cancel.title"), TAPi18n.__("swal.cancel.text"), 'error');
                    }
                }
            );
        }
    }
);

Template.GoogleBook.helpers({
        disabled: function() {
            var book = Books.findOne({googleId: this.id});
            if(book != undefined) {
                return 'disabled';
            } else {
                return 'googlebook'
            }
        }
    }
);

Template.AmazonBook.helpers({
        disabled: function() {
            var book = Books.findOne({amazonId: this.ASIN[0]});
            if(book != undefined) {
                return 'disabled';
            } else {
                return 'amazonbook'
            }
        }
    }
);