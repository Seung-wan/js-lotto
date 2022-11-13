import { SELECTOR } from '../constants/lotto.js';
import { generateLottoNumbersToArray } from '../service/lotto.js';
import { $, $all } from '../utils/dom.js';

const lottoTemplate = (lottoNumbers) => `
<li>
  <span class="mx-1 text-4xl" data-cy="lotto-icon">🎟️ </span>
  <span class="lotto-detail js-lotto-detail-number none" data-cy="lotto-detail-number">${lottoNumbers.join(', ')}</span>
</li>
`;

export const getLottoPurchasePrice = () => $(SELECTOR.PURCHASE_PRICE_INPUT).value;

export const showPurchasedLotto = () => {
  $(SELECTOR.PURCHASED_LOTTO).classList.remove('none');
};

export const showLottoResultForm = () => {
  $(SELECTOR.LOTTO_RESULT_FORM).classList.remove('none');
};

export const showLottoNumber = () => {
  $(SELECTOR.LOTTO_ICON_WRAPPER).classList.toggle('flex-col');
  $all(SELECTOR.LOTTO_DETAIL_NUMBER).forEach((elem) => {
    elem.classList.toggle('none');
  });
};

export const renderLottoPurchaseCountText = (count) => {
  $(SELECTOR.LOTTO_PURCHASE_COUNT_TEXT).textContent = count;
};

export const renderLottoIcons = (count) => {
  const lottoNumbersArray = generateLottoNumbersToArray(count);

  $(SELECTOR.LOTTO_ICON_WRAPPER).innerHTML = lottoNumbersArray.map(lottoTemplate).join('');
};
