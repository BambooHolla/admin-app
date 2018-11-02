(()=>{
    "use strict"
    var iconDiv = document.querySelector('.spinner');
    var appLoadAnimation = {
        duration: 3000, // 运行总时间
        count: 5, // 总切换次数（根据雪碧图）.../assets/icon/loading-icon.png
        runCount: 0, // 已切换次数
        changeTime: 600, // 每次切换时间，根据总时间跟切换次数所得
        computing: function() {
            this.changeTime = this.duration/this.count;
        },
        create: function(time,count) {
            this.time = time || 3000;
            this.count = count || 5;
            this.computing();
            return this;
        },
        run: function() {
            iconDiv.classList.add("");
        },
        changeIcon: function() {

        }
    };
    
    var count = 0;
    var duration = "5s";
    var changeTime = 
    function runAnimation() {

    }
    function everyRunTime() {

    }
    function changeIcon() {
        
    }
})()