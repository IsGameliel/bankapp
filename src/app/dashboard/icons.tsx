// This file centralizes icon imports for dashboard sidebars
import { FaTachometerAlt, FaUsers, FaMoneyCheckAlt, FaExchangeAlt, FaUserCircle, FaSignOutAlt, FaPiggyBank, FaWallet, FaHandHoldingUsd, FaListAlt } from 'react-icons/fa';

export const adminIcons = {
  Overview: FaTachometerAlt,
  Users: FaUsers,
  Loans: FaHandHoldingUsd,
  Transactions: FaListAlt,
  Transfer: FaExchangeAlt,
};

export const customerIcons = {
  Dashboard: FaTachometerAlt,
  Transactions: FaListAlt,
  Deposit: FaPiggyBank,
  Withdrawal: FaWallet,
  Transfer: FaExchangeAlt,
  Loans: FaHandHoldingUsd,
  Profile: FaUserCircle,
};
