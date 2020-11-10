var t = getApp(), e = null;

Page({
  data: {
    global_configs: t.globalData.configs,
    logined_user_info: {},
    edit_note_id: "",
    edit_note_info: {},
    note_id: "",
    note_type: "",
    topic_id: "",
    topic_info: {},
    task_id: "",
    task_lesson_id: "",
    user_task_status: {},
    rel_topics: [],
    rel_topic_max_sum: 2,
    my_children: [],
    my_children_seled: {},
    upload_photos: [],
    upload_photos_uploaded: [],
    upload_photos_filename: [],
    upload_photos_progress: {},
    pic_contents: [],
    pic_contents_updated: [],
    upload_pic_sec_check_ret: !1,
    upload_pic_max_sum: 20,
    upload_video_show_max_width: 260,
    upload_video_show_width: 200,
    upload_video_show_height: 200,
    upload_video_show: "",
    upload_video: "",
    upload_video_duration: 0,
    upload_video_max_duration: 60,
    upload_video_min_duration: 3,
    upload_video_size: 0,
    upload_video_width: 0,
    upload_video_height: 0,
    form_submit_loading: !1,
    form_fields_err: {},
    note_create_succ: !1
  },
  onLoad: function (o) {
    (e = this).getLoginedUserInfo(), o.edit_note_id && e.setData({
      edit_note_id: o.edit_note_id
    }), o.note_type && e.setData({
      note_type: o.note_type
    }), o.topic_id && (e.setData({
      topic_id: o.topic_id
    }), e.getFromTopicInfoData()), o.task_id && (e.setData({
      task_id: o.task_id
    }), e.getUserTaskStatus()), o.task_lesson_id && e.setData({
      task_lesson_id: o.task_lesson_id
    }), t.globalData.cache.seled_topic_set = [], t.settings_info.defined_const.NOTE_VIDEO_MAX_DURATION && e.setData({
      upload_video_max_duration: t.settings_info.defined_const.NOTE_VIDEO_MAX_DURATION,
      upload_video_min_duration: t.settings_info.defined_const.NOTE_VIDEO_MIN_DURATION
    });
  },
  onShow: function () {
    t.globalData.cache.seled_topic_set && e.setData({
      rel_topics: t.globalData.cache.seled_topic_set
    }), e.getMyChildrenData();
  },
  getLoginedUserInfo: function () {
    t.getLoginedUserInfo({
      success: function (o) {
        o.data.ret == t.const.API_RET_CODE_SUCC && (e.setData({
          logined_user_info: o.data.data.logined_user_info
        }), console.log(e.data), "" != e.data.edit_note_id && e.getNoteDetailData());
      }
    });
  },
  getNoteDetailData: function () {
    t.requestAPI({
      path: "note_detail?note_id=" + e.data.edit_note_id,
      success: function (o) {
        if (wx.hideLoading(), console.log(o.data), o.data.ret == t.const.API_RET_CODE_SUCC) {
          var a = o.data.data.note_detail;
          if (a.note.user_id != e.data.logined_user_info.user.id) return void t.showToastBack("不可以编辑");
          if (e.setData({
            edit_note_info: a,
            note_type: a.note.note_type
          }), "1" == a.note.note_type) {
            var i = e.data.upload_photos, d = e.data.upload_photos_uploaded, s = e.data.upload_photos_filename, n = e.data.pic_contents, _ = e.data.pic_contents_updated;
            a.note.pics.forEach(function (t) {
              i.push(t.pic_s800), d.push(!0), n.push(t.content), _.push(!1), s.push(t.pic_filename);
            }), e.setData({
              upload_photos: i,
              upload_photos_uploaded: d,
              upload_photos_filename: s,
              pic_contents: n,
              pic_contents_updated: _
            });
          } else if ("2" == a.note.note_type) {
            e.setData({
              upload_video_show: a.note.video_url
            });
            var c = a.note.video_width, l = a.note.video_height, p = e.data.upload_video_show_max_width;
            c >= l ? e.setData({
              upload_video_show_width: p,
              upload_video_show_height: p * l / c
            }) : e.setData({
              upload_video_show_width: p * c / l,
              upload_video_show_height: p
            });
          }
          if (a.note.rel_more_topics) {
            var u = e.data.rel_topics;
            a.note.rel_more_topics.forEach(function (t) {
              u.push({
                id: t.topic_id,
                title: t.topic_info.title
              });
            }), e.setRelTopics(u);
          }
          if (a.note.rel_children) {
            var r = e.data.my_children_seled;
            a.note.rel_children.forEach(function (t) {
              r[t.id] = !0;
            }), e.setData({
              my_children_seled: r
            });
          }
        } else t.showToastBack("笔记不存在");
      }
    });
  },
  getFromTopicInfoData: function () {
    t.requestAPI({
      path: "topic_detail?topic_id=" + e.data.topic_id,
      success: function (o) {
        if (wx.hideLoading(), console.log(o.data), o.data.ret == t.const.API_RET_CODE_SUCC) {
          if (e.setData({
            topic_info: o.data.data.topic_detail
          }), "1" == e.data.topic_info.topic.topic_type) {
            var a = e.data.rel_topics;
            a.push({
              id: e.data.topic_info.topic.id,
              title: e.data.topic_info.topic.title
            }), e.setRelTopics(a);
          }
        } else wx.showToast({
          title: "话题不存在",
          icon: "none",
          duration: 1e3
        }), setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 1e3);
      }
    });
  },
  getUserTaskStatus: function () {
    t.requestAPI({
      path: "user_task_status?task_id=" + e.data.task_id,
      success: function (o) {
        wx.hideLoading(), console.log(o.data), o.data.ret == t.const.API_RET_CODE_SUCC && e.setData({
          user_task_status: o.data.data.user_task_status.user_task_status
        });
      }
    });
  },
  getMyChildrenData: function () {
    t.requestAPI({
      path: "my_children",
      success: function (o) {
        wx.hideLoading(), console.log(o.data), o.data.ret == t.const.API_RET_CODE_SUCC && e.setData({
          my_children: o.data.data.my_children.my_children
        });
      }
    });
  },
  selChildren: function (t) {
    var o = t.currentTarget.dataset.id, a = e.data.my_children_seled;
    a[o] ? delete a[o] : a[o] = !0, e.setData({
      my_children_seled: a
    });
  },
  onPicContentInput: function (t) {
    console.log("onPicContentInput", t);
    var e = t.currentTarget.dataset.index, o = t.detail.value, a = this.data.pic_contents;
    a[e] = o;
    var i = this.data.pic_contents_updated;
    i[e] = !0, this.setData({
      pic_contents: a,
      pic_contents_updated: i
    });
  },
  submitNoteCreate: function (o) {
    console.log("submitNoteCreate", o);
    var a = o.detail.formId;
    if (console.log("form_id", a), t.saveUserFormid(a), this.data.form_submit_loading) return !1;
    var i = {}, d = o.detail.value;
    if ("" != d.title) if ("1" != e.data.note_type || 0 != e.data.upload_photos.length) if ("2" != this.data.note_type || "" != this.data.upload_video || "" != this.data.upload_video_show) if ([].forEach(function (t) {
      "" == d[t] && (i[t] = !0);
    }), this.setData({
      form_fields_err: i
    }), console.log(i), Object.keys(i).length > 0) this.setData({
      form_submit_loading: !1
    }); else {
      this.setData({
        form_submit_loading: !0
      });
      var s = {
        note_id: e.data.edit_note_id,
        note_type: e.data.note_type,
        title: d.title,
        content: d.content || "",
        topic_id: e.data.topic_id,
        task_id: e.data.task_id,
        task_lesson_id: e.data.task_lesson_id,
        children_ids: Object.keys(e.data.my_children_seled).join(",")
      }, n = [];
      e.data.rel_topics.forEach(function (t) {
        n.push(t.id);
      }), s.rel_topics = n.join(","), wx.showLoading({
        title: "正在提交"
      }), t.requestAPI({
        path: "note_create",
        method: "post",
        post_data: s,
        success: function (o) {
          if (console.log("success", o), o.data.ret == t.const.API_RET_CODE_SUCC) {
            wx.hideLoading();
            var a = o.data.data.note_create.note_id;
            e.setData({
              note_id: a
            });
            var i = o.data.data.note_create.point_change_res;
            if (t.globalData.cache.point_change_res = i, "1" == e.data.note_type) {
              if (e.data.upload_photos.length > 0) {
                var d = e.data.upload_photos_filename, s = e.data.upload_photos_uploaded, n = 0, _ = {};
                e.data.upload_photos.forEach(function (t, e) {
                  s[e] || (_[t] = 0, n++);
                }), console.log(_), e.setData({
                  upload_photos_progress: _
                }), 0 == n ? (e.notePicsSortUpdate(), e.notePicsContentUpdate()) : e.data.upload_photos.forEach(function (o, i) {
                  s[i] || (wx.showLoading({
                    title: "正在上传"
                  }), e.uploadPhoto({
                    path: o,
                    note_id: a,
                    content: e.data.pic_contents[i],
                    success: function (a) {
                      console.log(a);
                      var s = JSON.parse(a.data);
                      if (s.ret == t.const.API_RET_CODE_SUCC) {
                        s.data.note_upload_pic.sec_check_ret == t.const.API_CHAR_BOOL_YES && e.setData({
                          upload_pic_sec_check_ret: !0
                        }), d[i] = s.data.note_upload_pic.filename, _[o] = 100, console.log(_);
                        var c = 0;
                        for (var l in _) 100 == _[l] && c++;
                        console.log("upload_finished_count", c), c == n && (wx.hideLoading(), e.notePicsSortUpdate(),
                          e.notePicsContentUpdate());
                      } else e.setData({
                        form_submit_loading: !1
                      }), t.showToastNone("图片上传失败");
                    }
                  }));
                });
              }
            } else "2" == e.data.note_type && ("" != e.data.upload_video ? (wx.showLoading({
              title: "正在上传"
            }), e.uploadVideo({
              note_id: a,
              path: e.data.upload_video,
              width: e.data.upload_video_width,
              height: e.data.upload_video_height,
              duration: e.data.upload_video_duration,
              size: e.data.upload_video_size,
              success: function (o) {
                console.log(o), wx.hideLoading(), JSON.parse(o.data).ret == t.const.API_RET_CODE_SUCC && console.log("video upload ret ok"),
                  e.noteCreateSucc();
              }
            })) : e.noteCreateSucc());
          } else wx.hideLoading(), e.setData({
            form_submit_loading: !1
          }), "47" == o.data.errno ? t.showToastNone("标题不能超过20个字") : t.showToastNone("笔记发布失败");
        },
        fail: function (o) {
          console.log("fail", o), wx.hideLoading(), e.setData({
            form_submit_loading: !1
          }), t.showToastNone("上传失败，请联系客服");
        }
      });
    } else t.showToastNone("请选择视频"); else t.showToastNone("请选择照片"); else t.showToastNone("请填写标题");
  },
  notePicsSortUpdate: function () {
    t.requestAPI({
      path: "note_pics_sort_update",
      method: "post",
      post_data: {
        note_id: e.data.note_id,
        pic_filenames: e.data.upload_photos_filename.join(",")
      },
      success: function (o) {
        console.log("success", o), o.data.ret == t.const.API_RET_CODE_SUCC && (o.data.data.note_pics_sort_update.sec_check_ret == t.const.API_CHAR_BOOL_YES && e.setData({
          upload_pic_sec_check_ret: !0
        }), e.noteCreateSucc());
      }
    });
  },
  notePicsContentUpdate: function () {
    var o = e.data.upload_photos_uploaded, a = e.data.upload_photos_filename, i = e.data.pic_contents, d = e.data.pic_contents_updated;
    o.forEach(function (o, s) {
      o && d[s] && (wx.showLoading({
        title: "正在提交"
      }), t.requestAPI({
        path: "note_pic_content_update",
        method: "post",
        post_data: {
          note_id: e.data.note_id,
          pic_filename: a[s],
          content: i[s]
        },
        success: function (e) {
          wx.hideLoading(), console.log("success", e), e.data.ret, t.const.API_RET_CODE_SUCC;
        }
      }));
    });
  },
  noteCreateSucc: function () {
    e.setData({
      note_create_succ: !0
    }), e.data.upload_pic_sec_check_ret ? (wx.showToast({
      title: "该笔记内容需要系统审核，请耐心等待",
      icon: "none",
      duration: 2e3
    }), setTimeout(function () {
      wx.switchTab({
        url: "/pages/index/index"
      });
    }, 1e3)) : "" == e.data.edit_note_id ? (wx.showToast({
      title: "发布成功",
      icon: "success",
      duration: 1e3
    }), setTimeout(function () {
      if ("1" == e.data.note_type && (t.globalData.cache.share_note_id = e.data.note_id),
        t.globalData.cache.point_change_res && t.globalData.cache.point_change_res.change_point) {
        var o = t.globalData.cache.point_change_res;
        t.showUserPointChange(e, o, function () {
          wx.switchTab({
            url: "/pages/index/index"
          });
        }), delete t.globalData.cache.point_change_res;
      } else wx.switchTab({
        url: "/pages/index/index"
      });
    }, 500)) : (wx.showToast({
      title: "编辑成功",
      icon: "success",
      duration: 1e3
    }), setTimeout(function () {
      wx.navigateBack({
        delta: 1
      });
    }, 1e3));
  },
  uploadPhoto: function (e) {
    wx.uploadFile({
      url: t.globalData.configs.api_url_prefix + "note_upload_pic",
      filePath: e.path,
      name: "file",
      header: {
        "User-Ticket": t.getUserTicket()
      },
      formData: {
        note_id: e.note_id,
        content: e.content
      },
      success: e.success
    });
  },
  bindPhotoAdd: function (o) {
    console.log(o.currentTarget.dataset);
    var a = o.currentTarget.dataset.index;
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (o) {
        var i = o.tempFilePaths, d = e.data.upload_photos, s = e.data.upload_photos_uploaded, n = e.data.upload_photos_filename;
        if (d.length >= e.data.upload_pic_max_sum) t.showToastNone("最多上传" + e.data.upload_pic_max_sum + "图片"); else {
          i.length + d.length > e.data.upload_pic_max_sum && (i = i.slice(0, e.data.upload_pic_max_sum - d.length)),
            console.log("new insert pics", i);
          var _ = 0;
          i.forEach(function (t) {
            d.splice(a + _, 0, t), s.splice(a + _, 0, !1), n.splice(a + _, 0, ""), _++;
          }), console.log("after insert pics", d), e.setData({
            upload_photos: d,
            upload_photos_uploaded: s,
            upload_photos_filename: n
          });
          var c = e.data.pic_contents, l = e.data.pic_contents_updated;
          i.forEach(function (t) {
            c.splice(a, 0, ""), l.splice(a, 0, !1);
          }), e.setData({
            pic_contents: c,
            pic_contents_updated: l
          });
        }
      }
    });
  },
  bindPhotoChange: function (t) {
    console.log(t.currentTarget.dataset);
    var o = t.currentTarget.dataset.index;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (t) {
        var a = t.tempFilePaths, i = e.data.upload_photos, d = e.data.upload_photos_uploaded, s = e.data.upload_photos_filename;
        console.log("change pics", a), i[o] = a[0], d[o] = !1, s[o] = "", console.log("after change pics", i),
          e.setData({
            upload_photos: i,
            upload_photos_uploaded: d,
            upload_photos_filename: s
          });
      }
    });
  },
  bindRemovePhoto: function (t) {
    console.log(t.currentTarget.dataset), wx.showModal({
      title: "温馨提示",
      content: "此图片下的相关文字也会同步移除，确认删除吗？",
      confirmText: "删除",
      cancelText: "不删除",
      success: function (o) {
        if (o.confirm) {
          var a = t.currentTarget.dataset.index, i = e.data.upload_photos, d = e.data.upload_photos_uploaded, s = e.data.upload_photos_filename, n = e.data.pic_contents, _ = e.data.pic_contents_updated;
          console.log("before remove pic", i), i.splice(a, 1), d.splice(a, 1), s.splice(a, 1),
            n.splice(a, 1), _.splice(a, 1), console.log("after remove pic", i), e.setData({
              upload_photos: i,
              upload_photos_uploaded: d,
              upload_photos_filename: s,
              pic_contents: n,
              pic_contents_updated: _
            });
        } else o.cancel;
      }
    });
  },
  uploadVideo: function (e) {
    wx.uploadFile({
      url: t.globalData.configs.api_url_prefix + "note_upload_video",
      filePath: e.path,
      name: "file",
      header: {
        "User-Ticket": t.getUserTicket()
      },
      formData: {
        note_id: e.note_id,
        width: e.width,
        height: e.height,
        duration: e.duration,
        size: e.size
      },
      success: e.success
    });
  },
  bindVideoAdd: function (t) {
    wx.chooseVideo({
      sourceType: ["album", "camera"],
      maxDuration: 60,
      camera: ["back"],
      success: function (t) {
        if (console.log(t), t.duration > e.data.upload_video_max_duration || t.duration < e.data.upload_video_min_duration) wx.showModal({
          title: "温馨提示",
          content: "支持" + e.data.upload_video_min_duration + "~" + e.data.upload_video_max_duration + "秒",
          confirmText: "我知道了",
          showCancel: !1,
          success: function (t) { }
        }); else {
          e.setData({
            upload_video_show: t.tempFilePath
          });
          var o = e.data.upload_video_show_max_width;
          t.width >= t.height ? e.setData({
            upload_video_show_width: o,
            upload_video_show_height: o * t.height / t.width
          }) : e.setData({
            upload_video_show_width: o * t.width / t.height,
            upload_video_show_height: o
          }), e.setData({
            upload_video: t.tempFilePath,
            upload_video_width: t.width,
            upload_video_height: t.height,
            upload_video_duration: t.duration,
            upload_video_size: t.size
          });
        }
      }
    });
  },
  bindRemoveVideo: function (t) {
    console.log(t), e.setData({
      upload_video: "",
      upload_video_show: ""
    });
  },
  gotoRelTopicSel: function () {
    e.data.rel_topics.length >= e.data.rel_topic_max_sum ? wx.showToast({
      title: "最多关联" + e.data.rel_topic_max_sum + "个话题",
      icon: "none",
      duration: 1e3
    }) : wx.navigateTo({
      url: "/pages/note_create_topic_sel/note_create_topic_sel?topic_id=" + e.data.topic_id
    });
  },
  removeRelTopic: function (t) {
    console.log(t.currentTarget.dataset);
    var o = t.currentTarget.dataset.index, a = e.data.rel_topics;
    a.splice(o, 1), e.setRelTopics(a);
  },
  setRelTopics: function (o) {
    e.setData({
      rel_topics: o
    }), t.globalData.cache.seled_topic_set = e.data.rel_topics;
  },
  gotoChildCreate: function () {
    wx.navigateTo({
      url: "/pages/child_create/child_create"
    });
  }
});