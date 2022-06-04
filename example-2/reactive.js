// 储存副作用函数的同
const bucket = new Set()

// 用一个全局变量存储被注册的副作用函数
let activeEffect


// 原始数据
const data = { text: 'hello world', username: 'wzh' }


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
        // 将activeEffect 存入桶中
        if (activeEffect) {  // 新增
            bucket.add(activeEffect) // 新增
        } // 新增
        // 返回属性值
        return target[key]
    },
    // 拦截设置操作
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal
        // 把副作用函数从桶中拿出来并执行
        bucket.forEach(fn => fn())
        // 返回true 代表设置操作成功
        return true
    }
})

effect(() => {
    document.body.innerHTML = obj.text
})


setTimeout(() => {
    obj.text = 'hello vue3'
}, 1000)