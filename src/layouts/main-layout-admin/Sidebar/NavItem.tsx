import { Link, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { NavItem as NavItemProps } from 'components/nav-items/nav-items-admin';
import { useLocation } from 'react-router-dom';

const NavItem = ({
  navItem,
  open,
  onClick,
}: {
  navItem: NavItemProps;
  open: boolean;
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
}) => {
  const { pathname } = useLocation();
  return (
    <ListItem
      disablePadding
      sx={(theme) => ({
        display: 'block',
        px: 5,
        borderRight: !open
          ? pathname === navItem.path
            ? `3px solid ${theme.palette.primary.main}`
            : `3px solid transparent`
          : '',
      })}
    >
      <ListItemButton
        LinkComponent={Link}
        href={navItem.path}
        onClick={onClick}
        sx={{
          opacity: navItem.active ? 1 : 0.5,
          bgcolor: pathname === navItem.path ? (open ? 'primary.main' : '') : 'background.default',
          '&:hover': {
            bgcolor:
              pathname === navItem.path
                ? open
                  ? 'primary.dark'
                  : 'background.paper'
                : 'background.paper',
          },
          '& .MuiTouchRipple-root': {
            color: pathname === navItem.path ? 'primary.main' : 'text.disabled',
          },
        }}
      >
        <ListItemIcon
          sx={{
            width: 20,
            height: 20,
            mr: open ? 'auto' : 0,
            color:
              pathname === navItem.path
                ? open
                  ? 'background.default'
                  : 'primary.main'
                : 'text.primary',
          }}
        >
          {/*el icono que se muestra en el sidebar (barra lateral)*/}
          <IconifyIcon icon={navItem.icon} width={1} height={1} />
        </ListItemIcon>
        <ListItemText
          primary={navItem.title}
          sx={{
            display: open ? 'inline-block' : 'none',
            opacity: open ? 1 : 0,
            color: pathname === navItem.path ? 'background.default' : '',
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default NavItem;
