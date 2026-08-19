v11.0.0
# [11.0.0](https://github.com/sweetalert2/sweetalert2/compare/v10.16.7...v11.0.0) (2021-05-14)

### :red_circle: Breaking change # 1 - IE11 and Legacy Edge support is DISCONTINUED

If you need to support these old browsers in your project, please use the previous major release [v10.16.7](https://github.com/sweetalert2/sweetalert2/releases/tag/v10.16.7)

---

## :red_circle: Breaking change # 2 - `.queue()`, `.getQueueStep()`, `.insertQueueStep()`, `.deleteQueueStep()` methods are REMOVED

`async/await` can perfectly replace all use-cases of `.queue()`.

---

## :red_circle: Breaking change # 3 - deprecated lifecycle hooks are REMOVED

Replace them with new ones:

- `onBeforeOpen` -> `willOpen`
- `onOpen` -> `didOpen`
- `onRender` -> `didRender`
- `onClose` -> `willClose`
- `onAfterClose` -> `didClose`
- `onDestroy` -> `didDestroy`

---

## :red_circle: Breaking change # 4 - deprecated `animation` param is REMOVED

Use `showClass` and `hideClass` instead:

```js
Swal.fire({
  ...
  showClass: {
    backdrop: 'swal2-noanimation', // disable backdrop animation
    popup: '',                     // disable popup animation
    icon: ''                       // disable icon animation
  },
  hideClass: {
    popup: '',                     // disable popup fade-out animation
  },
})
```

---

## :red_circle: Breaking change # 5 - `.swal2-header` and `.swal2-content` blocks and related methods `.getHeader()` and `.getContent()` are REMOVED

Use these alternatives instead: 

- `.getHeader()` -> `.getTitle()`
- `.getContent()` -> `.getHtmlContainer()`

---

## 💅  Styling change # 1 - Update buttons color

Before | After
-|-
<img src="https://user-images.githubusercontent.com/6059356/118318485-20377700-b502-11eb-9b40-bc7c749c5a8f.png" width="300"> | <img src="https://user-images.githubusercontent.com/6059356/118318825-95a34780-b502-11eb-832f-4fbbd7101569.png" width="300">


## 💅  Styling change # 2 - Switch to CSS Grid Layout

CSS Grid provides much more possibilities for reordering elements inside a popup. 

## 💅  Styling change # 3 - Refreshed look for toasts

<img src="https://user-images.githubusercontent.com/6059356/114709751-a448e400-9d35-11eb-85a0-e24867926da3.png" width="400">

## 💅  Styling change # 4 - Loaded in toasts moved to the left side (instead of the icon)

![CleanShot 2021-05-14 at 14 56 30](https://user-images.githubusercontent.com/6059356/118267396-adf47180-b4c4-11eb-826c-487cc3f9616f.gif)


