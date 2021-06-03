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
    // 添加按钮提交操作
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        const data = $(this).serialize()
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
        layer.close(indexAdd)
        getArticlesCate()
    })

    // 获取修改的数据
    let indexEdit = null
    $('tbody').on('click', '#btnEdit', function () {
        // console.log($('#dialog-edit').html());
        const id = this.dataset['id']
        $.ajax({
            url: "/my/article/cates/" + id,
            type: 'get',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取修改文章类别失败')
                indexEdit = layer.open({
                    type: 1,
                    area: ['500px', '250px'],
                    title: '修改文章分类',
                    content: $('#dialog-edit').html()
                })
                layui.form.val("formEdit", res.data)
            }
        })

    })
    // 修改按钮提交操作
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        const data = $(this).serialize()
        console.log(data);
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data,
            success: function (res) {
                if (res.status !== 0) return layer.msg('修改文章类别失败！')
                layer.msg('修改文章类别成功')
            }
        })
        layer.close(indexEdit)
        getArticlesCate()
    })

    // 删除文章
    $('tbody').on('click', '#btnDelete', function () {
        // console.log($('#dialog-edit').html());
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, (index) => {
            const id = this.dataset['id']
            $.ajax({
                url: "/my/article/delectate/" + id,
                type: 'get',
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) return layer.msg('删除文章类别失败')
                    layer.msg(res.message)
                    layer.close(index);
                    getArticlesCate()
                }
            })
        });
    })

})
// 刷新数据
function getArticlesCate() {
    // 获取文章类别列表使用模板渲染页面
    $.get('/my/article/cates', function (res) {
        if (res.status !== 0) {
            return layer.msg('获取文章类别失败')
        }
        const html = template('cate-tql', res)
        document.querySelector('tbody').innerHTML = html
    })
}