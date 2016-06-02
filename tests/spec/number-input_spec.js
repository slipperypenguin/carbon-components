import '../utils/es6-weak-map-global'; // For PhantomJS
import '../../consumables/js/polyfills/custom-event';
import NumberInput from '../../consumables/js/es2015/number-input';

describe('Test Number Input', function () {
  describe('Constructor', function () {
    it(`Should throw if root element is not given`, function () {
      expect(() => {
        new NumberInput();
      }).to.throw(Error);
    });

    it(`Should throw if root element is not a DOM element`, function () {
      expect(() => {
        new NumberInput(document.createTextNode(''));
      }).to.throw(Error);
    });
  });

  describe('Adding and Subtracting', function () {
    let input;
    let element;
    let upArrowNode;
    let downArrowNode;
    let inputNode;

    before(function () {
      element = document.createElement('div');
      upArrowNode = element.appendChild(document.createElement('div'));
      upArrowNode.classList.add('bx--number__arrow--icon-up');
      downArrowNode = element.appendChild(document.createElement('div'));
      downArrowNode.classList.add('bx--number__arrow--icon-down');
      inputNode = element.appendChild(document.createElement('input'));
      inputNode.type = 'number';
      inputNode.classList.add('bx--number__input');
      input = new NumberInput(element);
      document.body.appendChild(element);
    });

    beforeEach(function () {
      inputNode.value = '2';
    });

    it(`Should increase the value`, function () {
      upArrowNode.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      expect(inputNode.value).to.equal('3');
    });

    it(`Should decrease the value`, function () {
      downArrowNode.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      expect(inputNode.value).to.equal('1');
    });

    after(function () {
      document.body.removeChild(element);
      input.release();
    });
  });

  describe('Managing instances', function () {
    let element;

    before(function () {
      element = document.createElement('div');
    });

    it('Should prevent creating duplicate instances', function () {
      let first;
      let second;
      try {
        first = NumberInput.create(element);
        second = NumberInput.create(element);
        expect(first).to.equal(second);
      } finally {
        first && first.release();
        if (first !== second) {
          second && second.release();
        }
      }
    });

    it('Should let create a new instance for an element if an earlier one has been released', function () {
      let first;
      let second;
      try {
        first = NumberInput.create(element);
        first.release();
        second = NumberInput.create(element);
        expect(first).not.to.equal(second);
      } finally {
        first && first.release();
        if (first !== second) {
          second && second.release();
        }
      }
    });
  });
});