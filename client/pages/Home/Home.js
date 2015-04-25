Template.Home.events({
    'submit #searchform': function(event, template) {
        event.preventDefault();
    }
});

Template.Home.rendered = function() {
    setInterval(function() {
        var jumbotron = $('#jumbotron');
        bgnum = Math.floor((Math.random() * 10) + 1);
        jumbotron.css("background-image", "url(/bg"+bgnum+".jpg)");
    }, 10000);
};

Template.BookForHome.helpers({
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
});

Template.testing.helpers({
    isKeyValid: function() {
        return(Session.get('keyisnotvalid'));
    }
});

Template.testing.events({
    'click #testingbutton': function (event, template) {
        function toHex(str) {
            var hex = '';
            for(var i=0;i<str.length;i++) {
                hex += ''+str.charCodeAt(i).toString(16);
            }
            return hex;
        }
        var name = $('#testingname').val();
        var key = $('#testingkey').val();
        if(name == '' || key == '') {
            Session.set('keyisnotvalid', true);
        } else if (key == "616d656c6965") { // Amélie
            Session.set('nom', 'Amélie');
            Session.set('mignon', true);
            Session.set('keyisnotvalid', false);
            Session.set('isAllowed', true);
            Router.go('Home');
        } else if (toHex(name.toLowerCase()) == key) { // Les autres
            Session.set('nom', name.toLowerCase().capitalizeFirstLetter());
            Session.set('mignon', false);
            Session.set('keyisnotvalid', false);
            Session.set('isAllowed', true);
            Router.go('Home');
        } else {
            Session.set('keyisnotvalid', true);
        }
    }
});

Template.generatekey.events({
    'click #generatebutton': function (event, template) {
        function toHex(str) {
            var hex = '';
            for(var i=0;i<str.length;i++) {
                hex += ''+str.charCodeAt(i).toString(16);
            }
            return hex;
        }
        Session.set('generatedKey', toHex($('#genname').val().toLowerCase()));
    }
});

Template.Home.created = function () {
    var instance = EasySearch.getComponentInstance(
        { index : 'books' }
    );

    instance.on('searchingDone', function (searchingIsDone) {
        searchingIsDone
    });

    instance.on('currentValue', function (val) {
        if(val == '') {
            if($(".jumbotron-header").is(":hidden")) {
                $(".jumbotron-header").slideDown("fast");
            }
        } else {
            Session.set('searchCurrentValue', val);
            if(!$(".jumbotron-header").is(":hidden")) {
                $(".jumbotron-header").slideUp("fast");
            }
        }
    });
};
