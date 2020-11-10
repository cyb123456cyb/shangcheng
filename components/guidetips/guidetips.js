// components/guidetips/guidetips.js
Page({data: {tip1:"exapp/tips-pics/tip1.png",
    tip2: "wxapp/tips-pics/tip2.png",
    tip3: "wxapp/tips-pics/tip3.png",
    tip4: "wxapp/tips-pics/tip4.png",
    tip5: "wxapp/tips-pics/tip5.png",
    tip6: "wxapp/tips-pics/tip6.png",
    tip7: "wxapp/tips-pics/tip7.png",
    tip8: "wxapp/tips-pics/tip8.png",
    tip9: "wxapp/tips-pics/tip9.png",
    tip10: "wxapp/tips-pics/tip10.png",
    tip11: "wxapp/tips-pics/tip11.png"}})
    ;

Component({
    properties: {},
    data: {
        show_guide: !0,
        guide_type: "",
        tips_pic_url: "",
        guide_top: 0,
        guide_bottom: 0
    },
    ready: function() {},
    lifetimes: {
        attached: function() {},
        moved: function() {},
        detached: function() {}
    },
    pageLifetimes: {
        show: function() {},
        hide: function() {},
        resize: function() {}
    },
    methods: {
        hideGuide: function() {
            this.setData({
                show_guide: !1,
                guide_type: ""
            });
        },
        showGuide: function(e) {
            console.log(e), this.setData({
                show_guide: !0,
                guide_type: e.guide_type,
                guide_top: e.guide_top || 0,
                guide_bottom: e.guide_bottom || 0,
                tips_pic_url: p.globalData.configs.img_url_prefix + t[e.guide_type]
            }), console.log(this.data), i = this, setTimeout(function() {
                i.hideGuide();
            }, 3e3);
        }
    }
});