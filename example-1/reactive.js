// 储存副作用函数的同
const buket = new Set()

// 原始数据
const data = { text: 'hello world' }

// 对原始数据进行代理，相当于上面所说的拦截
const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
        // 将副作用函数effect放入储存副作用函数的桶中
        buket.add(effect)
        // 返回属性值
        return target[key]
    },
    // 拦截设置操作
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal
        // 把副作用函数从桶中拿出来并执行
        buket.forEach(fn => fn())
        // 返回true 代表设置操作成功
        return true
    }
})

// 副作用函数
function effect() {
    document.body.innerText = obj.text
}

effect()

setTimeout(() => {
    obj.text = 'hello vue3'
}, 1000)