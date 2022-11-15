const { ERROR_MESSAGE } = require('../../src/js/constants/index.js');
const { SELECTOR } = require('../constants/selector.js');

beforeEach(() => {
  cy.visit('index.html');
});

const buyLotto = (price) => {
  cy.getByDataset(SELECTOR.PURCHASE_PRICE_INPUT).type(price);
  cy.getByDataset(SELECTOR.PURCHASE_BUTTON).click();
};

describe('로또 어플리케이션을 테스트한다.', () => {
  describe('로또 구입 금액을 입력할 수 있다.', () => {
    it('화면에 구입 금액을 입력할 input 태그가 존재한다.', () => {
      cy.getByDataset(SELECTOR.PURCHASE_PRICE_INPUT).should('exist');
    });

    it('input 태그에 구입 금액을 입력하면 입력한 금액이 input 태그의 value 값과 같아야 한다.', () => {
      cy.getByDataset(SELECTOR.PURCHASE_PRICE_INPUT).type('5000');

      cy.getByDataset(SELECTOR.PURCHASE_PRICE_INPUT).should('have.value', '5000');
    });

    it('구입 금액은 숫자만 입력할 수 있다.', () => {
      cy.getByDataset(SELECTOR.PURCHASE_PRICE_INPUT).type('ab2000cd');

      cy.getByDataset(SELECTOR.PURCHASE_PRICE_INPUT).should('have.value', '2000');
    });
  });

  describe('로또 구입 금액에 해당하는 로또를 발급해야 한다.', () => {
    it('화면에 로또를 발급할 때 클릭해야 할 버튼이 존재한다.', () => {
      cy.getByDataset(SELECTOR.PURCHASE_BUTTON).should('exist');
    });

    it('로또 구입 금액을 0원으로 입력하고 확인 버튼을 클릭하면 사용자에게 alert를 띄워준다.', () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.getByDataset(SELECTOR.PURCHASE_PRICE_INPUT).type('0');

      cy.getByDataset(SELECTOR.PAYMENT_FORM)
        .submit()
        .then(() => {
          expect(alertStub.getCall(0)).to.be.calledWith(ERROR_MESSAGE.INVALID_ZERO_LOTTO_PRICE);
        });
    });

    it('로또 구입 금액을 음수로 입력하고 확인 버튼을 클릭하면 사용자에게 alert를 띄워준다.', () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.getByDataset(SELECTOR.PURCHASE_PRICE_INPUT).type('-1000');

      cy.getByDataset(SELECTOR.PAYMENT_FORM)
        .submit()
        .then(() => {
          expect(alertStub.getCall(0)).to.be.calledWith(ERROR_MESSAGE.INVALID_NEGATIVE_LOTTO_PRICE);
        });
    });

    it('구입할 금액을 입력하고 확인 버튼을 클릭하면 화면에 구매 안내메시지의 개수가 구입한 로또의 개수와 일치해야 한다.', () => {
      buyLotto('5000');

      cy.getByDataset(SELECTOR.LOTTO_PURCHASE_COUNT_TEXT).should('have.text', '5');
    });

    it('구입할 금액을 입력하고 확인 버튼을 클릭하면 화면에 로또 아이콘의 개수가 구입한 로또의 개수와 일치해야 한다.', () => {
      buyLotto('5000');

      cy.getByDataset(SELECTOR.LOTTO_ICON_LIST).should('have.length', '5');
    });
  });

  describe('로또 1장의 가격은 1,000원이다.', () => {
    it('로또 구입 금액을 1000원 단위로 입력하지 않고 확인 버튼을 클릭하면 사용자에게 alert를 띄워준다.', () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.getByDataset(SELECTOR.PURCHASE_PRICE_INPUT).type('1500');

      cy.getByDataset(SELECTOR.PAYMENT_FORM)
        .submit()
        .then(() => {
          expect(alertStub.getCall(0)).to.be.calledWith(ERROR_MESSAGE.INVALID_LOTTO_PRICE_UNIT);
        });
    });
  });

  describe('복권 번호는 번호보기 토글 버튼을 클릭하면, 볼 수 있어야 한다.', () => {
    it('로또를 발급하고 난 후에, 화면에 번호보기 토글 버튼이 존재한다.', () => {
      buyLotto('5000');

      cy.getByDataset(SELECTOR.LOTTO_NUMBERS_TOGGLE_BUTTON).should('exist');
    });

    it('번호보기 토글 버튼을 클릭하면 각각의 로또 아이콘에 번호가 보여져야 한다.', () => {
      buyLotto('5000');

      cy.getByDataset(SELECTOR.LOTTO_NUMBERS_TOGGLE_BUTTON).check({ force: true });

      cy.getByDataset(SELECTOR.LOTTO_DETAIL_NUMBER).should('exist');
    });

    it('번호보기 토글 버튼을 클릭해서 checked가 된 상태에서 토글 버튼을 다시 클릭하면 로또 아이콘에 번호가 사라져야 한다.', () => {
      buyLotto('5000');

      cy.getByDataset(SELECTOR.LOTTO_NUMBERS_TOGGLE_BUTTON).check({ force: true });
      cy.getByDataset(SELECTOR.LOTTO_NUMBERS_TOGGLE_BUTTON).uncheck({ force: true });

      cy.getByDataset(SELECTOR.LOTTO_DETAIL_NUMBER).should('have.class', 'none');
    });
  });
});
