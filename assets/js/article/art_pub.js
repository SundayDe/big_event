$(function () {
    let state = '已发布'
    // 初始化富文本编辑器
    initEditor()

    //初始化下拉菜单
    initCate()
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
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 打开上传文件的选择框
    $('#imgbtn').on('click', function () {
        $('#file').click()
    })
    // 上传文件修改裁剪区域
    $('#file').on('change', function (e) {
        const files = e.target.files;
        if (!files.length) {
            return layer.msg('请选择上传的文件')
        }
        // 1. 拿到用户选择的文件
        let [file] = files
        // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    $('#btnSave2').on('click', function () {
        state = '草稿'
    })
    // 提交事件
    // 为表单绑定 submit 提交事件
    $('#form').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                console.log(fd);
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/article_list.html'
            }
        })
    }
})