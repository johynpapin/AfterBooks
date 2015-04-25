var opHelper = new apac.OperationHelper({
    awsId:     'AKIAIUQM6GCZJIFGQXFA',
    awsSecret: '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',
    assocId:   'after01d-21',
    // xml2jsOptions: an extra, optional, parameter for if you want to pass additional options for the xml2js module. (see https://github.com/Leonidas-from-XIV/node-xml2js#options)
    version:   '2013-08-01'
    // your version of using product advertising api, default: 2013-08-01
});

Meteor.startup(function () {
        smtp = {
            username: 'contact@kiwiasso.org',
            password: 'SErpentin22',
            server:   'mail.gandi.net',
            port: 25
        };
        process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

        Accounts.emailTemplates.from = 'AfterBooks <no-reply@afterbooks.com>';
        Accounts.emailTemplates.siteName = 'AfterBooks';
        PrettyEmail.options = {
            from: 'AfterBooks <no-reply@afterbooks.com>',
            logoUrl: 'http://localhost:3000/afterbooks.png',
            companyName: 'AfterBooks',
            companyUrl: 'http://localhost:3000/',
            companyAddress: '21 Rue Marcel Sanguy, 22110 Rostrenen, France',
            companyTelephone: '+33296245509',
            companyEmail: 'contact@afterbooks.com',
            siteName: 'AfterBooks',
            facebook: 'https://facebook.com/pages/afterbooks/',
            twitter: 'https://twitter.com/afterbooks/'
        };
    }
);

Meteor.methods({
        'sendEmail': function (to, from, subject, text) {
            check([to, from, subject, text], [String]);

            // Let other method calls from the same client start running,
            // without waiting for the email sending to complete.
            this.unblock();

            Email.send({
                to: to,
                from: from,
                subject: subject,
                text: text
            });
        },
        'insertBook': function(params){
            this.unblock();
            if(Meteor.user()) {
                var to_return = Books.insert(params.doc, {validationContext: "googleinsert"});
                return to_return;
            } else {
                throw new Meteor.Error(401, {message: "You must be connected to do that !"});
            }
        },
        'updateBook': function(params){
            this.unblock();
            if(Meteor.user()) {
                Books.update(params.book_id, {$set: {title: params.title, summary: params.summary}});
            } else {
                throw new Meteor.Error(401, {message: "You must be connected to do that !"});
            }
        },
        'insertBtra': function(params){
            if(Meteor.user()) {
                Books.update({
                        _id:params.book_id
                    }, {
                        $push: {
                            btra: {
                                _id: params.btra_id,
                                rates: 0,
                                initiator: Meteor.userId()
                            }
                        },
                        $addToSet: {
                            btraRaters: Meteor.userId()
                        }
                    },function(error, result) {
                        if(error) {
                            throw new Meteor.Error(500, error.invalidKeys);
                        }
                    }
                );
                Books.update({
                        _id:params.book_id,
                    }, {
                        $push: {
                            btra: {
                                $each: [],
                                $slice: -50,
                                $sort: { rates: -1 }
                            }
                        }
                    },function(error, result) {
                        if(error) {
                            throw new Meteor.Error(500, error.invalidKeys);
                        }
                    }
                );
            } else {
                throw new Meteor.Error(401, {message: "You must be connected to do that !"});
            }
        },
        'rateBook': function(params) {
            this.unblock();
            if(Meteor.user()) {
                var book = Books.findOne(params.book_id);
                if (book.bookInitiator == Meteor.userId()) {
                    throw new Meteor.Error(401, {message: "You are not authorized to do that !"});
                } else {
                    if (params.vote_type == 'up') {
                        Books.update({
                                _id: params.book_id
                            }, {
                                $inc: {
                                    'bookRates': 1
                                },
                                $addToSet: {
                                    bookRaters: Meteor.userId()
                                }
                            }, function (error, result) {
                                if (error) {
                                    throw new Meteor.Error(500, error.invalidKeys);
                                }
                            }
                        );
                    } else {
                        Books.update({
                                '_id': params.book_id
                            }, {
                                $inc: {
                                    'bookRates': -1
                                },
                                $pullAll: {
                                    'bookRaters': [Meteor.userId()]
                                }
                            }, function (error, result) {
                                if (error) {
                                    throw new Meteor.Error(500, error.invalidKeys);
                                }
                            }
                        );
                    }
                    Books.update({
                            _id: params.book_id
                        }, {
                            $push: {
                                btra: {
                                    $each: [],
                                    $slice: -50,
                                    $sort: {rates: -1}
                                }
                            }
                        }, function (error, result) {
                            if (error) {
                                throw new Meteor.Error(500, error.invalidKeys);
                            }
                        }
                    );
                }
            } else {
                throw new Meteor.Error(401, {message: "You must be connected to do that !"});
            }
        },
        'rateBtra': function(params) {
            this.unblock();
            if(Meteor.user()) {
                var book = Books.findOne(params.book_id);
                _.each(book.btra, function(btra) {
                    if(btra._id == params.btra_id) {
                        if(btra.initiator == Meteor.userId()) {
                            throw new Meteor.Error(401, {message: "You are not authorized to do that !"});
                        } else {

                            if(params.vote_type == 'up') {
                                Books.update({
                                        _id:params.book_id,
                                        'btra._id': params.btra_id
                                    }, {
                                        $inc:{
                                            'btra.$.rates': 1
                                        },
                                        $addToSet: {
                                            btraRaters: Meteor.userId()
                                        }
                                    },function(error, result) {
                                        if(error) {
                                            throw new Meteor.Error(500, error.invalidKeys);
                                        }
                                    }
                                );
                            } else {
                                Books.update({
                                        '_id':params.book_id,
                                        'btra._id': params.btra_id
                                    }, {
                                        $inc:{
                                            'btra.$.rates': -1
                                        },
                                        $pullAll: {
                                            'btraRaters': [Meteor.userId()]
                                        }
                                    },function(error, result) {
                                        if(error) {
                                            throw new Meteor.Error(500, error.invalidKeys);
                                        }
                                    }
                                );
                            }
                            Books.update({
                                    _id:params.book_id
                                }, {
                                    $push: {
                                        btra: {
                                            $each: [],
                                            $slice: -50,
                                            $sort: { rates: -1 }
                                        }
                                    }
                                },function(error, result) {
                                    if(error) {
                                        throw new Meteor.Error(500, error.invalidKeys);
                                    }
                                }
                            );
                        }
                    }
                });
            } else {
                throw new Meteor.Error(401, {message: "You must be connected to do that !"});
            }
        },
        'console': function(param) {
            console.log(param);
        },
        'googlebooks': function(params) {
            this.unblock();
            var response = HTTP.get('https://www.googleapis.com/books/v1/volumes', {
                params: {
                    q: params.query,
                    startIndex: params.page * 10 - 10,
                    maxResults: 10,
                    langRestrict: ServerSession.get('language'),
                    key: 'AIzaSyAgvdPtmmldszDUk1Tcm7sNH9YmnMpnNd4'
                }
            });
            return response;
        },
        'amazon': function(params) {
            this.unblock();

            Future = Npm.require('fibers/future');
            var future = new Future();

            opHelper.execute('ItemSearch', {
                    'SearchIndex': 'Books',
                    'ItemPage': params.page,
                    'Keywords': params.keywords,
                    'ResponseGroup': 'ItemAttributes,EditorialReview,Images'
                }, function(err, results) {
                    if(err) {
                        console.log(err);
                        future.throw(err);
                    } else {
                        future.return(results);
                    }
                }
            );

            return future.wait();
        },
        'serversession': function(params) {
            ServerSession.set(params.key, params.value);
        }
    }
);

Books.allow({
        'insert': function (userId, doc) {
            return true;
        }
    }
);