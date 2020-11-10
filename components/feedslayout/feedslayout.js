var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, e = getApp(), o = null, i = wx.getSystemInfoSync().statusBarHeight;

Component({
    properties: {
        topic_id: {
            type: String,
            value: ""
        },
        topic_tab: {
            type: String,
            value: ""
        },
        topic_is_super_user: {
            type: Boolean,
            value: !1
        },
        subject_id: {
            type: String,
            value: ""
        }
    },
    data: {
        global_configs: e.globalData.configs,
        status_bar_height: i,
        window_width: 0,
        feed_pic_width: 0,
        feed_list: [],
        feed_list_l: [],
        feed_list_r: [],
        feed_list_hl: 0,
        feed_list_hr: 0,
        notes_liked: {},
        notes_like_add: {},
        su_seled_note_id: "",
        hide_nodes: {},
        topic_hot_notes: {}
    },
    ready: function() {
        var t = this;
        wx.getSystemInfo({
            success: function(e) {
                t.setData({
                    window_width: e.windowWidth,
                    feed_pic_width: 345
                });
            }
        });
    },
    lifetimes: {
        attached: function() {
            console.log("feedslayout attached");
        }
    },
    pageLifetimes: {
        show: function() {
            console.log("feedslayout show");
            var t = this;
            wx.getSystemInfo({
                success: function(e) {
                    t.setData({
                        window_width: e.windowWidth,
                        feed_pic_width: 345
                    });
                }
            });
        },
        hide: function() {},
        resize: function() {}
    },
    methods: {
        appendFeeds: function(t, i) {
            (o = this).updateFeedsHeight();
            var a = o.data.feed_list_l, s = o.data.feed_list_r;
            i && (a = [], s = [], o.setData({
                hide_nodes: {},
                topic_hot_notes: {}
            }));
            var n = "", d = 0, c = Math.abs(o.data.feed_list_hl - o.data.feed_list_hr);
            c > 300 && !i && (d = parseInt(c / 200), n = o.data.feed_list_hl > o.data.feed_list_hr ? "r" : "l"), 
            console.log("appendFeeds precount -> ", c, n, d), t.forEach(function(t, e) {
                e < d ? "r" == n ? s.push(t) : a.push(t) : e % 2 == 0 ? a.push(t) : s.push(t);
            }), o.setData({
                feed_list_l: a,
                feed_list_r: s
            }), setTimeout(function() {
                o.updateFeedsHeight();
            }, 500), setTimeout(function() {
                o.updateFeedsHeight();
            }, 1e3), setTimeout(function() {
                o.updateFeedsHeight();
            }, 2e3), o.setData({
                su_seled_note_id: ""
            }), t.forEach(function(t, i) {
                t.is_hot == e.const.API_CHAR_BOOL_YES && o.updateTopicHotNotes(t.id, !0);
            });
            var r = [];
            t.forEach(function(t) {
                t.note_type && r.push(t.id);
            }), r.length > 0 && o.getNotesLikedData(r);
        },
        updateFeedsHeight: function() {
            o = this;
            var t = wx.createSelectorQuery().in(this);
            t.selectViewport().scrollOffset(), t.select("#__feeds_l").boundingClientRect(), 
            t.exec(function(t) {
                if (t[1]) {
                    var e = t[1].height;
                    o.setData({
                        feed_list_hl: e
                    });
                }
            });
            var e = wx.createSelectorQuery().in(this);
            e.selectViewport().scrollOffset(), e.select("#__feeds_r").boundingClientRect(), 
            e.exec(function(t) {
                if (t[1]) {
                    var e = t[1].height;
                    o.setData({
                        feed_list_hr: e
                    });
                }
            });
        },
        addHideNode: function(t) {
            var e = (o = this).data.hide_nodes;
            e[t] = !0, o.setData({
                hide_nodes: e
            });
        },
        onLikeNote: function(t) {
            o = this, console.log(t.currentTarget.dataset);
            var e = t.currentTarget.dataset.id;
            if (o.checkLoginedSignupStatus()) o.likeNote(e); else {
                var i = {
                    note_id: e
                }, a = {};
                o.triggerEvent("likenotenotlogined", i, a);
            }
        },
        likeNote: function(t) {
            e.likeNote(t, {
                success: function(i) {
                    console.log(i.data);
                    var a = o.data.notes_liked;
                    a[t] = i.data.data.like_note.liked == e.const.API_CHAR_BOOL_YES, o.setData({
                        notes_liked: a
                    });
                    var s = o.data.notes_like_add;
                    s[t] || (s[t] = 0), s[t] += i.data.data.like_note.liked == e.const.API_CHAR_BOOL_YES ? 1 : -1, 
                    o.setData({
                        notes_like_add: s
                    });
                    var n = {
                        data: i.data.data.like_note
                    }, d = {};
                    o.triggerEvent("likenotefinish", n, d);
                }
            });
        },
        getNotesLikedData: function(i) {
            o = this, e.getNotesLikedData(i, {
                success: function(e) {
                    wx.hideLoading();
                    var i = o.data.notes_liked, a = e.data.data.notes_liked.notes_liked;
                    if ("object" == (void 0 === a ? "undefined" : t(a))) for (var s in a) i[s] = !0;
                    o.setData({
                        notes_liked: i
                    });
                }
            });
        },
        updateTopicHotNotes: function(t, e) {
            var i = (o = this).data.topic_hot_notes;
            e ? i[t] = !0 : i[t] && delete i[t], console.log("topic_hot_notes", i), o.setData({
                topic_hot_notes: i
            });
        },
        hideTopicNote: function(t) {
            var e = t.currentTarget.dataset.id;
            this.toggleTopicNoteHide(e), this.addHideNode(e);
        },
        addHotTopicNote: function(t) {
            var e = t.currentTarget.dataset.id;
            this.toggleTopicNoteHot(e), this.updateTopicHotNotes(e, !0);
        },
        cancelHotTopicNote: function(t) {
            var e = t.currentTarget.dataset.id;
            this.toggleTopicNoteHot(e), "2" == this.data.topic_tab && this.addHideNode(e), this.updateTopicHotNotes(e, !1);
        },
        toggleTopicNoteHot: function(t) {
            o = this, e.requestAPI({
                path: "topic_note_hot_update",
                method: "post",
                post_data: {
                    topic_id: o.data.topic_id,
                    note_id: t
                },
                success: function(t) {
                    wx.hideLoading(), console.log(t.data), t.data.ret, e.const.API_RET_CODE_SUCC;
                }
            });
        },
        toggleTopicNoteHide: function(t) {
            o = this, e.requestAPI({
                path: "topic_note_hide_update",
                method: "post",
                post_data: {
                    topic_id: o.data.topic_id,
                    note_id: t
                },
                success: function(t) {
                    wx.hideLoading(), console.log(t.data), t.data.ret, e.const.API_RET_CODE_SUCC;
                }
            });
        },
        checkLoginedSignupStatus: function() {
            return console.log("checkLoginedSignupStatus", e.globalData.logined_user_info), 
            e.globalData.logined_user_info.user.signup_status == e.const.API_USER_SIGNUP_STATUS_FINISH;
        },
        showSuperUserView: function(t) {
            if (console.log(t.currentTarget.dataset), "" != this.data.topic_id && this.data.topic_is_super_user) {
                var e = t.currentTarget.dataset.id;
                this.setData({
                    su_seled_note_id: e
                });
            }
        },
        hideSuperUserView: function(t) {
            console.log(t.currentTarget.dataset);
            t.currentTarget.dataset.id;
            this.setData({
                su_seled_note_id: ""
            });
        },
        gotoNoteDetail: function(t) {
            console.log(t.currentTarget.dataset);
            var e = t.currentTarget.dataset.id;
            wx.navigateTo({
                url: "/pages/note_detail/note_detail?note_id=" + e
            });
        },
        gotoRecmdUsers: function(t) {
            console.log(t.currentTarget.dataset), wx.navigateTo({
                url: "/pages/recmd_users/recmd_users"
            });
        },
        gotoRecmdTopic: function(t) {
            console.log(t.currentTarget.dataset);
            var e = t.currentTarget.dataset.topic_id;
            wx.navigateTo({
                url: "/pages/topic_detail/topic_detail?topic_id=" + e
            });
        },
        gotoRecmdSubject: function(t) {
            console.log(t.currentTarget.dataset);
            var e = t.currentTarget.dataset.subject_id;
            wx.navigateTo({
                url: "/pages/subject_detail/subject_detail?subject_id=" + e
            });
        },
        gotoAd: function(t) {
            console.log(t.currentTarget.dataset);
            var e = t.currentTarget.dataset.path;
            wx.navigateTo({
                url: e
            });
        },
        gotoHome: function(t) {
            console.log(t), wx.switchTab({
                url: "/pages/index/index"
            });
        },
        gotoBack: function(t) {
            console.log(t), wx.navigateBack({
                delta: 1
            });
        }
    }
});