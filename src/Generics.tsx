import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export function FirewallRuleCenterClientToastContainer() {
  return (
    <ToastContainer
      position='bottom-right'
      autoClose={5000}
      hideProgressBar
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover
      limit={5}
      transition={Flip}
    />
  );
}

export const dateTimeFormatLong = new Intl.DateTimeFormat('de-AT',
  {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
);

export const dateTimeFormatShort = new Intl.DateTimeFormat('de-AT',
  {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
);