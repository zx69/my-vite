## 别人写的最小化vite

通常csdn干货不多, 不过这个小项目手写了最小化版的`vite`, 将`vite`的原理讲的很清楚, 值得推荐.

- 博客地址: https://blog.csdn.net/u010263423/article/details/123458836
- gitee地址: https://gitee.com/lovely_ruby/my-vite/blob/master/my-vite.js

***

### 个人拾遗
#### 使用`path.join`的效果:
- 使用path.join生成的路径更加规范, 虽然不影响使用
```
path.join(__dirname, url) // => D:\github\my-vite\src\main.js
__dirname + url // => D:\github\my-vite/src/main.js
```

#### `@vue/complier-sfc` 作用
将`.vue`文件转换成`js`对象. 转换结果如下:
```
{
  descriptor: {
    filename: 'anonymous.vue',
    source: '<template>\n' +
      '  <div>\n' +
      '    <span>我是{{ count }}</span>\n' +
      '  </div>\n' +
      '</template>\n' +
      '\n' +
      '<script>\n' +
      'import { reactive, toRefs } from "vue";\n' +
      '\n' +
      'export default {\n' +
      '  setup() {\n' +
      '    const state = reactive({\n' +
      '      count: 0,\n' +
      '    });\n' +
      '\n' +
      '    return {\n' +
      '      ...toRefs(state),\n' +
      '    };\n' +
      '  },\n' +
      '};\n' +
      '</script>',
    template: {
      type: 'template',
      content: '\n  <div>\n    <span>我是{{ count }}</span>\n  </div>\n',
    },
    script: {
      type: 'script',
      content: '\n' +
        'import { reactive, toRefs } from "vue";\n' +
        '\n' +
        'export default {\n' +
        '  setup() {\n' +
        '    const state = reactive({\n' +
        '      count: 0,\n' +
        '    });\n' +
        '\n' +
        '    return {\n' +
        '      ...toRefs(state),\n' +
        '    };\n' +
        '  },\n' +
        '};\n',
      loc: [Object],
      attrs: {},
      map: [Object]
    },
    // ...
  },
  errors: []
}
```

#### @vue/compiler-dom作用
将`template`转换成渲染函数