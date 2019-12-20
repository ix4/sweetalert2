import Swal from '../../src/sweetalert2'
import { $, isHidden, isVisible, SwalWithoutAnimation, triggerKeydownEvent, TIMEOUT } from '../utils'
import { measureScrollbar } from '../../src/utils/dom/measureScrollbar'
import { toArray } from '../../src/utils/utils'
import { iconTypes, swalClasses } from '../../src/utils/classes'

describe('Params', function () {
  describe('customClass', () => {
    it('customClass as a string', () => {
      Swal.fire({ customClass: 'custom-class' })
      expect(Swal.getPopup().classList.contains('custom-class')).to.be.true
    })

    it('customClass as an object', () => {
      Swal.fire({
        icon: 'question',
        input: 'text',
        imageUrl: '/assets/swal2-logo.png',
        customClass: {
          container: 'container-class',
          popup: 'popup-class',
          header: 'header-class',
          title: 'title-class',
          closeButton: 'close-button-class',
          icon: 'icon-class',
          image: 'image-class',
          content: 'content-class',
          input: 'input-class',
          actions: 'actions-class',
          confirmButton: 'confirm-button-class',
          cancelButton: 'cancel-button-class',
          footer: 'footer-class'
        }
      })
      expect(Swal.getContainer().classList.contains('container-class')).to.be.true
      expect(Swal.getPopup().classList.contains('popup-class')).to.be.true
      expect(Swal.getHeader().classList.contains('header-class')).to.be.true
      expect(Swal.getTitle().classList.contains('title-class')).to.be.true
      expect(Swal.getCloseButton().classList.contains('close-button-class')).to.be.true
      expect(Swal.getIcon().classList.contains('icon-class')).to.be.true
      expect(Swal.getImage().classList.contains('image-class')).to.be.true
      expect(Swal.getContent().classList.contains('content-class')).to.be.true
      expect(Swal.getInput().classList.contains('input-class')).to.be.true
      expect(Swal.getActions().classList.contains('actions-class')).to.be.true
      expect(Swal.getConfirmButton().classList.contains('confirm-button-class')).to.be.true
      expect(Swal.getCancelButton().classList.contains('cancel-button-class')).to.be.true
      expect(Swal.getFooter().classList.contains('footer-class')).to.be.true
    })

    it('only visible input has custom class', () => {
      Swal.fire({
        input: 'checkbox',
        customClass: {
          input: 'input-class',
        }
      })
      expect($('.swal2-checkbox').classList.contains('input-class')).to.be.true
      expect(Swal.getInput().classList.contains('input-class')).to.be.false
    })

    it('customClass as an object with the only one key', () => {
      Swal.fire({
        title: 'I should have a custom classname',
        customClass: {
          title: 'title-class',
        }
      })
      expect(Swal.getTitle().classList.contains('title-class')).to.be.true
    })

    it('should throw console warning about unexpected type of customClass', () => {
      const spy = cy.spy(console, 'warn')
      Swal.fire({
        customClass: {
          title: {},
          popup: 14,
        }
      })
      expect(spy.calledWith('SweetAlert2: Invalid type of customClass.title! Expected string or iterable object, got "object"')).to.be.true
      expect(spy.calledWith('SweetAlert2: Invalid type of customClass.popup! Expected string or iterable object, got "number"')).to.be.true
    })
  })

  describe('grow', () => {
    it('grow row', () => {
      Swal.fire({
        grow: 'row'
      })
      const containerStyles = window.getComputedStyle(Swal.getContainer())
      expect(Swal.getPopup().clientWidth).to.equal(
        parseInt(Swal.getContainer().clientWidth - parseFloat(containerStyles.paddingLeft) - parseFloat(containerStyles.paddingRight))
      )
    })

    it('grow column', () => {
      Swal.fire({
        grow: 'column'
      })
      const containerStyles = window.getComputedStyle(Swal.getContainer())
      expect(Swal.getPopup().clientHeight).to.equal(
        parseInt(Swal.getContainer().clientHeight - parseFloat(containerStyles.paddingTop) - parseFloat(containerStyles.paddingBottom))
      )
    })

    it('grow fullscreen', () => {
      Swal.fire({
        grow: 'fullscreen'
      })
      const containerStyles = window.getComputedStyle(Swal.getContainer())

      expect(Swal.getPopup().clientWidth).to.equal(
        parseInt(Swal.getContainer().clientWidth - parseFloat(containerStyles.paddingLeft) - parseFloat(containerStyles.paddingRight))
      )

      expect(Swal.getPopup().clientHeight).to.equal(
        parseInt(Swal.getContainer().clientHeight - parseFloat(containerStyles.paddingTop) - parseFloat(containerStyles.paddingBottom))
      )
    })
  })

  describe('html', () => {
    it('HTMLElement as html', () => {
      const form = document.createElement('form')
      const div = document.createElement('div')
      div.appendChild(document.createElement('label'))
      div.appendChild(document.createElement('input'))
      form.appendChild(div)

      Swal.fire({
        html: form
      })
      expect(Swal.getHtmlContainer().innerHTML).to.be.equal('<form><div><label></label><input></div></form>')
    })
  })

  describe('icon', () => {
    it('The popup should have the icon class', () => {
      for (const icon in iconTypes) {
        SwalWithoutAnimation.fire({ icon })
        assert.ok(Swal.getPopup().classList.contains(swalClasses[`icon-${icon}`]))
      }
    })
  })

  describe('iconHtml', () => {
    it('Success icon with custom HTML', () => {
      Swal.fire({
        icon: 'success',
        iconHtml: '<i class="fa fa-circle"></i>'
      })

      expect(Swal.getIcon().innerHTML).to.be.equal('<div class="swal2-icon-content"><i class="fa fa-circle"></i></div>')
    })
  })

  describe('imageUrl', () => {
    it('imageUrl, imageWidth, imageHeight', () => {
      Swal.fire({
        imageUrl: 'https://sweetalert2.github.io/images/swal2-logo.png',
        imageWidth: 498,
        imageHeight: 84
      })
      expect(Swal.getImage().src).to.be.equal('https://sweetalert2.github.io/images/swal2-logo.png')
      expect(Swal.getImage().style.width).to.be.equal('498px')
      expect(Swal.getImage().style.height).to.be.equal('84px')
    })

    it('image dimentions in custom CSS units', () => {
      Swal.fire({
        imageUrl: 'https://sweetalert2.github.io/images/swal2-logo.png',
        imageWidth: '50%',
        imageHeight: '3em'
      })
      expect(Swal.getImage().style.width).to.be.equal('50%')
      expect(Swal.getImage().style.height).to.be.equal('3em')
    })

    it('image alt text', () => {
      Swal.fire({
        imageUrl: '/assets/swal2-logo.png',
        imageAlt: 'Custom icon',
      })
      expect(Swal.getImage().getAttribute('alt')).to.be.equal('Custom icon')
    })
  })
})

describe('Methods', function () {
  describe('clickConfirm', () => {
    it('clickConfirm() should click the confirm button', (done) => {
      Swal.fire({
        input: 'radio',
        inputOptions: {
          one: 'one',
          two: 'two'
        }
      }).then((result) => {
        expect(result).to.eql({ value: 'two' })
        done()
      })
      $('.swal2-radio').querySelector('input[value="two"]').checked = true
      Swal.clickConfirm()
    })

    it.skip('clickConfirm() should not fail if a popup is not visible', () => {
      SwalWithoutAnimation.fire()
      Swal.close()
      expect(Swal.isVisible()).to.be.false
      Swal.clickConfirm()
    })
  })

  describe('close', () => {
    it.skip('close() method', () => {
      Swal.fire({
        title: 'Swal.close() test'
      })

      Swal.close()
      expect(Swal.getPopup().classList.contains('swal2-hide')).to.be.true
    })

    it('close() resolves to empty object', (done) => {
      Swal.fire().then(result => {
        expect(result).to.be.eql({})
        done()
      })

      Swal.close()
    })

    it.skip('onClose using close() method', (done) => {
      Swal.fire({
        onClose: () => {
          expect(Swal.isVisible()).to.be.true
          done()
        }
      })

      Swal.close()
    })

    it.skip('onAfterClose using close() method', (done) => {
      SwalWithoutAnimation.fire({
        onAfterClose: () => {
          expect(Swal.isVisible()).to.be.false
          done()
        }
      })

      Swal.close()
    })

    it.skip('Swal.fire() inside onAfterClose', (done) => {
      SwalWithoutAnimation.fire({
        onAfterClose: () => {
          expect(Swal.isVisible()).to.be.false
          SwalWithoutAnimation.fire({
            input: 'text',
            onOpen: () => {
              expect(Swal.getInput()).to.not.be.null
              done()
            }
          })
          expect(Swal.isVisible()).to.be.true
        }
      })

      Swal.close()
    })

    it('Swal.close() inside onAfterClose', (done) => {
      Swal.fire({
        onAfterClose: () => {
          Swal.close()
          expect(Swal.isVisible()).to.be.false
          done()
        }
      })

      Swal.close()
    })
  })

  it('getFocusableElements()', () => {
    Swal.fire({
      input: 'text',
      html: `
        <button tabindex="-1"> tabindex -1 </button>
        <div tabindex="0">tabindex 0</div>
        <div tabindex="3">tabindex 3</div>
        <div tabindex="2">tabindex 2.1</div>
        <div tabindex="2">tabindex 2.2</div>
        <div tabindex="1">tabindex 1</div>
      `,
      showCancelButton: true,
      showCloseButton: true
    })
    const focusableElements = Swal.getFocusableElements()
    expect(focusableElements.length).to.be.equal(9)
    expect(focusableElements[0].textContent).to.be.equal('tabindex 1')
    expect(focusableElements[1].textContent).to.be.equal('tabindex 2.1')
    expect(focusableElements[2].textContent).to.be.equal('tabindex 2.2')
    expect(focusableElements[3].textContent).to.be.equal('tabindex 3')
    expect(focusableElements[4]).to.be.equal(Swal.getCloseButton())
    expect(focusableElements[5].textContent).to.be.equal('tabindex 0')
    expect(focusableElements[6]).to.be.equal(Swal.getInput())
    expect(focusableElements[7]).to.be.equal(Swal.getConfirmButton())
    expect(focusableElements[8]).to.be.equal(Swal.getCancelButton())
  })

  it('getIcon()', () => {
    Swal.fire({ icon: 'success' })
    expect(Swal.getIcon()).to.be.equal($('.swal2-success'))
  })

  it('getIcons()', () => {
    Swal.fire({ icon: 'success' })
    const icons = Swal.getIcons()
    expect(icons.length).to.be.equal(5)
    expect(icons.filter(icon => icon.className.match('success'))[0].style.display).to.be.equal('flex')
    expect(icons.filter(icon => icon.className.match('error'))[0].style.display).to.be.equal('none')
    expect(icons.filter(icon => icon.className.match('question'))[0].style.display).to.be.equal('none')
    expect(icons.filter(icon => icon.className.match('warning'))[0].style.display).to.be.equal('none')
    expect(icons.filter(icon => icon.className.match('info'))[0].style.display).to.be.equal('none')
  })
})

describe('API', () => {
  it.skip('properties of `Swal` class are consistent', (done) => {
    const assertConsistent = postfix => {
      const currentSwalPropNames = Object.keys(Swal)
      // const extraPropNames = currentSwalPropNames.filter(key => !initialSwalPropNames.includes(key))
      // expect(extraPropNames.length, 0).to.be.eql(`# of extra properties ${postfix}`)
      // expect(extraPropNames.join(','), '').to.be.eql(`extra property names ${postfix}`)
      const missingProps = currentSwalPropNames.filter(key => !currentSwalPropNames.includes(key))
      assert.deepEqual(missingProps.length, 0, `# of missing properties ${postfix}`)
      assert.deepEqual(missingProps.join(','), '', `missing property names ${postfix}`)
    }
    assertConsistent('before first swal')
    Swal.fire({
      title: 'test',
      onOpen: () => {
        assertConsistent('after opening first swal')
        Swal.clickConfirm()
      }
    }).then(() => {
      assertConsistent('after closing first swal')
      done()
    })
  })

  it('ways to instantiate', () => {
    expect((new Swal('foo')) instanceof Swal).to.be.true
    expect(Swal.fire('foo') instanceof Swal).to.be.true
  })

  it('instance properties and methods', () => {
    const params = { input: 'text', inputValue: 'foo' }
    const swal = Swal.fire(params)
    expect(Object.keys(swal)).to.be.eql(['params'])
    expect(swal.params).to.be.eql(params)
    expect(swal.getInput().value).to.be.equal('foo')
  })

  it('extending swal', (done) => {
    const MySwal = class extends Swal {
      static argsToParams (args) {
        expect(args).to.be.eql(['arg'])
        return { title: 'title' }
      }

      _main (params) {
        expect(params).to.be.eql({ title: 'title' })
        return super._main({
          input: 'text',
          inputValue: 'inputValue',
          onOpen: () => MySwal.clickConfirm()
        }).then(result => {
          expect(result).to.be.eql({ value: 'inputValue' })
          return 'result'
        })
      }
    }
    MySwal.fire('arg').then(result => {
      expect(result).to.equal('result')
      done()
    })
  })
})

describe('Miscellaneous tests', function () {
  it('version is correct semver', () => {
    expect(!!Swal.version.match(/\d+\.\d+\.\d+/)).to.be.true
  })

  it('modal shows up', () => {
    Swal.fire('Hello world!')
    expect(Swal.isVisible()).to.be.true
  })

  it('the icon is shown', () => {
    Swal.fire('', '', 'success')
    expect(Swal.getIcon().classList.contains('swal2-success')).to.be.true
  })

  it('modal scrolled to top on open', (done) => {
    Swal.fire({
      imageUrl: 'https://placeholder.pics/svg/300x1500',
      imageHeight: 1500,
      imageAlt: 'A tall image',
      onOpen: () => {
        setTimeout(() => {
          expect(Swal.getContainer().scrollTop).to.equal(0)
          done()
        })
      }
    })
  })

  it('should throw console warning about invalid params', () => {
    const spy = cy.spy(console, 'warn')
    Swal.fire({ invalidParam: 'oops' })
    expect(spy.calledWith('SweetAlert2: Unknown parameter "invalidParam"')).to.be.true
  })

  it('should throw console error about unexpected params', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire('Hello world!', { icon: 'success' })
    expect(spy.calledWith('SweetAlert2: Unexpected type of html! Expected "string" or "Element", got object')).to.be.true
  })

  it('should not throw console error about undefined params and treat them as empty strings', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire(undefined, 'Hello world!', undefined)
    expect(spy.notCalled).to.be.true
  })

  it('should accept Elements as shorhand params', () => {
    const title = document.createElement('strong')
    title.innerHTML = 'title'
    const content = document.createElement('a')
    content.innerHTML = 'content'
    Swal.fire(title, content, 'success')
    expect(Swal.getTitle().innerHTML).to.equal('<strong>title</strong>')
    expect(Swal.getHtmlContainer().innerHTML).to.equal('<a>content</a>')
  })

  it('should not throw console error when <svg> tags are present (#1289)', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const spy = cy.spy(console, 'error')
    Swal.fire({})
    expect(spy.notCalled).to.be.true
  })

  it('should show the popup with OK button in case of empty object passed as an argument', () => {
    Swal.fire({})
    expect(isVisible(Swal.getConfirmButton())).to.be.true
    expect(isHidden(Swal.getCancelButton())).to.be.true
    expect(Swal.getTitle().textContent).to.equal('')
    expect(Swal.getContent().textContent).to.equal('')
    expect(isHidden(Swal.getFooter())).to.be.true
  })

  it.skip('the vertical scrollbar should be hidden and the according padding-right should be set', (done) => {
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '30px'

    const scrollbarWidth = measureScrollbar()

    Swal.fire({
      title: 'The body has visible scrollbar, I will hide it and adjust padding-right on body',
      onAfterClose: () => {
        expect(bodyStyles.paddingRight).to.equal('30px')
        document.body.removeChild(talltDiv)
        done()
      }
    })
    const bodyStyles = window.getComputedStyle(document.body)

    expect(bodyStyles.paddingRight).to.equal(`${scrollbarWidth + 30}px`)
    expect(bodyStyles.overflow).to.equal('hidden')
    Swal.clickConfirm()
  })

  it('scrollbarPadding disabled', () => {
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '30px'

    Swal.fire({
      title: 'Padding right adjustment disabled',
      scrollbarPadding: false,
      onAfterClose: () => {
        document.body.removeChild(talltDiv)
      }
    })

    const bodyStyles = window.getComputedStyle(document.body)
    expect(bodyStyles.paddingRight).to.equal('30px')
    Swal.clickConfirm()
  })

  it('the vertical scrollbar should be restored before a toast is fired after a modal', (done) => {
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '30px'

    Swal.fire({
      title: 'The body has visible scrollbar, I will hide it and adjust padding-right on body'
    }).then(() => {
      Swal.fire({
        text: 'Body padding-right should be restored',
        toast: true,
        onOpen: () => {
          expect(bodyStyles.paddingRight).to.equal('30px')
          document.body.removeChild(talltDiv)
          done()
        }
      })
    })

    const bodyStyles = window.getComputedStyle(document.body)
    Swal.clickConfirm()
  })

  it('modal width', () => {
    Swal.fire({ text: '300px', width: 300 })
    expect(Swal.getPopup().style.width).to.equal('300px')

    Swal.fire({ text: '400px', width: '400px' })
    expect(Swal.getPopup().style.width).to.equal('400px')

    Swal.fire({ text: '90%', width: '90%' })
    expect(Swal.getPopup().style.width).to.equal('90%')
  })

  it('heightAuto', () => {
    Swal.fire('I should set .swal2-height-auto class to html and body')
    expect(document.documentElement.classList.contains('swal2-height-auto')).to.be.true

    Swal.fire({
      title: 'I am modeless and should not set .swal2-height-auto',
      backdrop: false
    })
    expect(document.documentElement.classList.contains('swal2-height-auto')).to.be.true

    Swal.fire({
      title: 'I am toast and should not set .swal2-height-auto',
      toast: true
    })
    expect(document.documentElement.classList.contains('swal2-height-auto')).to.be.true
  })

  it('getters', () => {
    Swal.fire('Title', 'Content')
    expect(Swal.getTitle().innerText).to.equal('Title')
    expect(Swal.getContent().innerText.trim()).to.equal('Content')

    Swal.fire({
      showCancelButton: true,
      imageUrl: '/assets/swal2-logo.png',
      confirmButtonText: 'Confirm button',
      confirmButtonAriaLabel: 'Confirm button aria-label',
      cancelButtonText: 'Cancel button',
      cancelButtonAriaLabel: 'Cancel button aria-label',
      footer: '<b>Footer</b>'
    })
    expect(Swal.getImage().src.includes('/assets/swal2-logo.png')).to.be.true
    expect(Swal.getActions().textContent).to.equal('Confirm buttonCancel button')
    expect(Swal.getConfirmButton().innerText).to.equal('Confirm button')
    expect(Swal.getCancelButton().innerText).to.equal('Cancel button')
    expect(Swal.getConfirmButton().getAttribute('aria-label')).to.equal('Confirm button aria-label')
    expect(Swal.getCancelButton().getAttribute('aria-label')).to.equal('Cancel button aria-label')
    expect(Swal.getFooter().innerHTML).to.equal('<b>Footer</b>')

    Swal.fire({ input: 'text' })
    Swal.getInput().value = 'input text'
    expect(Swal.getInput().value).to.equal('input text')

    Swal.fire({
      input: 'radio',
      inputOptions: {
        one: 'one',
        two: 'two'
      }
    })
    $('.swal2-radio input[value="two"]').setAttribute('checked', true)
    expect(Swal.getInput().value).to.equal('two')
  })

  it('content/title is set (html)', () => {
    Swal.fire({
      title: '<strong>Strong</strong>, <em>Emphasis</em>',
      html: '<p>Paragraph</p><img /><button></button>'
    })

    expect(Swal.getTitle().querySelectorAll('strong, em').length).to.equal(2)
    expect(Swal.getContent().querySelectorAll('p, img, button').length).to.equal(3)
  })

  it('content/title is set (text)', () => {
    Swal.fire({
      titleText: '<strong>Strong</strong>, <em>Emphasis</em>',
      text: '<p>Paragraph</p><img /><button></button>'
    })

    expect(Swal.getTitle().innerHTML, '&lt;strong&gt;Strong&lt;/strong&gt;).to.equal(&lt;em&gt;Emphasis&lt;/em&gt;')
    expect(Swal.getHtmlContainer().innerHTML).to.equal('&lt;p&gt;Paragraph&lt;/p&gt;&lt;img /&gt;&lt;button&gt;&lt;/button&gt;')
    expect(Swal.getTitle().querySelectorAll('strong, em').length).to.equal(0)
    expect(Swal.getContent().querySelectorAll('p, img, button').length).to.equal(0)
  })

  it('JS element as html param', () => {
    const p = document.createElement('p')
    p.textContent = 'js element'
    Swal.fire({
      html: p
    })
    expect(Swal.getHtmlContainer().innerHTML).to.equal('<p>js element</p>')
  })

  it.skip('validation message', (done) => {
    const inputValidator = (value) => Promise.resolve(!value && 'no falsy values')

    SwalWithoutAnimation.fire({ input: 'text', inputValidator })
    expect(isHidden(Swal.getValidationMessage())).to.be.true
    setTimeout(() => {
      const initialModalHeight = Swal.getPopup().offsetHeight

      Swal.clickConfirm()
      setTimeout(() => {
        expect(isVisible(Swal.getValidationMessage())).to.be.true
        expect(Swal.getValidationMessage().textContent).to.equal('no falsy values')
        expect(Swal.getInput().getAttribute('aria-invalid')).to.be.true
        expect(Swal.getPopup().offsetHeight > initialModalHeight).to.be.true

        Swal.getInput().value = 'blah-blah'

        // setting the value programmatically will not trigger the 'input' event,
        // doing that manually
        const event = document.createEvent('Event')
        event.initEvent('input', true, true)
        Swal.getInput().dispatchEvent(event)

        expect(isHidden(Swal.getValidationMessage())).to.be.true
        expect(Swal.getInput().getAttribute('aria-invalid')).to.be.false
        expect(Swal.getPopup().offsetHeight === initialModalHeight).to.be.true
        done()
      }, TIMEOUT)
    }, TIMEOUT)
  })

  it('should throw console error about unexpected type of InputOptions', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire({ input: 'select', inputOptions: 'invalid-input-options' })
    expect(spy.calledWith('SweetAlert2: Unexpected type of inputOptions! Expected object, Map or Promise, got string')).to.be.true
  })

  it('showLoading and hideLoading', () => {
    Swal.showLoading()
    expect(Swal.getActions().classList.contains('swal2-loading')).to.be.true

    Swal.hideLoading()
    expect(Swal.getActions().classList.contains('swal2-loading')).to.be.false

    Swal.fire({
      title: 'test loading state',
      showConfirmButton: false
    })

    Swal.showLoading()
    expect(isVisible(Swal.getActions())).to.be.true
    expect(Swal.getActions().classList.contains('swal2-loading')).to.be.true

    Swal.hideLoading()
    expect(isVisible(Swal.getActions())).to.be.false
    expect(Swal.getActions().classList.contains('swal2-loading')).to.be.false
  })

  it('disable/enable buttons', () => {
    Swal.fire('test disable/enable buttons')

    Swal.disableButtons()
    expect(Swal.getConfirmButton().disabled).to.be.true
    expect(Swal.getCancelButton().disabled).to.be.true

    Swal.enableButtons()
    expect(Swal.getConfirmButton().disabled).to.be.false
    expect(Swal.getCancelButton().disabled).to.be.false
  })

  it('disable/enable input', () => {
    Swal.fire('(disable/enable)Input should not fail if there is no input')
    Swal.disableInput()
    Swal.enableInput()

    Swal.fire({
      input: 'text'
    })

    Swal.disableInput()
    expect(Swal.getInput().disabled).to.be.true
    Swal.enableInput()
    expect(Swal.getInput().disabled).to.be.false

    Swal.fire({
      input: 'radio',
      inputOptions: {
        one: 'one',
        two: 'two'
      }
    })

    Swal.disableInput()
    toArray($('.swal2-radio').querySelectorAll('radio')).forEach((radio) => {
      expect(radio.disabled).to.be.true
    })
    Swal.enableInput()
    toArray($('.swal2-radio').querySelectorAll('radio')).forEach((radio) => {
      expect(radio.disabled).to.be.false
    })
  })

  it('reversed buttons', () => {
    Swal.fire({
      text: 'Modal with reversed buttons',
      showCancelButton: true,
      reverseButtons: true
    })
    expect(Swal.getConfirmButton().previousSibling).to.equal(Swal.getCancelButton())

    Swal.fire('Modal with buttons')
    expect(Swal.getCancelButton().previousSibling).to.equal(Swal.getConfirmButton())
  })

  it.skip('modal vertical offset', () => {
    const done = assert.async(1)
    // create a modal with dynamic-height content
    SwalWithoutAnimation.fire({
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNikAQAACIAHF/uBd8AAAAASUVORK5CYII=',
      title: 'Title',
      html: '<hr><div style="height: 50px"></div><p>Text content</p>',
      icon: 'warning',
      input: 'text'
    })

    // listen for image load
    Swal.getImage().addEventListener('load', () => {
      const box = Swal.getPopup().getBoundingClientRect()
      const delta = box.top - (box.bottom - box.height)
      // allow 1px difference, in case of uneven height
      expect(Math.abs(delta) <= 1).to.be.true
      done()
    })
  })

  it('onOpen', (done) => {
    // create a modal with an onOpen callback
    Swal.fire({
      title: 'onOpen test',
      onOpen: (modal) => {
        expect(Swal.getPopup()).to.equal(modal)
        done()
      }
    })
  })

  it('onBeforeOpen', (done) => {
    // create a modal with an onBeforeOpen callback
    Swal.fire({
      title: 'onBeforeOpen test',
      onBeforeOpen: (modal) => {
        expect(Swal.isVisible()).to.be.false
        expect(Swal.getPopup()).to.equal(modal)
      }
    })

    // check that onBeforeOpen calls properly
    const dynamicTitle = 'Set onBeforeOpen title'
    Swal.fire({
      title: 'onBeforeOpen test',
      onBeforeOpen: () => {
        Swal.getTitle().innerHTML = dynamicTitle
      },
      onOpen: () => {
        expect(Swal.getTitle().innerHTML).to.equal(dynamicTitle)
        done()
      }
    })
  })

  it('onRender', () => {
    const onRender = cy.spy()

    // create a modal with an onRender callback
    // the onRender hook should be called once here
    Swal.fire({
      title: 'onRender test',
      onRender
    })

    expect(onRender.calledOnce).to.be.true

    // update the modal, causing a new render
    // the onRender hook should be called once again
    Swal.update({})

    expect(onRender.calledTwice).to.be.true

    // the modal element must always be passed to the onRender hook
    expect(onRender.alwaysCalledWithExactly(Swal.getPopup())).to.be.true
  })

  it('onAfterClose', (done) => {
    let onCloseFinished = false

    // create a modal with an onAfterClose callback
    Swal.fire({
      title: 'onAfterClose test',
      onClose: () => {
        onCloseFinished = true
      },
      onAfterClose: () => {
        expect(onCloseFinished).to.be.true
        expect(Swal.getContainer()).to.be.null
        done()
      }
    })

    Swal.getCloseButton().click()
  })

  it('onClose', (done) => {
    // create a modal with an onClose callback
    Swal.fire({
      title: 'onClose test',
      onClose: (_modal) => {
        expect(modal).to.equal(_modal)
        expect(Swal.getContainer()).to.equal($('.swal2-container'))
        done()
      }
    })

    const modal = Swal.getPopup()
    Swal.getCloseButton().click()
  })

  it('Swal.fire() in onClose', (done) => {
    Swal.fire({
      title: 'onClose test',
      onClose: () => {
        Swal.fire({
          text: 'OnClose',
          input: 'text',
          customClass: {
            input: 'on-close-swal'
          }
        })
      }
    }).then(() => {
      expect(Swal.isVisible()).to.be.true
      expect(Swal.getInput().classList.contains('on-close-swal')).to.be.true
      done()
    })

    Swal.clickConfirm()
  })

  it('esc key', (done) => {
    document.body.addEventListener('keydown', () => {
      throw new Error('Should not propagate keydown event to body!')
    })

    SwalWithoutAnimation.fire({
      title: 'Esc me',
      onOpen: () => triggerKeydownEvent(Swal.getPopup(), 'Escape')
    }).then((result) => {
      expect(result).to.eql({ dismiss: Swal.DismissReason.esc })
      done()
    })
  })

  it('allowEscapeKey as a function', (done) => {
    let functionWasCalled = false

    SwalWithoutAnimation.fire({
      title: 'allowEscapeKey as a function',
      allowEscapeKey: () => {
        functionWasCalled = true
        return false
      },
      onOpen: () => {
        expect(functionWasCalled).to.equal(false)

        triggerKeydownEvent(Swal.getPopup(), 'Escape')

        setTimeout(() => {
          expect(functionWasCalled).to.equal(true)
          expect(Swal.isVisible()).to.be.true

          done()
        })
      }
    })
  })

  it('close button', (done) => {
    Swal.fire({
      title: 'Close button test',
      showCloseButton: true
    }).then((result) => {
      expect(result).to.eql({ dismiss: Swal.DismissReason.close })
      done()
    })

    const closeButton = Swal.getCloseButton()
    expect(isVisible(closeButton)).to.be.true
    expect(closeButton.getAttribute('aria-label')).to.equal('Close this dialog')
    closeButton.click()
  })

  it('close button customization', () => {
    Swal.fire({
      title: 'Customized Close button test',
      showCloseButton: true,
      closeButtonHtml: 'c'
    })

    const closeButton = Swal.getCloseButton()
    expect(closeButton.innerHTML).to.equal('c')
  })

  it('cancel button', (done) => {
    Swal.fire({
      title: 'Cancel me'
    }).then((result) => {
      expect(result).to.eql({ dismiss: Swal.DismissReason.cancel })
      done()
    })

    Swal.clickCancel()
  })

  it('timer', (done) => {
    SwalWithoutAnimation.fire({
      title: 'Timer test',
      timer: 10
    }).then((result) => {
      expect(result).to.eql({ dismiss: Swal.DismissReason.timer })
      done()
    })
  })

  it('params validation', () => {
    expect(Swal.isValidParameter('title')).to.be.true
    expect(Swal.isValidParameter('foobar')).to.be.false
  })

  it('addition and removal of backdrop', () => {
    Swal.fire({ backdrop: false })
    expect(document.body.classList.contains('swal2-no-backdrop')).to.be.true
    expect(document.documentElement.classList.contains('swal2-no-backdrop')).to.be.true
    Swal.fire({ title: 'test' })
    expect(document.body.classList.contains('swal2-no-backdrop')).to.be.false
    expect(document.documentElement.classList.contains('swal2-no-backdrop')).to.be.false
  })

  it('footer', () => {
    Swal.fire({ title: 'Modal with footer', footer: 'I am footer' })
    expect(isVisible(Swal.getFooter())).to.be.true

    Swal.fire('Modal w/o footer')
    expect(isHidden(Swal.getFooter())).to.be.true
  })

  it('visual apperarance', () => {
    Swal.fire({
      padding: '2em',
      background: 'red',
      confirmButtonColor: 'green',
      cancelButtonColor: 'blue'
    })

    expect(Swal.getPopup().style.padding).to.equal('2em')
    expect(window.getComputedStyle(Swal.getPopup()).backgroundColor, 'rgb(255, 0).to.equal(0)')
    expect(Swal.getConfirmButton().style.backgroundColor).to.equal('green')
    expect(Swal.getCancelButton().style.backgroundColor).to.equal('blue')
  })

  it('null values', () => {
    const defaultParams = require('../../src/utils/params').default
    const params = {}
    Object.keys(defaultParams).forEach(key => {
      params[key] = null
    })
    Swal.fire(params)
    expect(Swal.isVisible()).to.be.true
  })

  it('backdrop accepts css background param', () => {
    Swal.fire({
      title: 'I have no backdrop',
      backdrop: false
    })
    expect(Swal.getContainer().style.background).to.equal('')

    const backdrop = 'rgb(123, 123, 123)'
    Swal.fire({
      title: 'I have a custom backdrop',
      backdrop
    })
    expect(Swal.getContainer().style.background.includes(backdrop)).to.be.true
  })

  it('preConfirm return false', () => {
    SwalWithoutAnimation.fire({
      preConfirm: () => {
        return false
      }
    })

    Swal.clickConfirm()
    expect(Swal.isVisible()).to.be.true
  })

  it('Custom content', (done) => {
    Swal.fire({
      showCancelButton: true,
      onOpen: () => {
        Swal.getContent().textContent = 'Custom content'
        Swal.clickConfirm()
      },
      preConfirm: () => {
        return 'Some data from custom control'
      }
    }).then(result => {
      expect(result.value).to.equal('Some data from custom control')
      done()
    })
  })

  it('preConfirm returns 0', (done) => {
    SwalWithoutAnimation.fire({
      onOpen: () => {
        Swal.clickConfirm()
      },
      preConfirm: () => {
        return 0
      }
    }).then(result => {
      expect(result.value).to.equal(0)
      done()
    })
  })

  it('Model shows with swal2 classes used in html', () => {
    Swal.fire({
      html: '<span class="swal2-cancel"></span>'
    })
    expect(Swal.getPopup().classList.contains('swal2-show')).to.be.true
    Swal.close()
  })
})
