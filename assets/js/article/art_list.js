$(function () {
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var data = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            type: "get",
            data,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败')
                const htmlStr = template('list-tpl', res)
                document.querySelector('tbody').innerHTML = htmlStr
                renderPage(res.total)
            }
        })
    }

    // 过滤器
    template.defaults.imports.dateFormat = function (date, format) {
        return dateFormat(date, format)
    };
    initCate()
    //初始化下拉菜单
    function initCate() {
        // 获取文章类别列表使用模板渲染页面
        $.get('/my/article/cates', function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章类别失败')
            }
            const htmlStr = template('cateType-tql', res)
            $('[name=cate_id]').html(htmlStr)
            layui.form.render()
        })
    }

    // 筛选按钮操作
    $('#formSelect').on('submit', function (e) {
        e.preventDefault();
        data.cate_id = $('[name=cate_id]').val()
        data.state = $('[name=state]').val()
        initTable()
    })

    // 分页功能
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        layui.laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: data.pagesize, // 每页显示几条数据
            curr: data.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
            // 分页发生切换的时候，触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // 把最新的页码值，赋值到 data 这个查询参数对象中
                data.pagenum = obj.curr
                // 把最新的条目数，赋值到 data 这个查询参数对象的 pagesize 属性中
                data.pagesize = obj.limit
                // 根据最新的 data 获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除功能
    $('tbody').on('click', '#btnDel', function () {
        let len = $('#btnDel').length
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, (index) => {
            const id = this.dataset['id'];
            // 发起删除请求
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (response) {
                    if (response.status !== 0) return layer.msg('删除文章失败')
                    layer.msg(response.message)



                    // 判断删除按钮是否剩余最后一个，证明是不是最后一条数据
                    if (len === 1 && data.pagenum > 1) {
                        data.pagenum--;
                    }
                    initTable()
                }
            })

        })
    })
})