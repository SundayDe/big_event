$(function () {
    //点击去注册按钮时
    $("#link_reg").on("click", function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    //点击去登陆按钮时
    $("#link_login").on("click", function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 注册按钮
    $("#form-reg").on("submit", function (e) {
        e.preventDefault();
        // 获取表单数据
        const data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()

        }
        // 提交注册的用户数据
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功请登陆')
            // 清空表单跳转到去登陆页面
            $("#link_login").click();
        })
        this.reset()

    })

    // 登陆按钮
    $('#form-login').on('submit', function (e) {
        e.preventDefault()
        $.post('/api/login', $('#form-login').serialize(), function (res) {
            if (res.status !== 0) {
                return layer.msg('账户或者密码错误')
            }
            layer.msg('登陆成功')
            localStorage.setItem('token', res.token)
            location.href = './index.html'
        })
    })

    // 自定义验证
    layui.form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ], repass: function (value) {
            if (value !== $('.reg-box [name=password]').val()) {
                return '两次输入的密码不一致'
            }
        }
    });
})

