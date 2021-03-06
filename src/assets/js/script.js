console.log("Loaded!!");

$('#showhidepassword').on('click', function() {
  let that = this
  let prev = $(that).prev()
  let bool = prev.attr('type') == 'password'
  let confirm = $('input[name="password_confirmation"]')
  let icon = bool ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>'
  prev.attr('type', bool ? 'text' : 'password')
  $(that).find('.icon').html(icon)
  if (confirm) confirm.attr('type', bool ? 'text' : 'password')
})

let year = new Date().getFullYear()
$('#year').html(year === 2019 ? year : `2019 - ${year}`)

class Landing {
  constructor(options) {
    let defaultOptions = {
      parallaxElement: '#parallax-hero .parallax',
      parallaxMaxScroll: 10000,
    }

    this.options = options ? Object.assign(defaultOptions, options) : defaultOptions;
    this.parallaxElement = document.querySelector(this.options.parallaxElement) || []
  }

  init() {
    this._parallaxScroll()
  }

  _parallaxScroll() {
    this.parallaxElement.classList.add(this._parallaxTime())
    window.addEventListener('load', () => this._parallaxAction())
    window.addEventListener('scroll', () => this._parallaxAction())
  }

  _parallaxAction() {
    let y = window.pageYOffset
    let layers = this.parallaxElement.querySelectorAll('.layer')
    let layer, speed, yPos
    for (let i = 0; i < layers.length; i++) {
      layer = layers[i]
      speed = layer.getAttribute('data-parallax-speed')
      if (y > this.options.parallaxMaxScroll) return
      yPos = Math.floor(-(y * speed))
      layer.setAttribute(
        'style',
        'transform: translate3d(0px, ' + yPos + 'px, 0px)'
      )
    }
  }

  _parallaxTime() {
    let d = new Date()
    let hours = d.getHours()
    if (hours >= 18) {
      return 'malam'
    } else if (hours >= 17) {
      return 'sore'
    } else if (hours >= 10) {
      return 'siang'
    } else if (hours >= 4) {
      return 'pagi'
    } else {
      return 'malam'
    }
  }
}

new Landing().init()