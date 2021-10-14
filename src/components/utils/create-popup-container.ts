import { ReactNode, ReactPortal } from 'react';
import { createPortal } from 'react-dom';

const POPUP_CONTAINER_ID = 'popup-container';

export function createPopupContainer(children: ReactNode): ReactPortal {
  let container: Element | null = document.getElementById(POPUP_CONTAINER_ID);

  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', POPUP_CONTAINER_ID);
    document.body.appendChild(container);
  }

  return createPortal(children, container);
};
