## 关于编译报错问题 <uses-feature> 重复声明
### 由于有的ionic插件会生成与之相对应的 <uses-feature>，但是框架本身也有默认生成的<uses-feature>，如果刚好这2个一直，就会报错，那么需要手动去删除默认生成的<uses-feature>
###删除位置为 ./platforms/android/adroid.json 删除对应的声明模块

1


### 关于极光推送
### https://segmentfault.com/a/1190000015099100
### cordova-android 7.0.0一下兼容 https://www.jianshu.com/p/23b117ca27a6

# 项目说明 （该管理app因为是新建，暂时功能点不多）
1. 页面基础功能是基于app-framework里面的封装(重要)
2. 路由跳转使用routeTo()进行跳转，新增页面使用ionic g page <name>，页面的新增需要根据页面附属进行新增，如：tab-asset页面的子页面，放在page/tab-asset文件夹下，如果是独立的页面，放置于page文件夹
3. 服务以及数据放置于providers文件夹（请求服务根据名字即可了解）主要有：
    1. > app-data-service app的缓存数据服务，用于记录app的操作
    2. > app-setting app的设置服务，用于一直默认值的记录
    3. > back-button-service 用于硬件返回统一管理
    4. > keyboard-service 键盘弹出事件的统一管理
    5. > app-page-service app通用页面监听功能，
4. directices指令
    1. > scroll-fix-keyboard 用于有的输入框需要对焦功能
    2. > set-input-status 输入框的校验（未使用到项目中）
