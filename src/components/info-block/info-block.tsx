import React, { FC, useLayoutEffect, useState } from 'react';
import { ReactComponent as IcExpand } from '../../assets/images/expand.svg';
import styles from './info-block.module.scss';

interface InfoBlockProps {
  text: string;
  title?: string;
  expandable?: boolean;
  expanded?: boolean;
  actions?: React.ReactNode;
  onExpandToggle?: (expanded: boolean) => void;
}

export const InfoBlock: FC<InfoBlockProps> = ({
  title,
  text,
  expandable = false,
  expanded = true,
  actions,
  onExpandToggle,
}) => {
  const [isExpanded, setExpanded] = useState<boolean>(expanded);

  useLayoutEffect(() => setExpanded(expanded), [expanded]);

  const handleExpandToggle = () => {
    setExpanded(!isExpanded);
    onExpandToggle?.(!isExpanded);
  };

  return (
    <div className={styles.container}>
      {expandable && title && (
        <button
          type="button"
          className={`${styles.button} ${isExpanded ? styles.expanded : ''}`}
          onClick={handleExpandToggle}
        >
          <span className={styles.title}>{title}</span>
          <IcExpand className={`${styles.icon} ${isExpanded ? styles.expanded : ''}`} />
        </button>
      )}
      {!expandable && title && <p className={styles.title}>{title}</p>}
      {isExpanded && (
        <p className={styles.text}>{text}</p>
      )}
      {actions && (
        <div className={styles.actions}>{actions}</div>
      )}
    </div>
  );
};