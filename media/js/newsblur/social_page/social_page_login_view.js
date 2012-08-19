NEWSBLUR.Views.SocialPageLoginSignupView = Backbone.View.extend({
    
    events: {
        "click .NC-login-toggle-button"         : "toggle_login_dialog",
        "click .NC-request-toggle-button"       : "toggle_request_dialog",
        "click .NC-logout-button"               : "logout",
        "click .NC-login-button"                : "login"
    },

    initialize: function() {
    },

    toggle_login_dialog: function(options) {
        console.log('open');
        options = options || {};
        var $popover = this.$('.NC-login-popover');
        var $other_popover = this.$('.NC-request-popover');
        var $login_username = this.$('input[name=login_username]');
        var $login_password = this.$('input[name=login_password]');
        
        if (options.close ||
            ($popover.hasClass('NC-active'))) {
            // Close
            $popover.animate({
                'opacity': 0
            }, {
                'duration': 300,
                'easing': 'easeInOutQuint',
                'queue': false,
                'complete': _.bind(function() {
                    this.$('.NB-error').remove();
                    $popover.removeClass('NC-active');
                }, this)
            });
            $(document).unbind('click.loginView');
        } else {
            // Open/resize
            this.$('.NB-error').remove();
            $other_popover.removeClass('NC-active');
            $popover.addClass('NC-active');
            $popover.animate({
                'opacity': 1
            }, {
                'duration': options.immediate ? 0 : 350,
                'easing': 'easeInOutQuint',
                'queue': false,
                'complete': _.bind(function() {
                    $login_username.focus();
                }, this)
            });
        
            var login = _.bind(function(e) {
                e.preventDefault();
                this.login();
            }, this);
            
            $login_username.add($login_password)
                 .unbind('keydown.login')
                 .bind('keydown.login', 'ctrl+return', login)
                 .bind('keydown.login', 'meta+return', login)
                 .bind('keydown.login', 'return', login);
                 
            // _.defer(_.bind(function() {
            //     $(document).bind('click.loginView', _.bind(this.hide_popovers, this));
            // }, this));
        }
    },
    
    toggle_request_dialog: function(options) {
        options = options || {};
        var $popover = this.$('.NC-request-popover');
        var $other_popover = this.$('.NC-login-popover');
        var $request_email = this.$('input[name=request_email]');
        
        if (options.close ||
            ($popover.hasClass('NC-active'))) {
            // Close
            $popover.animate({
                'opacity': 0
            }, {
                'duration': 300,
                'easing': 'easeInOutQuint',
                'queue': false,
                'complete': _.bind(function() {
                    $popover.removeClass('NC-active');
                }, this)
            });

            $(document).unbind('click.loginView');
        } else {
            $other_popover.removeClass('NC-active');
            $popover.addClass('NC-active');
            $popover.animate({
                'opacity': 1
            }, {
                'duration': options.immediate ? 0 : 350,
                'easing': 'easeInOutQuint',
                'queue': false,
                'complete': _.bind(function() {
                    $request_email.focus();
                }, this)
            });
        
            var request_invite = _.bind(function(e) {
                e.preventDefault();
                this.request_invite();
            }, this);
            
            $request_email
                .unbind('keydown.invite')
                .bind('keydown.invite', 'ctrl+return', request_invite)
                .bind('keydown.invite', 'meta+return', request_invite)
                .bind('keydown.invite', 'return', request_invite);
            
            // _.defer(_.bind(function() {
            //     $(document).bind('click.loginView', _.bind(this.hide_popovers, this));
            // }, this));
        }
    },
    
    hide_popovers: function(e) {
        var $popover = this.$('.NC-popover');        
        
        if (e) { 
            if (($(e.target).closest(".NC-popover").length) || ($(e.target).closest(".NC-button").length)) return;
        }
        
        $(document).unbind('click.loginView');
        // Close
        $popover.animate({
            'opacity': 0
        }, {
            'duration': 300,
            'easing': 'easeInOutQuint',
            'queue': false
        });
        $popover.removeClass('NC-active'); 
    },
        
    // ==========
    // = Events =
    // ==========
    
    clean: function() {
        this.$('.NB-error').remove();
    },
    
    login: function() {
        this.clean();
        
        var username = this.$('input[name=login_username]').val();
        var password = this.$('input[name=login_password]').val();
        
        NEWSBLUR.assets.login(username, password, _.bind(this.post_login, this), _.bind(this.login_error, this));
    },
    
    post_login: function(data) {
        NEWSBLUR.log(["login data", data]);
        window.location.reload()
    },
    
    login_error: function(data) {
        this.clean();
        
        var error = _.first(_.values(data.errors))[0];
        this.$('.NC-login-popover .NC-popover-inner').append($.make('div', { className: 'NB-error' }, error));
    },
     
    logout: function() {
        NEWSBLUR.assets.logout(_.bind(this.post_logout, this), _.bind(this.logout_error, this));
    },
    
    post_logout: function(data) {
        window.location.reload()
    },
    
    logout_error: function(data) {
        alert('There was an error trying to logout, ouch.');
    },
    
    request_invite: function() {
        this.clean();        
        var email    = this.$('input[name=request_email]').val();
        
        NEWSBLUR.assets.request_invite(email, _.bind(this.post_request_invite, this), _.bind(this.post_request_invite, this));
    },
    
    post_request_invite: function(data) {
        NEWSBLUR.log(["request data", data]);
        this.hide_popovers();
        this.$('.NC-request-toggle-button').html('Invite Requested');
    },
    
    request_invite_error: function(data) {
        this.clean();
        alert('invite error');
        console.log("calling invite_error");
    }        
});