getApp();

var t = null;

Component({
    properties: {},
    data: {
        show_pic: !1,
        pic_tips: "",
        pic_url: "",
        save_photo_authed: !1
    },
    ready: function() {
        console.log("sharepic.ready"), t = this, wx.getSetting({
            success: function(o) {
                console.log(o), o.authSetting["scope.writePhotosAlbum"] && t.setData({
                    save_photo_authed: !0
                });
            }
        });
    },
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
        hidePic: function() {
            this.setData({
                show_pic: !1,
                pic_url: "",
                pic_tips: ""
            });
        },
        showPic: function(t) {
            console.log(t), this.setData({
                pic_url: t.pic_url,
                pic_tips: t.pic_tips
            }), wx.showLoading({
                title: "努力生成海报中"
            });
        },
        onPicLoaded: function() {
            wx.hideLoading(), this.setData({
                show_pic: !0
            });
        },
        checkSavePhotoAuthed: function() {
            return !!t.data.save_photo_authed || (wx.authorize({
                scope: "scope.writePhotosAlbum",
                success: function() {
                    wx.showModal({
                        title: "温馨提示",
                        content: "已开启授权，快保存图片吧！",
                        showCancel: !1
                    }), t.setData({
                        save_photo_authed: !0
                    });
                },
                fail: function() {
                    wx.showModal({
                        title: "温馨提示",
                        content: "如果不开启授权，无法保存海报图片哦！",
                        showCancel: !1
                    }), t.setData({
                        save_photo_authed: !1
                    });
                }
            }), !1);
        },
        downloadPic: function() {
            this.checkSavePhotoAuthed() && (wx.showLoading({
                title: "正在下载"
            }), wx.downloadFile({
                url: t.data.pic_url,
                success: function(o) {
                    wx.hideLoading(), console.log(o), wx.saveImageToPhotosAlbum({
                        filePath: o.tempFilePath,
                        success: function(o) {
                            wx.showToast({
                                title: "保存成功",
                                icon: "success",
                                duration: 1500
                            }), t.hidePic();
                        },
                        fail: function(o) {
                            console.log(o), "saveImageToPhotosAlbum:fail auth deny" === o.errMsg && (console.log("请重新授权"), 
                            t.setData({
                                writePhotosAlbumAuthed: !1
                            }));
                        }
                    });
                }
            }));
        }
    }
});