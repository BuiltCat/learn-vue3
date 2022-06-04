// 储存副作用函数的同
const bucket = new WeakMap()

// 用一个全局变量存储被注册的副作用函数
let activeEffect


// 原始数据
const data = { text: 'hello world' }


// effect 函数用于注册副作用函数
function effect(fn) {
    // 当调用effect注册副作用函数时，将副作用函数fn赋值给activeEffect
    activeEffect = fn
    // 执行副作用函数
    fn()
}

// 对原始数据进行代理，相当于上面所说的拦截
const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
        // 没有activeEffect时，直接return 没有副作用函数
        if (!activeEffect) return target[key]
        // 根据target从“桶”中取得depsMap，他也是一个Map类型：key --> effects
        let depsMap = bucket.get(target)
        // 如果不存在deps，就创建一个新的Map与target进行关联
        if (!depsMap) {
            bucket.set(target, (depsMap = new Map()))
        }
        // 再根据key从desMap中取得deps，他是一个Set类型，
        // 里面存储着所有与当前key相关联的副作用函数：effects
        let deps = depsMap.get(key)
        // 如果deps不存在，同样创建一个新的Set与key进行关联
        if (!deps) {
            depsMap.set(key, (deps = new Set()))
        }
        //  最后将当前激活的副作用函数添加到“桶”里
        deps.add(activeEffect)
        return target[key]

    },
    // 拦截设置操作
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal
        // 根据target从桶中取得depsMap，他是key --> effects
        const depsMap = bucket.get(target)
        if (!depsMap) return
        // 根据key取得所有副作用函数effects
        const effects = depsMap.get(key)
        // 执行副作用函数
        effects && effects.forEach(fn => fn())
    }
})

effect(() => {
    document.body.innerHTML = obj.text
})


setTimeout(() => {
    obj.text = 'hello vue3'
}, 1000)