// Gestion du schéma des livres, et de sa validation
Books = new Mongo.Collection('books');

var Schemas = {};

Schemas.Book = new SimpleSchema({
    title: {
        type: String,
        label: function(){if(Meteor.isClient || Meteor.isCordova){return(TAPi18n.__('labels.title'))}else{return('title')}},
        unique: false,
        max: 400
    },
    summary: {
        type: String,
        label: function(){if(Meteor.isClient){return(TAPi18n.__('labels.summary'))}else{return('summary')}},
        optional: false,
        max: 10000,
        autoform: {
            afFieldInput: {
                type: 'froala',
                inlineMode: false
            }
        }
    },
    thumb: {
        type: String,
        label: function(){if(Meteor.isClient){return(TAPi18n.__('labels.thumb'))}else{return('thumb')}},
        regEx: SimpleSchema.RegEx.Url,
        optional: false
    },
    authors: {
        type: [String],
        label: function(){if(Meteor.isClient){return(TAPi18n.__('labels.authors.label'))}else{return('authors')}}

    },

    type: {
        type: Number
    },
    isbns: {
        type: [Object],
        unique: false,
        optional: false
    },
    'isbns.$.identifier': {
        type: String,
        unique: true,
        optional: true
    },
    'isbns.$.type': {
        type: String,
        unique: false,
        optional: true
    },
    googleId: {
        type: String,
        unique: true,
        optional: true
    },
    amazonId: {
        type: String,
        unique: true,
        optional: true
    },

    "bookRaters": {
        type: [String],
        optional: true
    },
    "bookRates": {
        type: Number,
        optional: true
    },
    "bookInitiator": {
        type: String,
        optional: false
    },
    "btraRaters": {
        type: [String],
        optional: true
    },
    btra: {
        type: [Object],
        optional: true
    },
    "btra.$._id": {
        type: String,
        min: 17,
        max: 17,
        optional: true
    },
    "btra.$.rates": {
        type: Number,
        optional: true
    },
    "btra.$.initiator": {
        type: String,
        optional: true
    }
});

Books.attachSchema(Schemas.Book);

// Configuration du sytème de recherche
EasySearch.createSearchIndex('books', {
    'collection': Books,
    'field': ['title'],
    'limit': 10,
    'use' : 'minimongo',
    'sort': function() {
        return { 'bookRates': -1 };
    },
    'query': function(searchString, opts) {
        var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);
        return query;
    }
});
if(Meteor.isServer) {
    Meteor.publish("books", function () {
        return Books.find();
    });
}
