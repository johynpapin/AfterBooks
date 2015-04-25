Router.route('/userAccounts', function () {
        this.render('userAccounts');
    }, {
        name: 'userAccounts',
        layoutTemplate: 'layout'
    });
AccountsTemplates.configureRoute('forgotPwd', {
    layoutTemplate: 'layout',
    template: 'userAccounts'
});
AccountsTemplates.configureRoute('signIn', {
    layoutTemplate: 'layout',
    template: 'userAccounts'
});
AccountsTemplates.configureRoute('signUp', {
    layoutTemplate: 'layout',
    template: 'userAccounts'
});
AccountsTemplates.configureRoute('changePwd', {
    layoutTemplate: 'layout',
    template: 'userAccounts'
});
AccountsTemplates.configureRoute('enrollAccount', {
    layoutTemplate: 'layout',
    template: 'userAccounts'
});
AccountsTemplates.configureRoute('resetPwd', {
    layoutTemplate: 'layout',
    template: 'userAccounts'
});
Router.plugin('ensureSignedIn', {
    only: ['AddBook', 'AddBtra']
});

function getLanguage() {
    //return navigator.language.split("-")[0] || navigator.userLanguage.split("-")[0];
    return 'fr';
}

// Configuration du routeur
Router.configure({
    loadingTemplate: 'loading',
    layoutTemplate: 'layout',
    notFoundTemplate: '404',
    waitOn: function () {
        if(Session.get('showsplashscreen') != false) {
            TAPi18n.setLanguage('fr')
                .done(function () {
                    Meteor.call("serversession", {
                        key: 'language',
                        value: TAPi18n.getLanguage()
                    }, function (error, results) {

                    });
                })
                .fail(function (error_message) {
                    console.log(error_message);
                });
            accountsUIBootstrap3.setLanguage('fr');
            T9n.setLanguage('fr');
            Session.set('showsplashscreen', false);
        }
        return Meteor.subscribe('books');

    },
    onBeforeAction: function(pause) {
        SEO.config({
            title: 'AfterBooks',
            meta: {
                'description': 'AfterBooks lets you discover new book, following your readings...',
                'viewport': 'width=device-width, initial-scale=1',
                'keywords': 'AfterBooks,afterbooks,after,books,read,reading,book,discover,what to read after,livre,apres,que lire apres,livres',
                'author': 'Papin Johyn'
            }
        });
        this.next();
    }
});
Router.plugin('dataNotFound', {notFoundTemplate: '404'});

// Routes
Router.route('/', function () {
    SEO.set({
        title: 'AfterBooks - ' + TAPi18n.__("nav.home")
    });
    this.render('Home');
},{
    layoutTemplate: 'layout',
    name: 'Home'
});

Router.route('/loading', function () {
    SEO.set({
        title: 'AfterBooks - Loading... '
    });
    this.layoutTemplate = 'layout';
    this.render('loading');
},{
    name: 'loading'
});

Router.route('/privacy', function () {
    SEO.set({
        title: 'AfterBooks - Privacy'
    });
    this.render('privacy');
},{
    layoutTemplate: 'layout',
    name: 'privacy'
});

Router.route('/generatekey', function () {
    SEO.set({
        title: 'AfterBooks - Generate a key'
    });
    this.render('generatekey');
},{
    name: 'generatekey'
});

Router.route('/about', function () {
    SEO.set({
        title: 'AfterBooks - ' + TAPi18n.__("nav.about")
    });
    this.render('About');
}, {
    layoutTemplate: 'layout',
    name: 'About'
});

Router.route('/books/add', function () {
    SEO.set({
        title: 'AfterBooks - Add'
    });
    Session.set('googlesearchresults', false);
    Session.set('googletotalpages', false);
    Session.set('googlecurrentpage', 1);
    Session.set('googlenoresults', false);
    Session.set('amazonsearchresults', false);
    Session.set('amazontotalpages', false);
    Session.set('amazoncurrentpage', 1);
    Session.set('amazonnoresults', false);
    this.render('AddBook');
}, {
    layoutTemplate: 'layout',
    name: 'AddBook'
});

Router.route('/books/:_id/addbtra', {
    name: 'AddBtra',
    data: function () {
        var obj = Books.findOne({_id: this.params._id});
        if (!obj) {
            this.layoutTemplate = '';
            return false;
        } else {
            Session.set('googlesearchresults', false);
            Session.set('googlesubmited', false);
            this.layoutTemplate = 'layout';
            return obj;
        }
    },
    onAfterAction: function () {
        book = this.data();
        SEO.set({
            title: 'AfterBooks - ' + book.title
        });
    }
});

Router.route('/books/:_id', {
    name: 'ViewBook',
    data: function () {
        var obj = Books.findOne({_id: this.params._id});
        if(!obj) {
            this.layoutTemplate = '';
            return false;
        } else {
            Session.set('googlesearchresults', false);
            Session.set('googlesubmited', false);
            this.layoutTemplate = 'layout';
            return obj;
        }
    },
    onAfterAction: function() {
        book = this.data();
        SEO.set({
            title: 'AfterBooks - ' + book.title
        });
    }
});

// Loading
Template.loading.rendered = function () {
    $('body').removeClass('loaded');
    this.loading = true;
};

Template.loading.destroyed = function () {
    if (this.loading) {
        $('body').addClass('loaded');
        this.loading = false;
    }
};