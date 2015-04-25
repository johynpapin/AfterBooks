Template.layout.helpers({
    gravatar: function () {
        if(Meteor.userId() != "") {
            var options = {
                secure: true
            };
            return '<li><img src="'+Gravatar.imageUrl(Meteor.user().emails[0].address, options)+'" class="img-circle img-responsive gravatar" style="max-height: 45px;"></li>';
        } else {
            return '';
        }
    }
});

Template.layout.events({
    'click .gravatar': function (event, template) {
        window.open('https://gravatar.com/', '_blank');
    },
    'click .navbar-brand': function (event, template) {
        if(Session.get('mignon') == true) {
            if(Session.get('isMignon')==true) {
                Session.set('isMignon', false);
            } else {
                Session.set('isMignon', true);
            }
            $(".brand-icon").toggleClass("fa-book");
            $(".brand-icon").toggleClass("fa-heart");
        }
    }
});

Template.atNavButton.rendered = function() {
    $('#at-nav-button').removeClass('navbar-btn');
};

Template.adsense.rendered = function() {
    function LaunchAdsense() {
        $.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", function () {
            var ads, adsbygoogle;
            ads = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2385350494324112" data-ad-slot="7888797582" data-ad-format="auto"></ins>';
            $('.leaderboard').html(ads);
            return (adsbygoogle = window.adsbygoogle || []).push({});
        });
        var adBlockTimer;
        function AdblockUser() {
            clearInterval(adBlockTimer);
            if ($('.leaderboard').height() == 0) {
                $(".likorne").show();
            }
        }
        adBlockTimer = setInterval(function(){AdblockUser()}, 3000);
    }
    setTimeout(LaunchAdsense(), 1000);
};