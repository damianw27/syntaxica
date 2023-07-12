import React, { PropsWithChildren, ReactElement } from 'react';
import css from '$components/button-group/button-group.module.css';

export function ButtonGroup({ children }: PropsWithChildren): ReactElement {
  return (
    <div className={css.buttonGroup} data-testid="ti-btn-group">
      {children}
    </div>
  );
}
