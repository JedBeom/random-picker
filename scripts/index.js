let app = new Vue({
    el: '#app',
    data: {
        items: ["-"],
        title: "",
        index: 0,
        running: false,
        eventBuffer: null,
        speed: 5,
        startTime: 200,
        durning: 100,
        fastDurning: 1500
    },
    methods: {
        getRandom: function (min, max) {
            this.index = Math.floor(Math.random() * max) + min
        },
        delay: function (delayInms) {
            return new Promise(resolve => {
                setTimeout( () => {
                    resolve(2)
                }, delayInms)
            })
        },
        runCycle: async function () {
            $('[data-toggle="tooltip"]').tooltip('dispose')

            let tmpTime = this.startTime
            this.running = true
            this.items = items.groups[items.activedIndex].items.split('\n')
            this.title = items.groups[items.activedIndex].title
            if (this.items.length === 1) {
                if (this.items[0] === "") {
                    this.items = ["-"]
                }
                this.index = 0
                this.running = false
                return
            }

            this.eventBuffer = setInterval( () => {
                this.getRandom(0, this.items.length)
            }, this.startTime)

            while(tmpTime > 0){
                tmpTime -= this.speed
                setTimeout( () => {
                    clearInterval(this.eventBuffer)
                    this.eventBuffer = setInterval( () => {
                        this.getRandom(0, this.items.length)
                    }, tmpTime)
                }, this.durning)
                let delayres = await this.delay(this.durning)
            }
            
            let delayres = await this.delay(this.fastDurning)

            while(tmpTime <= this.startTime){
                tmpTime += this.speed
                setTimeout( () => {
                    clearInterval(this.eventBuffer)
                    this.eventBuffer = setInterval( () => {
                        this.getRandom(0, this.items.length)
                    }, tmpTime)
                }, this.durning)
                let delayres = await this.delay(this.durning)
            }
            
            setTimeout( () => {
                clearInterval(this.eventBuffer)
                this.running = false
                $('[data-toggle="tooltip"]').tooltip()
            }, this.durning)
        }
    }
})

let items = new Vue({
    el: '#items',
    data: {
        groups: [
            {
                "title": "기본그룹",
                "items": "여기에 옵션을 입력합니다.",
            }
        ],
        activedIndex: 0,
        actived: "group-0"
    },
    methods: {
        emptyGroup: function () {
            this.actived = "group-0"
            this.groups = [
                {
                    "title": "기본그룹",
                    "items": "여기에 옵션을 입력합니다.",
                }
            ]
        },
        addGroup: function () {
            this.groups.push({"title": "", "items": ""})
        },
        setActive: function (index) {
            this.actived = "group-" + index
            this.activedIndex = index
        },
        importOption: function (e) {
            var fr=new FileReader()
            var text='';
            fr.addEventListener('load', (event) => {
                text = event.target.result
                this.groups = JSON.parse(text)
            });
            fr.readAsText(e.target.files[0])
        },
        exportOption: function () {
            var json = new Blob([JSON.stringify(this.groups, null, '\t')], {type: 'text/plain'})
            var jfile = window.URL.createObjectURL(json)
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = jfile
            a.download = `random-picker-setting.json`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(jfile)
        }
    },
    beforeMount: function() { 
        if (Cookies.get('items')) {
            this.groups = JSON.parse(Cookies.get('items'))
        }
     },
    updated: function() {
        Cookies.set('items', JSON.stringify(this.groups))
    }
})

axios.get(`data/website-info.json?nocache=${new Date()}`)
    .then(function (response) {
        let json = response.data;

        let depLib = new Vue({
            el: '#dependence-lib',
            data: {
                dependence: json.dependence
            },
            mounted: function () {
                $('[data-toggle="tooltip"]').tooltip()
            }
        }) 
        
        let ver = new Vue({
            el: '#version',
            data: {
                versions: json.changeLog
            }
        }) 

        let copyright = new Vue({
            el: '#copyright',
            data: {
                versions: json.changeLog.reverse()[0].ver
            }
        }) 
    })
    .catch(function (error) {
        console.log(error);
    })


let b2t = new Vue({
    el: '#b2t-container',
    data: {
        isTop: true,
        styles: {
            bottom: '-120px'
        }
    },
    mounted: function () {
        window.addEventListener('scroll', () => {
            this.isTop = !(document.body.scrollTop > 0);
            this.styles.bottom = this.isTop ? '-120px' : '0' 
        })
    }
})

let blogo = new Vue({
    el: '#blogo',
    data: app._data
})