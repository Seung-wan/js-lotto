import { ERROR_MESSAGE, LOTTO_PRICE } from '../constants/lotto.js';
import { validation } from '../utils/validation.js';
import {
  getLottoPurchasePrice,
  renderLottoPurchaseCountText,
  renderLottoIcons,
  showPurchasedLotto,
  showLottoResultForm,
  showLottoNumber,
} from '../view/lotto.js';

export const handleSubmit = (e) => {
  e.preventDefault();

  try {
    const lottoPurchasePrice = getLottoPurchasePrice();

    if (!validation.isPositiveNumber(lottoPurchasePrice)) {
      throw Error(ERROR_MESSAGE.INVALID_NEGATIVE_LOTTO_PRICE);
    }
    if (!validation.isRemainderZero(lottoPurchasePrice, LOTTO_PRICE)) {
      throw Error(ERROR_MESSAGE.INVALID_LOTTO_PRICE_UNIT);
    }

    const lottoCount = lottoPurchasePrice / LOTTO_PRICE;

    renderLottoPurchaseCountText(lottoCount);
    renderLottoIcons(lottoCount);

    showPurchasedLotto();
    showLottoResultForm();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

export const handleClickNumberToggle = () => {
  showLottoNumber();
};
