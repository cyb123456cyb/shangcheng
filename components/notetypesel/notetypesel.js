var t = getApp();

Component({
    properties: {
        show_sel: {
            type: Boolean,
            value: !1
        },
        topic_id: {
            type: String,
            value: ""
        },
        task_id: {
            type: String,
            value: ""
        },
        task_lesson_id: {
            type: String,
            value: ""
        }
    },
    data: {},
    lifetimes: {
        attached: function() {},
        moved: function() {},
        detached: function() {}
    },
    methods: {
        cancelSel: function() {
            this._hideSel();
        },
        _hideSel: function() {
            this.setData({
                show_sel: !1
            });
        },
        gotoNoteCreatePhoto: function(e) {
            var o = e.detail.formId;
            console.log("form_id", o),  this.gotoNoteCreate("1");
        },
        gotoNoteCreateVideo: function(e) {
            var o = e.detail.formId;
            console.log("form_id", o), this.gotoNoteCreate("2");
        },
        gotoNoteCreate: function(t) {
            this._hideSel(), wx.navigateTo({
                url: "/pages/AddDynamics/AddDynamics?note_type=" +t
            });
        }
    }
});