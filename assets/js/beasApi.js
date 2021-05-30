//拼接请求
$.ajaxPrefilter(function (option) {
    options.url = 'http://api-breakingnews-web.itheima.net' + option.url
})