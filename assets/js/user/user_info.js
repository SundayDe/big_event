const form = layui.form
$(function () {
    initUserInfo()
    form.verify({
        nickname: function (val) {
            if (val.length >= 6) {
                return '昵称必须是1-6位'
            }
        }
    })


    function initUserInfo() {
        $.get('/my/userinfo', function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }
            // 调取layui form.val来对表单复制
            form.val('formUserInfo', res.data)
        })
    }
    // 重置按钮设置
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo()

    })
    // 提交数据
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.post('/my/userinfo', $('.layui-form').serialize(), function (res) {
            if (res.status !== 0) {
                return layer.msg('更新用户信息失败!')
            }
            layer.msg(res.message)
            window.parent.getUserInfo()
        })
    })
})