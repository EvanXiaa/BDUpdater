v4.0.0:
## breaking change
- drop node < 4 #113

## new feature
- `babel/no-invalid-this`: doesn't fail when inside class properties #101

``` js
class a {
  a = this.b;
}
```

## deprecated rules #115

> many rules are built-in now since eslint supports es2017, etc
- `babel/generator-star-spacing`: use [`generator-star-spacing`](http://eslint.org/docs/rules/generator-star-spacing).
- `babel/object-shorthand`: use [`object-shorthand`](http://eslint.org/docs/rules/object-shorthand).
- `babel/arrow-parens`: use [`arrow-parens`](http://eslint.org/docs/rules/arrow-parens).
- `babel/func-params-comma-dangle`: use [`comma-dangle`](http://eslint.org/docs/rules/comma-dangle).
- `babel/array-bracket-spacing`: use [`array-bracket-spacing`](http://eslint.org/docs/rules/array-bracket-spacing).
- `babel/flow-object-type`: use [`flowtype/object-type-delimiter`](https://github.com/gajus/eslint-plugin-flowtype#eslint-plugin-flowtype-rules-object-type-delimiter).
