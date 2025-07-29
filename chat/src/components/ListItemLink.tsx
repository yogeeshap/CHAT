import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import type { ListItemProps } from '@mui/material';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

type ListItemLinkProps = {
  icon?: React.ReactElement;
  primary: string;
  to: string;
} & Omit<ListItemProps, 'button'>;

const ListItemLink: React.FC<ListItemLinkProps> = (props) => {
  const { icon, primary, to, ...other } = props;

  // Create a memoized component forwarding ref to RouterLink
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, LinkProps>((itemProps, ref) => (
        <RouterLink ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <ListItem button component={renderLink} {...other}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItem>
  );
};

export default ListItemLink;
