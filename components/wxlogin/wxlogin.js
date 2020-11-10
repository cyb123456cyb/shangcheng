var e = getApp(), n = null;

Component({
    properties: {
        show_login: {
            type: Boolean,
            value: !1
        },
        bg_closable: {
            type: Boolean,
            value: !0
        }
    },
    data: {},
    lifetimes: {
        attached: function() {},
        moved: function() {},
        detached: function() {}
    },
    methods: {
        bindGetUserInfo: function(t) {
            n = this, console.log("bindGetUserInfo", t);
            var o = t.detail.userInfo;
            e.updateUserSignupWXInfo(o, {
                success: function(e) {
                    n.setData({
                        show_login: !1
                    });
                    var t = {
                        point_change_res: e.data.data.user_signup_userinfo.point_change_res
                    }, o = {};
                    n.triggerEvent("getuserinfofinish", t, o);
                }
            });
        },
        hideLogin: function() {
            this.setData({
                show_login: !1
            });
        },
        tapLayerBg: function(e) {
            console.log(e), this.data.bg_closable && this.hideLogin();
        }
    }
});