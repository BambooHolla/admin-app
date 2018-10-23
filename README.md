### 关于编译报错问题 <uses-feature> 重复声明
## 由于有的ionic插件会生成与之相对应的 <uses-feature>，但是框架本身也有默认生成的<uses-feature>，如果刚好这2个一直，就会报错，那么需要手动去删除默认生成的<uses-feature>
## 删除位置为 ./platforms/android/adroid.json 删除对应的声明模块




### 关于极光推送
## https://segmentfault.com/a/1190000015099100
## cordova-android 7.0.0一下兼容 https://www.jianshu.com/p/23b117ca27a6