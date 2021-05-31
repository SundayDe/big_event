$(function () {

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 查询用户信息
        $.ajax({
            method: 'post',
            data: { oldPwd: $('.layui-form [name=oldPwd]').val(), newPwd: $('.layui-form [name=newPwd]').val() },
            url: '/my/updatepwd',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改成功，修改密码后需要重新登录')
                setTimeout(function () {
                    localStorage.removeItem('token')
                    window.parent.location.href = '/login.html'
                }, 1000)
            }
        })
    })
    // 自定义验证
    layui.form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samepass: function (value) {
            if (value === $('.layui-form [name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        repass: function (value) {
            if (value !== $('.layui-form [name=newPwd]').val()) {
                return '两次输入的密码不一致'
            }
        }
    });
})