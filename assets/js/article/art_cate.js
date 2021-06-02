$(function () {
    getArticlesCate()
    let indexAdd = null
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    $('body').on('submit', function (e) {
        e.preventDefault()
        const data = $('#form-add').serialize()
        // console.log(data);
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data,
            success: function (res) {
                if (res.status !== 0) return layer.msg('添加文章类别失败！')
                layer.msg('添加文章类别成功')
            }
        })
        getArticlesCate()
        layer.close(indexAdd)
    })
})
function getArticlesCate() {
    // 获取文章类别列表使用模板渲染页面
    $.get('/my/article/cates', function (res) {
        if (res.status !== 0) {
            return layer.msg('获取文章类别失败')
        }
        const html = template('cate-tql', res)
        document.getElementById('cate').innerHTML = html
    })
}