/* eslint-disable react-redux/useSelector-prefer-selectors */
import { useSelector } from 'react-redux';

export const useSelectWeb3 = () => useSelector((state) => state.web3Slice);
