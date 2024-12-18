import { useState, ReactElement, PropsWithChildren } from 'react';
import { Box, Drawer, Toolbar } from '@mui/material';
import Topbar from '../layout-share/Topbar/Topbar';
import SidebarSoporte from './SidebarSoporte/SiderbarSoporte';
import Footer from '../main-layout-admin/Footer/Footer';

export const drawerOpenWidth = 240;
export const drawerCloseWidth = 110;

const MainLayoutSoporte = ({ children }: PropsWithChildren): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const handleDrawerToggle = () => setOpen(!open);

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Topbar open={open} handleDrawerToggle={handleDrawerToggle} />
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerOpenWidth },
          }}
        >
          <SidebarSoporte open={open} />
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          component="aside"
          open={open}
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: open ? drawerOpenWidth : drawerCloseWidth,
            '& .MuiDrawer-paper': {
              width: open ? drawerOpenWidth : drawerCloseWidth,
            },
          }}
        >
          <SidebarSoporte open={open} />
        </Drawer>
        <Box
          component="main"
          overflow="auto"
          sx={{
            width: 1,
            flexGrow: 1,
            pt: 5,
            pr: { xs: 3, sm: 5.175 },
            pb: 6.25,
            pl: { xs: 3, sm: 5.25 },
          }}
        >
          <Toolbar
            sx={{
              height: 96,
            }}
          />
          {children}
        </Box>
      </Box>
      <Footer open={open} />
    </>
  );
};

export default MainLayoutSoporte;
