//拼接请求
$.ajaxPrefilter(function (option) {
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url

    if (option.url.includes('/my/')) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
        option.complete = function (res) {
            console.log(res.responseJSON);
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1. 强制清空 token
                localStorage.removeItem('token')
                // 2. 强制跳转到登录页面
                location.href = '/login.html'
            }
        }
    }
})