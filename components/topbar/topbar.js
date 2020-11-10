var t = getApp(), o = wx.getSystemInfoSync().statusBarHeight;

Component({
    properties: {
        title: {
            type: String,
            value: ""
        },
        bottom_border: {
            type: Boolean,
            value: !1
        },
        back: {
            type: Boolean,
            value: !1
        },
        home: {
            type: Boolean,
            value: !1
        },
        bgempty: {
            type: Boolean,
            value: !1
        },
        common: {
            type: Boolean,
            value: !1
        },
        back_confirm: {
            type: Boolean,
            value: !1
        },
        back_confirm_content: {
            type: String,
            value: ""
        },
        back_confirm_text_confirm: {
            type: String,
            value: ""
        },
        back_confirm_text_cancel: {
            type: String,
            value: ""
        }
    },
    data: {
        status_bar_height: o
    },
    methods: {
        submitGotoBack: function(o) {
            var e = o.detail.formId;
            console.log("form_id", e), t.saveUserFormid(e), this.gotoBack();
        },
        submitGotoHome: function(o) {
            var e = o.detail.formId;
            console.log("form_id", e), t.saveUserFormid(e), this.gotoHome();
        },
        gotoHome: function(t) {
            console.log(t), this.data.back_confirm ? wx.showModal({
                title: "温馨提示",
                content: this.data.back_confirm_content,
                confirmText: this.data.back_confirm_text_confirm,
                cancelText: this.data.back_confirm_text_cancel,
                success: function(t) {
                    t.confirm ? wx.switchTab({
                        url: "/pages/index/index"
                    }) : t.cancel;
                }
            }) : wx.switchTab({
                url: "/pages/index/index"
            });
        },
        gotoBack: function(t) {
            console.log(t), this.data.back_confirm ? wx.showModal({
                title: "温馨提示",
                content: this.data.back_confirm_content,
                confirmText: this.data.back_confirm_text_confirm,
                cancelText: this.data.back_confirm_text_cancel,
                success: function(t) {
                    t.confirm ? wx.navigateBack({
                        delta: 1
                    }) : t.cancel;
                }
            }) : wx.navigateBack({
                delta: 1
            });
        }
    }
});